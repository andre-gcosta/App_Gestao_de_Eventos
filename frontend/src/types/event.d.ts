export interface EventItem {
  id: string;
  title: string;
  description?: string;
  location?: string;
  status?: string;
  startDate: string | Date;
  endDate: string | Date;
  color?: string;
  userId?: number;
}