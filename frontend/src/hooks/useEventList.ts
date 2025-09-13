import { useState, useMemo } from "react";
import type { EventItem } from "../api/events";

interface UseEventListResult {
  groupedEvents: Record<string, EventItem[]>;
  openMonths: Record<string, boolean>;
  toggleMonth: (monthKey: string) => void;
  getFirstDayOfMonth: (monthKey: string) => Date;
  formatMonthLabel: (monthKey: string) => string;
}

export function useEventList(events: EventItem[]): UseEventListResult {
  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({});

  const groupedEvents = useMemo(() => {
    return events.reduce((acc, event) => {
      const d = new Date(event.startDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // chave ISO YYYY-MM
      if (!acc[key]) acc[key] = [];
      acc[key].push(event);
      return acc;
    }, {} as Record<string, EventItem[]>);
  }, [events]);

  const toggleMonth = (monthKey: string) => {
    setOpenMonths((prev) => ({ ...prev, [monthKey]: !prev[monthKey] }));
  };

  const getFirstDayOfMonth = (monthKey: string) => {
    const [year, month] = monthKey.split("-").map(Number);
    return new Date(year, month - 1, 1);
  };

  const formatMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split("-").map(Number);
    const d = new Date(year, month - 1, 1);
    return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  };

  return { groupedEvents, openMonths, toggleMonth, getFirstDayOfMonth, formatMonthLabel };
}