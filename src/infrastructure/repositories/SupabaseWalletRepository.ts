
import { supabase } from '@/integrations/supabase/client';
import { IWalletRepository } from '@/domain/repositories/IWalletRepository';
import { Wallet, WalletTransaction } from '@/domain/entities/Wallet';

export class SupabaseWalletRepository implements IWalletRepository {
  private mapToWallet(data: any): Wallet {
    return {
      id: data.id,
      userId: data.user_id,
      balance: data.balance,
      pendingBalance: data.pending_balance,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private mapToWalletTransaction(data: any): WalletTransaction {
    return {
      id: data.id,
      walletId: data.wallet_id,
      amount: data.amount,
      type: data.type as 'credit' | 'debit' | 'pending',
      status: data.status as 'pending' | 'completed' | 'failed',
      description: data.description,
      jobId: data.job_id,
      paymentId: data.payment_id,
      createdAt: data.created_at
    };
  }

  async getWalletByUserId(userId: string): Promise<Wallet | null> {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data ? this.mapToWallet(data) : null;
  }

  async getTransactionsByWallet(walletId: string): Promise<WalletTransaction[]> {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(transaction => this.mapToWalletTransaction(transaction));
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
    
    // Handle both possible response formats from the database function
    if (data && 'total_earned' in data) {
      return {
        totalEarned: data.total_earned || 0,
        pendingEarnings: data.pending_earnings || 0,
        availableForPayout: data.available_for_payout || 0
      };
    }
    
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
