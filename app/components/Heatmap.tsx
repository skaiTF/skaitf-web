"use client";

import { useEffect, useRef } from "react";

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const levelClass = ["bg-white/5", "bg-accent/25", "bg-accent/50", "bg-accent/75", "bg-accent"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface HeatmapProps {
  /** Text/links shown above the grid. */
  header: React.ReactNode;
  /** Columns of 7 days (Sunday first), oldest week first. Null hides the grid (loading/error). */
  weeks: HeatmapDay[][] | null;
  /** Hover text for one cell. */
  formatTitle: (day: HeatmapDay) => string;
  className?: string;
}

/** GitHub-style calendar heatmap in the HUD style, shared by the contribution and token graphs. */
export default function Heatmap({ header, weeks, formatTitle, className = "" }: HeatmapProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // On narrow screens, start scrolled to the most recent weeks.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }, [weeks]);

  // Label a column with its month when the month changes from the previous column.
  const monthLabels =
    weeks?.map((week, i) => {
      const month = new Date(week[0].date).getUTCMonth();
      const prev = i > 0 ? new Date(weeks[i - 1][0].date).getUTCMonth() : -1;
      return month !== prev && i < weeks.length - 2 ? MONTHS[month] : "";
    }) ?? [];

  return (
    <div className={`hud-panel p-6 ${className}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">{header}</div>

      {weeks && (
        <>
          {/* Cells stretch to fill the panel; below ~640px wide the graph scrolls instead of shrinking. */}
          <div ref={scrollRef} className="overflow-x-auto pb-1">
            <div
              className="grid min-w-[640px] gap-[3px]"
              style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
            >
              {monthLabels.map((label, i) => (
                <span key={i} className="mb-1 overflow-visible whitespace-nowrap text-[10px] leading-none text-zinc-500">
                  {label}
                </span>
              ))}
              {weeks.map((week) => (
                <div key={week[0].date} className="flex flex-col gap-[3px]">
                  {week.map((day) => (
                    <span
                      key={day.date}
                      className={`aspect-square w-full ${levelClass[day.level]}`}
                      title={formatTitle(day)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-zinc-500">
            Less
            {levelClass.map((cls) => (
              <span key={cls} className={`size-[11px] ${cls}`} />
            ))}
            More
          </div>
        </>
      )}
    </div>
  );
}
