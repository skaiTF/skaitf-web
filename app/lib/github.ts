// Server-only: reads GITHUB_TOKEN. Imported by app/api/github/route.ts, never by client components.

export const GITHUB_USERNAME = "skaiTF";

export type ContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

export interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: ContributionLevel;
}

export interface GitHubContributions {
  /** Contributions over the last 12 months (what the graph shows). */
  totalContributions: number;
  /** Commits since 1 January of the current year. */
  commitsThisYear: number;
  weeks: { contributionDays: ContributionDay[] }[];
}

const QUERY = `
  query ($login: String!, $yearStart: DateTime!) {
    user(login: $login) {
      lastYear: contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount contributionLevel }
          }
        }
      }
      thisYear: contributionsCollection(from: $yearStart) {
        totalCommitContributions
      }
    }
  }
`;

/** Returns null when the token is missing or GitHub errors, so the UI can show a fallback. */
export async function getContributions(): Promise<GitHubContributions | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("GITHUB_TOKEN is not set; the contribution graph is disabled.");
    return null;
  }

  const yearStart = new Date(Date.UTC(new Date().getUTCFullYear(), 0, 1)).toISOString();

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY, variables: { login: GITHUB_USERNAME, yearStart } }),
      next: { revalidate: 3600 },
    });

    const json = await res.json();
    if (!res.ok || json.errors || !json.data?.user) {
      console.error("GitHub contributions request failed:", res.status, json.errors ?? json.message);
      return null;
    }

    const { lastYear, thisYear } = json.data.user;
    return {
      totalContributions: lastYear.contributionCalendar.totalContributions,
      commitsThisYear: thisYear.totalCommitContributions,
      weeks: lastYear.contributionCalendar.weeks,
    };
  } catch (error) {
    console.error("GitHub contributions request failed:", error);
    return null;
  }
}
