import { useState, useMemo } from "react";
import type { EventItem } from "../api/events";

interface UseEventListResult {
  groupedEvents: Record<string, EventItem[]>;
  openMonths: Record<string, boolean>;
  toggleMonth: (month: string) => void;
  getFirstDayOfMonth: (month: string) => Date;
}

export function useEventList(events: EventItem[]): UseEventListResult {
  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({});

  const groupedEvents = useMemo(() => {
    return events.reduce((acc, event) => {
      const month = new Date(event.startDate).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });
      if (!acc[month]) acc[month] = [];
      acc[month].push(event);
      return acc;
    }, {} as Record<string, EventItem[]>);
  }, [events]);

  const toggleMonth = (month: string) => {
    setOpenMonths((prev) => ({ ...prev, [month]: !prev[month] }));
  };

  const getFirstDayOfMonth = (month: string) => {
    const monthEvents = groupedEvents[month];
    if (monthEvents && monthEvents.length > 0) {
      const firstEventDate = new Date(monthEvents[0].startDate);
      return new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), 1);
    }
    return new Date();
  };

  return { groupedEvents, openMonths, toggleMonth, getFirstDayOfMonth };
}
