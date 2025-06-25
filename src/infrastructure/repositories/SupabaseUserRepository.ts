
import { supabase } from '@/integrations/supabase/client';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';

export class SupabaseUserRepository implements IUserRepository {
  private mapToUser(profile: any): User {
    return {
      id: profile.id,
      fullName: profile.full_name,
      phone: profile.phone,
      userType: profile.user_type as 'promoter' | 'company' | 'supervisor',
      avatarUrl: profile.avatar_url,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    };
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) return null;

    return this.mapToUser(profile);
  }

  async getUserById(id: string): Promise<User | null> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (!profile) return null;

    return this.mapToUser(profile);
  }

  async updateUser(user: Partial<User>): Promise<void> {
    const updateData: any = {};
    if (user.fullName !== undefined) updateData.full_name = user.fullName;
    if (user.phone !== undefined) updateData.phone = user.phone;
    if (user.avatarUrl !== undefined) updateData.avatar_url = user.avatarUrl;

    await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);
  }
}
