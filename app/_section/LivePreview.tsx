"use client";

import type { CSSProperties } from "react";
import type { TimelineState } from "../types";
import { getStateSummary, getTimelineEvents, getVisibleEventCount } from "../_utils/timelineModel";

function shell(state: TimelineState): CSSProperties {
  return { width: state.width, minHeight: state.height, padding: state.padding, gap: state.gap, borderRadius: state.radius, border: `${state.borderWidth}px solid ${state.border}`, boxShadow: `0 ${Math.round(state.shadow / 3)}px ${state.shadow}px rgba(0,0,0,.28)`, background: state.background, color: state.foreground, fontFamily: state.fontFamily, opacity: state.disabled ? 0.55 : 1 };
}

export default function LivePreview({ state }: { state: TimelineState }) {
  const events = getTimelineEvents(state);
  const summary = getStateSummary(state);
  const visibleEvents = events.slice(0, getVisibleEventCount(state));
  const panel = shell(state);
  const isHorizontal = state.orientation === "horizontal";
  const markerGlyph = state.markerStyle === "dot" ? "" : state.markerStyle === "number" ? null : "ok";
  const regionRole = state.role === "list" ? "region" : state.role;

  return (
    <section id={state.id} role={regionRole} aria-label={state.ariaLabel} tabIndex={state.tabIndex} style={panel} data-timeline-orientation={state.orientation} data-timeline-state={state.previewState} className="grid content-start">
      <div className="grid gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: state.accent }}>{summary.statusText}</p>
        <h3 style={{ fontSize: state.titleSize, fontWeight: state.fontWeight }}>{state.title}</h3>
        <p style={{ color: state.muted, fontSize: state.bodySize }}>{state.description}</p>
      </div>
      <ol aria-label={`${state.title} events`} role="list" className={isHorizontal ? "mt-6 grid gap-4 md:grid-flow-col md:auto-cols-fr" : "mt-6 grid gap-4"}>
        {visibleEvents.map((event, index) => {
          const isCurrent = event.status === "current";
          const alignEnd = state.alternating && !isHorizontal && index % 2 === 1;
          const markerText = markerGlyph === null ? String(index + 1) : markerGlyph;

          return (
            <li key={event.id} role="listitem" aria-current={isCurrent ? "step" : undefined} className={alignEnd ? "grid justify-items-end text-right" : "grid justify-items-start text-left"}>
              <article className={isHorizontal ? "grid h-full gap-3" : "grid max-w-[34rem] gap-3"} style={{ opacity: event.status === "upcoming" ? 0.72 : 1 }}>
                <div className={isHorizontal ? "grid grid-cols-[auto_1fr] items-center gap-3" : "grid grid-cols-[auto_1fr] items-start gap-3"}>
                  <span aria-hidden="true" className="grid size-9 place-items-center rounded-full border text-xs font-bold" style={{ borderColor: isCurrent ? state.accent : state.border, background: isCurrent ? state.accent : "color-mix(in oklab, var(--card) 78%, transparent)", color: isCurrent ? "#020617" : state.foreground }}>{markerText}</span>
                  <span aria-hidden="true" className={isHorizontal ? "h-px w-full self-center" : "h-12 w-px justify-self-center"} style={{ borderTop: isHorizontal ? `1px ${state.connectorStyle} ${state.border}` : undefined, borderLeft: isHorizontal ? undefined : `1px ${state.connectorStyle} ${state.border}`, opacity: index === visibleEvents.length - 1 ? 0 : 1 }} />
                </div>
                <div className="rounded-2xl border p-4" style={{ borderColor: isCurrent ? state.accent : state.border, background: isCurrent ? "color-mix(in oklab, var(--primary) 14%, transparent)" : "color-mix(in oklab, var(--card) 72%, transparent)" }}>
                  {state.datePlacement === "top" && <time dateTime={event.date} className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: state.accent }}>{event.displayDate}</time>}
                  <div className={state.datePlacement === "side" ? "mt-2 flex items-start justify-between gap-3" : "mt-2"}>
                    <h4 className="font-semibold">{event.title}</h4>
                    {state.datePlacement === "side" && <time dateTime={event.date} className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: state.accent }}>{event.displayDate}</time>}
                  </div>
                  <p className="mt-1 text-sm" style={{ color: state.muted }}>{event.description}</p>
                  <span className="mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs capitalize" style={{ borderColor: isCurrent ? state.accent : state.border, color: isCurrent ? state.accent : state.muted }}>{event.status}</span>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
      {summary.hiddenCount > 0 && <p className="mt-4 text-sm" style={{ color: state.muted }}>{summary.hiddenCount} later events are collapsed in this state.</p>}
      <p className="mt-4 text-xs" style={{ color: state.muted }}>{state.helper} - {state.previewState}</p>
    </section>
  );
}
