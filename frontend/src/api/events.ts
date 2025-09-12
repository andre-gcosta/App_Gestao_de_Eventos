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
    const response = await api.get<EventItem[]>('/events');
    return response.data.map(e => ({
        ...e,
        startDate: new Date(e.startDate),
        endDate: new Date(e.endDate),
    }));
};

export const createEvent = async (event: Omit<EventItem, 'id'>): Promise<EventItem> => {
    const response = await api.post<EventItem>('/events', event);
    return response.data;
};

export const updateEvent = async (id: string, event: Partial<Omit<EventItem, 'id'>>): Promise<EventItem> => {
    const response = await api.put<EventItem>(`/events/${id}`, event);
    return response.data;
};

export const deleteEvent = async (id: string): Promise<EventItem> => {
    const response = await api.delete<EventItem>(`/events/${id}`);
    return response.data;
};
