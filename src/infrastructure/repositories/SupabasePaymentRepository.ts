
import { supabase } from '@/integrations/supabase/client';
import { IPaymentRepository, PaymentSummary, PaymentWithDetails } from '@/domain/repositories/IPaymentRepository';

export class SupabasePaymentRepository implements IPaymentRepository {
  async getCompanyByOwner(ownerId: string): Promise<{ id: string } | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_id', ownerId)
      .single();

    if (error) throw error;
    return data;
  }

  async getPaymentsByCompany(companyId: string): Promise<PaymentWithDetails[]> {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        jobs (
          title,
          events (title)
        ),
        promoter:profiles!payments_promoter_id_fkey (full_name)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getPaymentSummary(companyId: string): Promise<PaymentSummary> {
    const payments = await this.getPaymentsByCompany(companyId);
    
    return {
      totalPaid: payments.reduce((sum, p) => 
        p.status === 'completed' ? sum + p.amount : sum, 0),
      pendingPayments: payments.reduce((sum, p) => 
        p.status === 'pending' ? sum + p.amount : sum, 0),
      failedPayments: payments.reduce((sum, p) => 
        p.status === 'failed' ? sum + p.amount : sum, 0)
    };
  }

  async updatePaymentStatus(paymentId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .update({ status })
      .eq('id', paymentId);

    if (error) throw error;
  }
}
