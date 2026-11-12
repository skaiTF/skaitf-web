// Exports daily Claude Code token totals from local logs into app/data/ai-usage.json.
// Only dates and token counts are written: no project names, paths or content.
// Claude Code deletes old logs (~30 days), so existing days in the JSON are kept and merged.
// Run with `pnpm ai-usage`; also runs automatically from the git pre-commit hook (scripts/pre-commit).

import { createReadStream, existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createInterface } from "node:readline";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_FILE = join(dirname(fileURLToPath(import.meta.url)), "..", "app", "data", "ai-usage.json");
const LOG_DIR = join(process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude"), "projects");

function findLogs(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return findLogs(path);
    return entry.name.endsWith(".jsonl") ? [path] : [];
  });
}

/** Local calendar date (YYYY-MM-DD) for a timestamp. */
function localDate(timestamp) {
  const d = new Date(timestamp);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

async function collectDays(files) {
  const days = {};
  const seen = new Set();

  for (const file of files) {
    const lines = createInterface({ input: createReadStream(file, "utf8"), crlfDelay: Infinity });
    for await (const line of lines) {
      if (!line.includes('"usage"')) continue;
      let entry;
      try {
        entry = JSON.parse(line);
      } catch {
        continue;
      }
      const usage = entry.message?.usage;
      if (entry.type !== "assistant" || !usage || !entry.timestamp) continue;

      // A streamed response is logged across several lines with the same usage; count it once.
      const key = `${entry.message.id}:${entry.requestId}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const day = (days[localDate(entry.timestamp)] ??= { input: 0, output: 0, cacheWrite: 0, cacheRead: 0 });
      day.input += usage.input_tokens ?? 0;
      day.output += usage.output_tokens ?? 0;
      day.cacheWrite += usage.cache_creation_input_tokens ?? 0;
      day.cacheRead += usage.cache_read_input_tokens ?? 0;
    }
  }
  return days;
}

const files = findLogs(LOG_DIR);
if (files.length === 0) {
  console.warn(`ai-usage: no Claude Code logs found in ${LOG_DIR}; leaving ${OUT_FILE} unchanged.`);
  process.exit(0);
}

const previous = existsSync(OUT_FILE) ? JSON.parse(readFileSync(OUT_FILE, "utf8")) : { days: {} };
const fresh = await collectDays(files);

// Days still in the logs are recomputed; older days survive from the previous export.
const days = { ...previous.days, ...fresh };
const sorted = Object.fromEntries(Object.keys(days).sort().map((date) => [date, days[date]]));

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify({ updatedAt: new Date().toISOString(), days: sorted }, null, 2) + "\n");
console.log(`ai-usage: ${Object.keys(fresh).length} day(s) from ${files.length} log file(s); ${Object.keys(sorted).length} day(s) total.`);
