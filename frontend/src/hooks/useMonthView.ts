import { useMemo } from 'react';
import type { EventItem } from '../types/event';

interface UseMonthViewProps {
  currentDate: Date;
  events?: EventItem[];
}

export interface DayCell {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  events: EventItem[];
}

export function useMonthView({ currentDate, events = [] }: UseMonthViewProps) {
  return useMemo(() => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();

    const totalCells = Math.ceil((firstDay.getDay() + lastDay.getDate()) / 7) * 7;
    const days: DayCell[] = [];

    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - firstDay.getDay() + 1;
      const dayDate = new Date(year, month, dayNum);
      const inMonth = dayNum > 0 && dayNum <= lastDay.getDate();
      const dayEvents = events.filter(
        (event) => inMonth && new Date(event.startDate).toDateString() === dayDate.toDateString()
      );
      const isToday = inMonth && dayDate.toDateString() === today.toDateString();
      const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;

      days.push({
        date: dayDate,
        inMonth,
        isToday,
        isWeekend,
        events: dayEvents,
      });
    }

    return { days };
  }, [currentDate, events]);
}