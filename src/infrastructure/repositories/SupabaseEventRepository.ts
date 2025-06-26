
import { supabase } from '@/integrations/supabase/client';
import { IEventRepository } from '@/domain/repositories/IEventRepository';
import { Event } from '@/domain/entities/Event';

export class SupabaseEventRepository implements IEventRepository {
  async getEventsByCompany(companyId: string): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('company_id', companyId)
      .order('start_date', { ascending: true });

    if (error) throw error;
    
    return data.map(this.mapToEntity);
  }

  async getAllEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) throw error;
    
    return data.map(this.mapToEntity);
  }

  async createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert({
        title: event.title,
        description: event.description,
        location: event.location,
        start_date: event.startDate,
        end_date: event.endDate,
        status: event.status,
        company_id: event.companyId
      })
      .select()
      .single();

    if (error) throw error;
    
    return this.mapToEntity(data);
  }

  async updateEvent(id: string, event: Partial<Event>): Promise<Event> {
    const updateData: any = {};
    if (event.title) updateData.title = event.title;
    if (event.description) updateData.description = event.description;
    if (event.location) updateData.location = event.location;
    if (event.startDate) updateData.start_date = event.startDate;
    if (event.endDate) updateData.end_date = event.endDate;
    if (event.status) updateData.status = event.status;

    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return this.mapToEntity(data);
  }

  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  private mapToEntity(data: any): Event {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      location: data.location,
      startDate: data.start_date,
      endDate: data.end_date,
      status: data.status,
      companyId: data.company_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
}
