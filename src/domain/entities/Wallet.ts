
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  pendingBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: 'credit' | 'debit' | 'pending';
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  jobId?: string;
  paymentId?: string;
  createdAt: string;
}
