
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

    return {
      id: data.id,
      userId: data.user_id,
      balance: Number(data.balance),
      pendingBalance: Number(data.pending_balance),
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  async getTransactionsByWallet(walletId: string): Promise<WalletTransaction[]> {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(transaction => ({
      id: transaction.id,
      walletId: transaction.wallet_id,
      amount: Number(transaction.amount),
      type: transaction.type as 'credit' | 'debit' | 'pending',
      status: transaction.status as 'pending' | 'completed' | 'failed',
      description: transaction.description,
      jobId: transaction.job_id,
      paymentId: transaction.payment_id,
      createdAt: transaction.created_at
    })) || [];
  }

  async calculateEarnings(userId: string): Promise<{
    totalEarned: number;
    pendingEarnings: number;
    availableForPayout: number;
  }> {
    const { data, error } = await supabase
      .rpc('calculate_promoter_earnings', { promoter_uuid: userId });

    if (error) throw error;

    const result = data?.[0] || { total_earned: 0, pending_earnings: 0, available_for_payout: 0 };
    
    return {
      totalEarned: Number(result.total_earned),
      pendingEarnings: Number(result.pending_earnings),
      availableForPayout: Number(result.available_for_payout)
    };
  }

  async requestPayout(userId: string, amount: number, bankDetails: any): Promise<void> {
    const { error } = await supabase
      .from('payout_requests')
      .insert({
        promoter_id: userId,
        amount,
        bank_details: bankDetails,
        status: 'pending'
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
