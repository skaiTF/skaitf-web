"use client";

import { useEffect, useState } from "react";
import { Github } from "lucide-react";
import Heatmap, { type HeatmapDay } from "./Heatmap";
import type { ContributionLevel, GitHubContributions } from "../lib/github";

const GITHUB_PROFILE = "https://github.com/skaiTF";

const LEVEL: Record<ContributionLevel, HeatmapDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

export type ContributionsState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: GitHubContributions };

/** Fetches the cached contribution data from /api/github once on mount. */
export function useContributions(): ContributionsState {
  const [state, setState] = useState<ContributionsState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: GitHubContributions) => !cancelled && setState({ status: "ready", data }))
      .catch(() => !cancelled && setState({ status: "error" }));
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export default function ContributionGraph({ state }: { state: ContributionsState }) {
  const weeks =
    state.status === "ready"
      ? state.data.weeks.map((week) =>
          week.contributionDays.map((day) => ({
            date: day.date,
            count: day.contributionCount,
            level: LEVEL[day.contributionLevel],
          }))
        )
      : null;

  return (
    <Heatmap
      className="mt-4"
      weeks={weeks}
      formatTitle={(day) => `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
      header={
        <>
          <p className="text-sm text-zinc-300">
            {state.status === "ready" && (
              <>
                <span className="text-accent">{state.data.totalContributions.toLocaleString()}</span> contributions in
                the last year
              </>
            )}
            {state.status === "loading" && "Loading contributions…"}
            {state.status === "error" && "Contribution graph unavailable right now."}
          </p>
          <a
            href={GITHUB_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-accent"
          >
            <Github size={14} /> skaiTF
          </a>
        </>
      }
    />
  );
}
