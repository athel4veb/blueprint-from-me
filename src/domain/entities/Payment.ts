
export interface Payment {
  id: string;
  jobId: string;
  companyId: string;
  promoterId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}
