
import { Event } from '../entities/Event';

export interface IEventRepository {
  getEventsByCompany(companyId: string): Promise<Event[]>;
  getAllEvents(): Promise<Event[]>;
  createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event>;
  updateEvent(id: string, event: Partial<Event>): Promise<Event>;
  deleteEvent(id: string): Promise<void>;
}
