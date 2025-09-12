import { useState, useCallback, useEffect } from "react";
import type { EventItem } from "../types/event";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../api/events";
import { useAuth } from "../auth/useAuth";

export function useCalendarEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents();
      setEvents(data.map(e => ({ ...e, startDate: new Date(e.startDate), endDate: new Date(e.endDate) })));
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvent = useCallback(
    async (event: Omit<EventItem, "id">) => {
      if (!user) throw new Error("Usuário não autenticado");
      const newEvent = await createEvent({ ...event, userId: user.id });
      setEvents(prev => [...prev, { ...newEvent, startDate: new Date(newEvent.startDate), endDate: new Date(newEvent.endDate) }]);
    },
    [user]
  );

  const editEvent = useCallback(async (id: string, event: Partial<EventItem>) => {
    const updatedEvent = await updateEvent(id, event);
    setEvents(prev => prev.map(e => (e.id === id ? { ...updatedEvent, startDate: new Date(updatedEvent.startDate), endDate: new Date(updatedEvent.endDate) } : e)));
  }, []);

  const removeEvent = useCallback(async (id: string) => {
    await deleteEvent(id);
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return { events, loading, error, loadEvents, addEvent, editEvent, removeEvent };
}
