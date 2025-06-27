import { supabase } from '@/integrations/supabase/client';
import { IPaymentRepository, PaymentSummary, PaymentWithDetails } from '@/domain/repositories/IPaymentRepository';
import { Payment } from '@/domain/entities/Payment';

export class SupabasePaymentRepository implements IPaymentRepository {
  async getPaymentsByCompany(companyId: string): Promise<PaymentWithDetails[]> {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        jobs!inner (
          title,
          events!inner (
            title
          )
        ),
        promoter:profiles!promoter_id (
          full_name
        )
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(payment => ({
      id: payment.id,
      jobId: payment.job_id,
      companyId: payment.company_id,
      promoterId: payment.promoter_id,
      amount: Number(payment.amount),
      status: payment.status as 'pending' | 'processing' | 'completed' | 'failed' | 'refunded',
      paymentMethod: payment.payment_method,
      stripePaymentIntentId: payment.stripe_payment_intent_id,
      createdAt: payment.created_at,
      updatedAt: payment.updated_at,
      jobs: {
        title: payment.jobs.title,
        events: {
          title: payment.jobs.events.title
        }
      },
      promoter: {
        full_name: payment.promoter?.full_name || ''
      }
    })) || [];
  }

  async getPaymentsByOwner(ownerId: string): Promise<PaymentWithDetails[]> {
    // Get company owned by this user first
    const company = await this.getCompanyByOwner(ownerId);
    if (!company) return [];
    
    return this.getPaymentsByCompany(company.id);
  }

  async getPaymentSummary(companyId: string): Promise<PaymentSummary> {
    const { data, error } = await supabase
      .from('payments')
      .select('amount, status')
      .eq('company_id', companyId);

    if (error) throw error;

    const payments = data || [];
    const totalPaid = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + Number(p.amount), 0);
    
    const pendingPayments = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + Number(p.amount), 0);
    
    const failedPayments = payments
      .filter(p => p.status === 'failed')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      totalPaid,
      pendingPayments,
      failedPayments
    };
  }

  async getPaymentSummaryByOwner(ownerId: string): Promise<PaymentSummary> {
    const company = await this.getCompanyByOwner(ownerId);
    if (!company) {
      return { totalPaid: 0, pendingPayments: 0, failedPayments: 0 };
    }
    
    return this.getPaymentSummary(company.id);
  }

  async updatePaymentStatus(paymentId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', paymentId);

    if (error) throw error;
  }

  async processPayment(paymentId: string): Promise<void> {
    await this.updatePaymentStatus(paymentId, 'processing');
    // Additional payment processing logic would go here
  }

  async getCompanyByOwner(ownerId: string): Promise<{ id: string } | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_id', ownerId)
      .single();

    if (error) return null;
    return data;
  }
}
