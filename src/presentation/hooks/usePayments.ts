
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/infrastructure/di/Container';

export const usePayments = (userId: string) => {
  const queryClient = useQueryClient();

  const paymentsQuery = useQuery({
    queryKey: ['payments', userId],
    queryFn: () => container.paymentService.getPaymentsByOwner(userId),
    enabled: !!userId
  });

  const summaryQuery = useQuery({
    queryKey: ['payment-summary', userId],
    queryFn: () => container.paymentService.getPaymentSummaryByOwner(userId),
    enabled: !!userId
  });

  const processPaymentMutation = useMutation({
    mutationFn: (paymentId: string) => container.paymentService.processPayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', userId] });
      queryClient.invalidateQueries({ queryKey: ['payment-summary', userId] });
    }
  });

  return {
    payments: paymentsQuery.data || [],
    summary: summaryQuery.data || { totalPaid: 0, pendingPayments: 0, failedPayments: 0 },
    loading: paymentsQuery.isLoading,
    error: paymentsQuery.error?.message,
    processPayment: processPaymentMutation.mutateAsync
  };
};
