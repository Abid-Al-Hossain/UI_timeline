"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import type { TimelineState } from "../types";
import { getCurrentIndex } from "../_utils/timelineModel";

type Props = { state: TimelineState; update: <K extends keyof TimelineState>(key: K, value: TimelineState[K]) => void };

export default function ItemsSection({ state, update }: Props) {
  return <SectionCard title="Items" subtitle="Timeline event count and current event semantics."><Slider label="Event count" value={state.itemCount} min={1} max={14} step={1} onChange={(value) => update("itemCount", value)} />
<Slider label="Current event" value={getCurrentIndex(state) + 1} min={1} max={state.itemCount} step={1} onChange={(value) => update("currentItem", value)} /></SectionCard>;
}
