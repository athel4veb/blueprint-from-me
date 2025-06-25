
import { IWalletRepository } from '@/domain/repositories/IWalletRepository';
import { Wallet, WalletTransaction } from '@/domain/entities/Wallet';

export class WalletService {
  constructor(private walletRepository: IWalletRepository) {}

  async getWalletByUserId(userId: string): Promise<Wallet | null> {
    try {
      return await this.walletRepository.getWalletByUserId(userId);
    } catch (error) {
      throw new Error('Failed to fetch wallet data');
    }
  }

  async getTransactionsByWallet(walletId: string): Promise<WalletTransaction[]> {
    try {
      return await this.walletRepository.getTransactionsByWallet(walletId);
    } catch (error) {
      throw new Error('Failed to fetch transactions');
    }
  }

  async calculateEarnings(userId: string): Promise<{
    totalEarned: number;
    pendingEarnings: number;
    availableForPayout: number;
  }> {
    try {
      return await this.walletRepository.calculateEarnings(userId);
    } catch (error) {
      throw new Error('Failed to calculate earnings');
    }
  }

  async requestPayout(userId: string, amount: number, bankDetails: any): Promise<void> {
    if (amount <= 0) {
      throw new Error('Payout amount must be greater than zero');
    }
    
    if (!bankDetails || !bankDetails.trim()) {
      throw new Error('Bank details are required');
    }

    try {
      await this.walletRepository.requestPayout(userId, amount, bankDetails);
    } catch (error) {
      throw new Error('Failed to submit payout request');
    }
  }

  async getPayoutRequests(userId: string): Promise<any[]> {
    try {
      return await this.walletRepository.getPayoutRequests(userId);
    } catch (error) {
      throw new Error('Failed to fetch payout requests');
    }
  }
}
