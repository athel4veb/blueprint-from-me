
import { useState, useEffect } from 'react';
import { container } from '@/infrastructure/di/Container';
import { Wallet, WalletTransaction } from '@/domain/entities/Wallet';

export const useWallet = (userId: string) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<any[]>([]);
  const [earnings, setEarnings] = useState({
    totalEarned: 0,
    pendingEarnings: 0,
    availableForPayout: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletData = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      const [walletData, earningsData, payoutData] = await Promise.all([
        container.walletService.getWalletByUserId(userId),
        container.walletService.calculateEarnings(userId),
        container.walletService.getPayoutRequests(userId)
      ]);

      setWallet(walletData);
      setEarnings(earningsData);
      setPayoutRequests(payoutData);

      if (walletData) {
        const transactionData = await container.walletService.getTransactionsByWallet(walletData.id);
        setTransactions(transactionData);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [userId]);

  const requestPayout = async (amount: number, bankDetails: string) => {
    try {
      await container.walletService.requestPayout(userId, amount, bankDetails);
      await fetchWalletData(); // Refresh data
    } catch (error) {
      throw error;
    }
  };

  return {
    wallet,
    transactions,
    payoutRequests,
    earnings,
    loading,
    error,
    requestPayout,
    refetch: fetchWalletData
  };
};
