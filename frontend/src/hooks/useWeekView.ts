import { useState, useEffect } from "react";
import type { EventItem } from "../types/event";

interface UseWeekViewProps {
  currentDate: Date;
  events?: EventItem[];
}

interface PositionedEvent {
  event: EventItem;
  top: number;
  height: number;
  left: number;
  width: number;
}

export function useWeekView({ currentDate, events = [] }: UseWeekViewProps) {
  const [nowPosition, setNowPosition] = useState<number | null>(null);

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    day.setHours(0, 0, 0, 0);
    return {
      date: day,
      isToday: day.toDateString() === new Date().toDateString(),
      isWeekend: day.getDay() === 0 || day.getDay() === 6,
      events: events.filter(
        (e) =>
          new Date(e.startDate) <= new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999) &&
          new Date(e.endDate) >= day
      ),
    };
  });

  // Linha vermelha do horário atual
  useEffect(() => {
    const updateNowLine = () => {
      const now = new Date();
      if (now >= startOfWeek && now < new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)) {
        const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
        setNowPosition((minutesSinceMidnight / (24 * 60)) * 100);
      } else setNowPosition(null);
    };
    updateNowLine();
    const interval = setInterval(updateNowLine, 60 * 1000);
    return () => clearInterval(interval);
  }, [startOfWeek]);

  const positionedEvents: Record<string, PositionedEvent[]> = {};
  days.forEach((day) => {
    positionedEvents[day.date.toDateString()] = computeEventPositions(day.events, day.date);
  });

  return { days, nowPosition, positionedEvents };
}

function computeEventPositions(events: EventItem[], startOfDay: Date) {
  const sorted = [...events].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const positioned: PositionedEvent[] = [];
  let group: EventItem[] = [];

  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  const flushGroup = () => {
    if (!group.length) return;
    const active: { event: EventItem; column: number }[] = [];

    group.forEach((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const effectiveStart = start < startOfDay ? startOfDay : start;
      const effectiveEnd = end > endOfDay ? endOfDay : end;

      for (let i = active.length - 1; i >= 0; i--) {
        if (new Date(active[i].event.endDate).getTime() <= effectiveStart.getTime()) active.splice(i, 1);
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
      const duration = Math.max(endMinutes - startMinutes, 30);

      positioned.push({
        event,
        top: (startMinutes / (24 * 60)) * 100,
        height: (duration / (24 * 60)) * 100,
        left: (column / totalCols) * 100,
        width: 100 / totalCols,
      });
    });

    group = [];
  };

  sorted.forEach((event) => {
    if (!group.length) group.push(event);
    else {
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
