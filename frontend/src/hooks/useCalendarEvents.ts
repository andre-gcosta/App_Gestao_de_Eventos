import { useState, useCallback, useEffect } from "react";
import type { EventItem } from "../types/event";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../api/events";

export function useCalendarEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents();
      setEvents(
        data.map((e) => ({
          ...e,
          startDate: new Date(e.startDate),
          endDate: new Date(e.endDate),
        }))
      );
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvent = useCallback(async (event: Omit<EventItem, "id">) => {
    await createEvent(event);
    await loadEvents();
  }, [loadEvents]);

  const editEvent = useCallback(async (id: string, event: Partial<EventItem>) => {
    await updateEvent(id, event);
    await loadEvents();
  }, [loadEvents]);

  const removeEvent = useCallback(async (id: string) => {
    await deleteEvent(id);
    await loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return { events, loading, error, loadEvents, addEvent, editEvent, removeEvent };
}
