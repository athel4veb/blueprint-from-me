
import { IEventRepository } from '@/domain/repositories/IEventRepository';
import { Event } from '@/domain/entities/Event';

export class EventService {
  constructor(private eventRepository: IEventRepository) {}

  async getEventsByCompany(companyId: string): Promise<Event[]> {
    return this.eventRepository.getEventsByCompany(companyId);
  }

  async getAllEvents(): Promise<Event[]> {
    return this.eventRepository.getAllEvents();
  }

  async createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    return this.eventRepository.createEvent(event);
  }

  async updateEvent(id: string, event: Partial<Event>): Promise<Event> {
    return this.eventRepository.updateEvent(id, event);
  }

  async deleteEvent(id: string): Promise<void> {
    return this.eventRepository.deleteEvent(id);
  }
}
