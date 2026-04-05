"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GITHUB_PROFILE_URL, GITHUB_USERNAME } from "@/lib/site-data";

interface Contribution {
  date: string;
  count: number;
  level: number;
}

interface ContributionWeek {
  days: Array<Contribution | null>;
}

interface ContributionsPayload {
  contributions: Contribution[];
  total?: Record<string, number>;
}

interface TooltipState {
  contribution: Contribution | null;
  visible: boolean;
  x: number;
  y: number;
}

const PALETTE = [
  "var(--contribution-level-0)",
  "var(--contribution-level-1)",
  "var(--contribution-level-2)",
  "var(--contribution-level-3)",
  "var(--contribution-level-4)"
];

const MONTH_LABELS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${dateString}T12:00:00`));
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function buildWeeks(contributions: Contribution[]) {
  const sorted = contributions
    .slice()
    .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime());
  const today = new Date();
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const lastYear = new Date(normalizedToday);
  lastYear.setDate(normalizedToday.getDate() - 364);

  const map = new Map(sorted.map((item) => [item.date, item]));
  const alignedStart = new Date(lastYear);
  alignedStart.setDate(lastYear.getDate() - lastYear.getDay());

  const weeks: ContributionWeek[] = [];
  const cursor = new Date(alignedStart);

  while (cursor <= normalizedToday) {
    const week: ContributionWeek = { days: [] };

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const isoDate = toDateKey(cursor);

      if (cursor >= lastYear && cursor <= normalizedToday) {
        week.days.push(map.get(isoDate) ?? { date: isoDate, count: 0, level: 0 });
      } else {
        week.days.push(null);
      }

      cursor.setDate(cursor.getDate() + 1);
    }

    weeks.push(week);
  }

  return weeks;
}

function buildMonthMarkers(weeks: ContributionWeek[]) {
  const markers: Array<{ col: number; label: string }> = [];
  let lastMonth = -1;

  weeks.forEach((week, columnIndex) => {
    const firstVisibleDay = week.days.find((day) => day !== null);

    if (!firstVisibleDay) {
      return;
    }

    const month = new Date(`${firstVisibleDay.date}T12:00:00`).getMonth();

    if (month !== lastMonth) {
      markers.push({
        col: columnIndex,
        label: MONTH_LABELS[month]
      });
      lastMonth = month;
    }
  });

  return markers;
}

function getYearlyTotal(data: ContributionsPayload) {
  const currentYear = String(new Date().getFullYear());

  if (data.total?.[currentYear]) {
    return data.total[currentYear];
  }

  return data.contributions.reduce((total, contribution) => {
    return contribution.date.startsWith(currentYear) ? total + contribution.count : total;
  }, 0);
}

export function ContributionsSection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<ContributionsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableWidth, setAvailableWidth] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState>({
    contribution: null,
    visible: false,
    x: 0,
    y: 0
  });

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, 5000);

    const loadContributions = async () => {
      try {
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(GITHUB_USERNAME)}`,
          {
            signal: controller.signal,
            cache: "no-store"
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const payload = (await response.json()) as ContributionsPayload;

        if (!Array.isArray(payload.contributions)) {
          throw new Error("Invalid contribution payload");
        }

        if (!mounted) {
          return;
        }

        setData(payload);
        setError(null);
      } catch (loadError) {
        if (!mounted) {
          return;
        }

        if (controller.signal.aborted) {
          setError(
            "The live graph could not be loaded. Open the GitHub profile directly for the latest activity."
          );
          setData(null);
          return;
        }

        setError(
          "The live graph could not be loaded. Open the GitHub profile directly for the latest activity."
        );
        setData(null);
      } finally {
        window.clearTimeout(timeoutId);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadContributions();

    return () => {
      mounted = false;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const element = cardRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      setAvailableWidth(element.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const chart = useMemo(() => {
    if (!data) {
      return null;
    }

    const weeks = buildWeeks(data.contributions);
    const markers = buildMonthMarkers(weeks);
    const widthBase = Math.max(availableWidth || 0, 280);
    const leftGutter = 4;
    const pitch = Math.max(5, Math.min(13, (widthBase - leftGutter - 4) / weeks.length));
    const cellSize = Math.max(3, Math.min(10, pitch - (pitch < 8 ? 1.5 : 3)));
    const cornerRadius = Math.max(1, Math.min(2, Math.round(cellSize / 3)));
    const chartTop = 16;
    const height = chartTop + 6 * pitch + cellSize + 7;
    const cellOffset = (pitch - cellSize) / 2;
    const monthFontSize = pitch < 8 ? 7 : 9;
    const markerGap = pitch < 8 ? 4 : 2;

    return {
      weeks,
      markers,
      leftGutter,
      pitch,
      cellOffset,
      cellSize,
      cornerRadius,
      chartTop,
      height,
      monthFontSize,
      markerGap,
      width: leftGutter + weeks.length * pitch,
      yearlyTotal: getYearlyTotal(data),
      currentYear: new Date().getFullYear()
    };
  }, [availableWidth, data]);

  const showTooltip = (contribution: Contribution, x: number, y: number) => {
    setTooltip({
      contribution,
      visible: true,
      x,
      y
    });
  };

  const hideTooltip = () => {
    setTooltip((current) => ({
      ...current,
      visible: false
    }));
  };

  return (
    <section className="contributions" aria-labelledby="contributions-title">
      <h2 className="section-title" id="contributions-title">
        Contributions
      </h2>
      <p className="contributions-intro">
        A live snapshot of shipping work across product, systems, and code.
      </p>

      <div className="contributions-card" ref={cardRef}>
        <div className="contributions-header">
          <a
            className="contributions-source"
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>github/{GITHUB_USERNAME}</span>
          </a>
          <div className="contributions-meta">
            {chart
              ? `${chart.yearlyTotal} contributions in ${chart.currentYear}`
              : isLoading
                ? "Loading contributions..."
                : "GitHub activity snapshot unavailable"}
          </div>
        </div>

        <div className="contributions-grid">
          {error ? (
            <div className="contributions-state" data-state="error">
              {error}
            </div>
          ) : isLoading || !chart ? (
            <div className="contributions-state" data-state="loading">
              {isLoading ? "Fetching the contribution graph." : "Preparing activity snapshot."}
            </div>
          ) : (
            <svg
              width="100%"
              height={chart.height}
              viewBox={`0 0 ${chart.width} ${chart.height}`}
              role="img"
              aria-label="GitHub contribution chart for the last 12 months"
            >
              {chart.markers.map((marker, index) => {
                const previousMarker = chart.markers[index - 1];

                if (previousMarker && marker.col - previousMarker.col < chart.markerGap) {
                  return null;
                }

                return (
                  <text
                    key={`${marker.label}-${marker.col}`}
                    x={chart.leftGutter + marker.col * chart.pitch}
                    y="10"
                    fill="var(--contribution-axis)"
                    fontSize={chart.monthFontSize}
                    fontFamily="Geist-Regular, Helvetica Neue, Helvetica, sans-serif"
                  >
                    {marker.label}
                  </text>
                );
              })}

              {chart.weeks.map((week, columnIndex) =>
                week.days.map((day, rowIndex) => {
                  if (!day) {
                    return null;
                  }

                  const cellX = chart.leftGutter + columnIndex * chart.pitch + chart.cellOffset;
                  const cellY = chart.chartTop + rowIndex * chart.pitch + chart.cellOffset;

                  return (
                    <g className="contribution-day" key={`${day.date}-${columnIndex}-${rowIndex}`}>
                      <rect
                        className="contribution-hitbox"
                        x={chart.leftGutter + columnIndex * chart.pitch}
                        y={chart.chartTop + rowIndex * chart.pitch}
                        width={chart.pitch}
                        height={chart.pitch}
                        rx={chart.cornerRadius + 1}
                        tabIndex={0}
                        aria-label={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`}
                        onMouseEnter={(event) => showTooltip(day, event.clientX, event.clientY)}
                        onMouseMove={(event) => showTooltip(day, event.clientX, event.clientY)}
                        onMouseLeave={hideTooltip}
                        onFocus={(event) => {
                          const bounds = event.currentTarget.getBoundingClientRect();
                          showTooltip(day, bounds.left + bounds.width / 2, bounds.top);
                        }}
                        onBlur={hideTooltip}
                      />
                      <rect
                        className="contribution-cell"
                        x={cellX}
                        y={cellY}
                        width={chart.cellSize}
                        height={chart.cellSize}
                        rx={chart.cornerRadius}
                        fill={PALETTE[day.level] ?? PALETTE[0]}
                      />
                    </g>
                  );
                })
              )}
            </svg>
          )}
        </div>

        <div className="contributions-legend" aria-hidden="true">
          <span>Less</span>
          <div className="contributions-legend-scale">
            {PALETTE.map((color) => (
              <span key={color} className="contributions-legend-swatch" style={{ background: color }} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <div
        className={`contributions-tooltip${tooltip.visible ? " is-visible" : ""}`}
        aria-hidden={tooltip.visible ? "false" : "true"}
        style={{
          left: tooltip.x,
          top: tooltip.y
        }}
      >
        {tooltip.contribution ? (
          <>
            <strong>{tooltip.contribution.count}</strong> contribution
            {tooltip.contribution.count === 1 ? "" : "s"} on {formatDate(tooltip.contribution.date)}
          </>
        ) : null}
      </div>
    </section>
  );
}
