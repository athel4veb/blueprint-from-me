
import { supabase } from '@/integrations/supabase/client';
import { IMessageRepository } from '@/domain/repositories/IMessageRepository';
import { Message } from '@/domain/entities/Message';

export class SupabaseMessageRepository implements IMessageRepository {
  async getMessagesByUser(userId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(this.mapToEntity);
  }

  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId1},recipient_id.eq.${userId2}),and(sender_id.eq.${userId2},recipient_id.eq.${userId1})`)
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    return data.map(this.mapToEntity);
  }

  async sendMessage(message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: message.senderId,
        recipient_id: message.recipientId,
        subject: message.subject,
        content: message.content,
        is_read: message.isRead,
        job_id: message.jobId
      })
      .select()
      .single();

    if (error) throw error;
    
    return this.mapToEntity(data);
  }

  async markAsRead(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) throw error;
  }

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    
    return count || 0;
  }

  private mapToEntity(data: any): Message {
    return {
      id: data.id,
      senderId: data.sender_id,
      recipientId: data.recipient_id,
      subject: data.subject,
      content: data.content,
      isRead: data.is_read,
      jobId: data.job_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
}
