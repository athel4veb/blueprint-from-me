
import { supabase } from '@/integrations/supabase/client';
import { IWalletRepository } from '@/domain/repositories/IWalletRepository';
import { Wallet, WalletTransaction } from '@/domain/entities/Wallet';

export class SupabaseWalletRepository implements IWalletRepository {
  async getWalletByUserId(userId: string): Promise<Wallet | null> {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  }

  async getTransactionsByWallet(walletId: string): Promise<WalletTransaction[]> {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async calculateEarnings(userId: string): Promise<{
    totalEarned: number;
    pendingEarnings: number;
    availableForPayout: number;
  }> {
    const { data, error } = await supabase
      .rpc('calculate_promoter_earnings', { promoter_uuid: userId })
      .single();

    if (error) throw error;
    return data || { totalEarned: 0, pendingEarnings: 0, availableForPayout: 0 };
  }

  async requestPayout(userId: string, amount: number, bankDetails: any): Promise<void> {
    const { error } = await supabase
      .from('payout_requests')
      .insert({
        promoter_id: userId,
        amount,
        bank_details: bankDetails
      });

    if (error) throw error;
  }

  async getPayoutRequests(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('payout_requests')
      .select('*')
      .eq('promoter_id', userId)
      .order('requested_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
