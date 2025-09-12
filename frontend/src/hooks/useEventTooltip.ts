import { useState, useEffect, useRef } from "react";
import type { EventItem } from "../types/event";

export function useEventTooltip(currentDate: Date) {
  const [tooltipEvent, setTooltipEvent] = useState<EventItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const eventRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!tooltipEvent) return;

    const el = eventRefs.current[tooltipEvent.id];
    if (!el) return;

    const container = el.closest(".flex-1") as HTMLElement;
    if (!container) return;

    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const tooltipWidth = 200; // max-w-xs aproximado
    const offset = 8;

    // Posição padrão à direita
    let x = elRect.right - containerRect.left + container.scrollLeft + offset;
    const y = elRect.top - containerRect.top + container.scrollTop;

    // Se ultrapassar o limite direito, tenta à esquerda
    if (x + tooltipWidth > container.scrollWidth) {
      x = elRect.left - containerRect.left + container.scrollLeft - tooltipWidth - offset;
    }

    // Garantir que não saia do container
    x = Math.max(0, Math.min(x, container.scrollWidth - tooltipWidth));

    setTooltipPos({ x, y });
  }, [tooltipEvent, currentDate]);

  return {
    tooltipEvent,
    setTooltipEvent,
    tooltipPos,
    eventRefs,
  };
}
