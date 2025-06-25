
import { Payment } from '@/domain/entities/Payment';

export interface PaymentSummary {
  totalPaid: number;
  pendingPayments: number;
  failedPayments: number;
}

export interface PaymentWithDetails extends Payment {
  jobs: {
    title: string;
    events: {
      title: string;
    };
  };
  promoter: {
    full_name: string;
  };
}

export interface IPaymentRepository {
  getPaymentsByCompany(companyId: string): Promise<PaymentWithDetails[]>;
  getPaymentSummary(companyId: string): Promise<PaymentSummary>;
  updatePaymentStatus(paymentId: string, status: string): Promise<void>;
  getCompanyByOwner(ownerId: string): Promise<{ id: string } | null>;
}
