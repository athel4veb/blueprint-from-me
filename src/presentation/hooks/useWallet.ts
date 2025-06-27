
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/infrastructure/di/Container';
import { useAuth } from '@/presentation/contexts/AuthContext';

export const useWallet = (userId: string) => {
  const queryClient = useQueryClient();

  const walletQuery = useQuery({
    queryKey: ['wallet', userId],
    queryFn: () => container.walletService.getWalletByUserId(userId),
    enabled: !!userId
  });

  const transactionsQuery = useQuery({
    queryKey: ['wallet-transactions', userId],
    queryFn: () => container.walletRepository.getTransactionsByWallet(userId),
    enabled: !!userId
  });

  const payoutRequestsQuery = useQuery({
    queryKey: ['payout-requests', userId],
    queryFn: () => container.walletRepository.getPayoutRequests(userId),
    enabled: !!userId
  });

  const earningsQuery = useQuery({
    queryKey: ['earnings', userId],
    queryFn: () => container.walletRepository.calculateEarnings(userId),
    enabled: !!userId
  });

  const requestPayoutMutation = useMutation({
    mutationFn: ({ amount, bankDetails }: { amount: number; bankDetails: string }) =>
      container.walletRepository.requestPayout(userId, amount, bankDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', userId] });
      queryClient.invalidateQueries({ queryKey: ['payout-requests', userId] });
    }
  });

  return {
    wallet: walletQuery.data,
    transactions: transactionsQuery.data || [],
    payoutRequests: payoutRequestsQuery.data || [],
    earnings: earningsQuery.data || { totalEarned: 0, pendingEarnings: 0, availableForPayout: 0 },
    loading: walletQuery.isLoading,
    error: walletQuery.error?.message,
    requestPayout: requestPayoutMutation.mutateAsync
  };
};
