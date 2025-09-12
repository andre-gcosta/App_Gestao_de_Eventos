import api from './axios';

export interface EventItem {
  id: string;
  title: string;
  description?: string;
  location?: string;
  status?: string;
  startDate: string | Date;
  endDate: string | Date;
  userId: number;
}

export const getEvents = async (): Promise<EventItem[]> => {
  const response = await api.get("/events");
  return response.data.map((e: EventItem) => ({
    ...e,
    startDate: new Date(e.startDate),
    endDate: new Date(e.endDate),
  }));
};

export const createEvent = async (event: Omit<EventItem, "id">) => {
  const response = await api.post("/events", event);
  return response.data;
};

export const updateEvent = async (id: string, event: Partial<EventItem>) => {
  const response = await api.put(`/events/${id}`, event);
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};