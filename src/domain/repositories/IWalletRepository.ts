
import { Wallet, WalletTransaction } from '../entities/Wallet';

export interface IWalletRepository {
  getWalletByUserId(userId: string): Promise<Wallet | null>;
  getTransactionsByWallet(walletId: string): Promise<WalletTransaction[]>;
  calculateEarnings(userId: string): Promise<{
    totalEarned: number;
    pendingEarnings: number;
    availableForPayout: number;
  }>;
  requestPayout(userId: string, amount: number, bankDetails: any): Promise<void>;
  getPayoutRequests(userId: string): Promise<any[]>;
}
