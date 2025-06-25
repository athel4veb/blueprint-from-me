
import { useState, useEffect } from 'react';
import { container } from '@/infrastructure/di/Container';
import { PaymentSummary, PaymentWithDetails } from '@/domain/repositories/IPaymentRepository';

export const usePayments = (userId: string) => {
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [summary, setSummary] = useState<PaymentSummary>({
    totalPaid: 0,
    pendingPayments: 0,
    failedPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      const [paymentsData, summaryData] = await Promise.all([
        container.paymentService.getPaymentsByOwner(userId),
        container.paymentService.getPaymentSummaryByOwner(userId)
      ]);

      setPayments(paymentsData);
      setSummary(summaryData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [userId]);

  const processPayment = async (paymentId: string) => {
    try {
      await container.paymentService.processPayment(paymentId);
      await fetchPayments(); // Refresh data
    } catch (error) {
      throw error;
    }
  };

  return {
    payments,
    summary,
    loading,
    error,
    processPayment,
    refetch: fetchPayments
  };
};
