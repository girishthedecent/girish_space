import { cacheLife } from "next/cache";
import { leetcodeFallback, site } from "@/content/site";

export type Heatmap = { weeks: ContribDay[][]; total: number; activeDays: number; streak: number };

export type LeetCode = {
  heatmap: Heatmap;
  rating: number;
  topPercentage: number;
  attended: number;
  globalRanking: number;
  badge: string;
  solved: number;
  live: boolean;
};

export async function getLeetCode(): Promise<LeetCode> {
  "use cache";
  cacheLife("days");
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
      body: JSON.stringify({
        query:
          "query($u:String!){userContestRanking(username:$u){rating globalRanking topPercentage attendedContestsCount badge{name}} matchedUser(username:$u){submitStatsGlobal{acSubmissionNum{difficulty count}} userCalendar{streak totalActiveDays submissionCalendar}}}",
        variables: { u: site.usernames.leetcode },
      }),
      signal: AbortSignal.timeout(8000),
    });
    const { data } = await res.json();
    const r = data.userContestRanking;
    const all = data.matchedUser.submitStatsGlobal.acSubmissionNum.find((x: { difficulty: string }) => x.difficulty === "All");
    return {
      rating: Math.round(r.rating),
      topPercentage: r.topPercentage,
      attended: r.attendedContestsCount,
      globalRanking: r.globalRanking,
      badge: r.badge?.name ?? leetcodeFallback.badge,
      solved: all?.count ?? leetcodeFallback.solved,
      heatmap: buildHeatmap(data.matchedUser.userCalendar),
      live: true,
    };
  } catch {
    return { ...leetcodeFallback, heatmap: { weeks: [], total: 0, activeDays: 0, streak: 0 }, live: false };
  }
}

export type ContribDay = { date: string; level: number; row: number; count?: number };

const DAY = 86_400_000;

/** Turns LeetCode's {unixSeconds: count} calendar into a GitHub-style 53-week grid (Sunday rows). */
function buildHeatmap(cal: { streak: number; totalActiveDays: number; submissionCalendar: string }): Heatmap {
  const counts = JSON.parse(cal.submissionCalendar) as Record<string, number>;
  const byDate = new Map(Object.entries(counts).map(([ts, n]) => [new Date(+ts * 1000).toISOString().slice(0, 10), n]));
  const now = new Date();
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  let start = end - 364 * DAY;
  start -= new Date(start).getUTCDay() * DAY; // back to Sunday
  const weeks: ContribDay[][] = [];
  let total = 0;
  for (let t = start, i = 0; t <= end; t += DAY, i++) {
    const date = new Date(t).toISOString().slice(0, 10);
    const count = byDate.get(date) ?? 0;
    total += count;
    const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 9 ? 3 : 4;
    (weeks[Math.floor(i / 7)] ??= []).push({ date, level, row: new Date(t).getUTCDay(), count });
  }
  return { weeks, total, activeDays: cal.totalActiveDays, streak: cal.streak };
}
export type GitHubActivity = { total: number; weeks: ContribDay[][]; live: boolean };

export async function getGitHub(): Promise<GitHubActivity> {
  "use cache";
  cacheLife("days");
  try {
    const res = await fetch(`https://github.com/users/${site.usernames.github}/contributions`, {
      signal: AbortSignal.timeout(8000),
    });
    const html = await res.text();
    const days: { date: string; level: number; row: number; col: number }[] = [];
    const re = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*?id="contribution-day-component-(\d+)-(\d+)"[^>]*?data-level="(\d)"/g;
    for (const m of html.matchAll(re)) days.push({ date: m[1], row: +m[2], col: +m[3], level: +m[4] });
    if (!days.length) throw new Error("no days");
    const cols = Math.max(...days.map((d) => d.col)) + 1;
    const weeks: ContribDay[][] = Array.from({ length: cols }, () => []);
    for (const d of days.sort((a, b) => a.date.localeCompare(b.date))) weeks[d.col].push({ date: d.date, level: d.level, row: d.row });
    const total = Number(html.replace(/\s+/g, " ").match(/([\d,]+) contributions? in the last year/)?.[1].replace(/,/g, "") ?? 0);
    return { total, weeks, live: true };
  } catch {
    return { total: 0, weeks: [], live: false };
  }
}
