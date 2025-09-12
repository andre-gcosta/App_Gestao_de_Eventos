import { useState, useCallback } from "react";

export type ViewMode = "month" | "week" | "day" | "list";

export function useCalendarDate(initialView: ViewMode = "month") {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewMode>(initialView);

  const handlePrev = useCallback(() => {
    const newDate = new Date(currentDate);
    if (view === "month") newDate.setMonth(currentDate.getMonth() - 1);
    if (view === "week") newDate.setDate(currentDate.getDate() - 7);
    if (view === "day") newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  }, [currentDate, view]);

  const handleNext = useCallback(() => {
    const newDate = new Date(currentDate);
    if (view === "month") newDate.setMonth(currentDate.getMonth() + 1);
    if (view === "week") newDate.setDate(currentDate.getDate() + 7);
    if (view === "day") newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  }, [currentDate, view]);

  const handleToday = useCallback(() => setCurrentDate(new Date()), []);

  const getTitle = useCallback(() => {
    if (view === "month")
      return currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    if (view === "week") {
      const start = new Date(currentDate);
      start.setDate(currentDate.getDate() - currentDate.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString("pt-BR", { day: "numeric", month: "short" })} - ${end.toLocaleDateString(
        "pt-BR",
        { day: "numeric", month: "short", year: "numeric" }
      )}`;
    }
    if (view === "day")
      return currentDate.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    return "Todos os eventos";
  }, [currentDate, view]);

  return { currentDate, view, setView, handlePrev, handleNext, handleToday, getTitle };
}
