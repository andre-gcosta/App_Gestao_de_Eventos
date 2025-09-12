import { useEffect, useMemo, useState } from "react";
import type { EventItem } from "../types/event";

export function useDayView(currentDate: Date, events: EventItem[]) {
  const startOfDay = useMemo(() => {
    const d = new Date(currentDate);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [currentDate]);

  const endOfDay = useMemo(() => {
    const d = new Date(startOfDay);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [startOfDay]);

  const eventsForDay = useMemo(
    () =>
      events.filter(
        (event) =>
          new Date(event.startDate) <= endOfDay && new Date(event.endDate) >= startOfDay
      ),
    [events, startOfDay, endOfDay]
  );

  const positionedEvents = useMemo(
    () => computeEventPositions(eventsForDay, startOfDay, endOfDay),
    [eventsForDay, startOfDay, endOfDay]
  );

  const [nowPosition, setNowPosition] = useState<number | null>(null);
  useEffect(() => {
    const updateNowLine = () => {
      const now = new Date();
      if (now.toDateString() === startOfDay.toDateString()) {
        const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
        setNowPosition((minutesSinceMidnight / (24 * 60)) * 100);
      } else {
        setNowPosition(null);
      }
    };
    updateNowLine();
    const interval = setInterval(updateNowLine, 60 * 1000);
    return () => clearInterval(interval);
  }, [startOfDay]);

  return { startOfDay, endOfDay, eventsForDay, positionedEvents, nowPosition };
}

function computeEventPositions(events: EventItem[], startOfDay: Date, endOfDay: Date) {
  const sorted = [...events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const positioned: { event: EventItem; top: number; height: number; left: number; width: number }[] = [];
  let group: EventItem[] = [];

  const flushGroup = () => {
    if (group.length === 0) return;

    const active: { event: EventItem; column: number }[] = [];

    group.forEach((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const effectiveStart = start < startOfDay ? startOfDay : start;
      const effectiveEnd = end > endOfDay ? endOfDay : end;

      for (let i = active.length - 1; i >= 0; i--) {
        if (new Date(active[i].event.endDate).getTime() <= effectiveStart.getTime()) {
          active.splice(i, 1);
        }
      }

      const usedCols = active.map((a) => a.column);
      let col = 0;
      while (usedCols.includes(col)) col++;

      active.push({ event, column: col });
    });

    const totalCols = Math.max(...active.map((a) => a.column)) + 1;

    active.forEach(({ event, column }) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const effectiveStart = start < startOfDay ? startOfDay : start;
      const effectiveEnd = end > endOfDay ? endOfDay : end;

      const startMinutes = effectiveStart.getHours() * 60 + effectiveStart.getMinutes();
      const endMinutes = effectiveEnd.getHours() * 60 + effectiveEnd.getMinutes();
      const duration = Math.max(endMinutes - startMinutes, 30); // mínimo 30 minutos visual

      const top = (startMinutes / (24 * 60)) * 100;
      const height = (duration / (24 * 60)) * 100;

      positioned.push({
        event,
        top,
        height,
        left: (column / totalCols) * 100,
        width: 100 / totalCols,
      });
    });

    group = [];
  };

  sorted.forEach((event) => {
    if (group.length === 0) {
      group.push(event);
    } else {
      const last = group[group.length - 1];
      const lastEnd = new Date(last.endDate).getTime();
      const thisStart = new Date(event.startDate).getTime();
      if (thisStart < lastEnd) group.push(event);
      else {
        flushGroup();
        group.push(event);
      }
    }
  });

  flushGroup();
  return positioned;
}
