
import { supabase } from '@/integrations/supabase/client';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';

export class SupabaseUserRepository implements IUserRepository {
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) return null;

    return {
      id: profile.id,
      fullName: profile.full_name,
      phone: profile.phone,
      userType: profile.user_type,
      avatarUrl: profile.avatar_url,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    };
  }

  async getUserById(id: string): Promise<User | null> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (!profile) return null;

    return {
      id: profile.id,
      fullName: profile.full_name,
      phone: profile.phone,
      userType: profile.user_type,
      avatarUrl: profile.avatar_url,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    };
  }

  async updateUser(user: Partial<User>): Promise<void> {
    await supabase
      .from('profiles')
      .update({
        full_name: user.fullName,
        phone: user.phone,
        avatar_url: user.avatarUrl
      })
      .eq('id', user.id);
  }
}
