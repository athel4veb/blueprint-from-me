
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/infrastructure/di/Container';

export const usePayments = (companyId: string) => {
  const queryClient = useQueryClient();

  const paymentsQuery = useQuery({
    queryKey: ['payments', companyId],
    queryFn: () => container.paymentService.getPaymentsByCompany(companyId),
    enabled: !!companyId
  });

  const summaryQuery = useQuery({
    queryKey: ['payment-summary', companyId],
    queryFn: () => container.paymentService.getPaymentSummary(companyId),
    enabled: !!companyId
  });

  const processPaymentMutation = useMutation({
    mutationFn: (paymentId: string) => container.paymentService.processPayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', companyId] });
      queryClient.invalidateQueries({ queryKey: ['payment-summary', companyId] });
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
