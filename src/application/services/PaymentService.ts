
import { IPaymentRepository, PaymentSummary, PaymentWithDetails } from '@/domain/repositories/IPaymentRepository';

export class PaymentService {
  constructor(private paymentRepository: IPaymentRepository) {}

  async getPaymentsByOwner(ownerId: string): Promise<PaymentWithDetails[]> {
    try {
      const company = await this.paymentRepository.getCompanyByOwner(ownerId);
      if (!company) throw new Error('Company not found');
      
      return await this.paymentRepository.getPaymentsByCompany(company.id);
    } catch (error) {
      throw new Error('Failed to fetch payments');
    }
  }

  async getPaymentSummaryByOwner(ownerId: string): Promise<PaymentSummary> {
    try {
      const company = await this.paymentRepository.getCompanyByOwner(ownerId);
      if (!company) throw new Error('Company not found');
      
      return await this.paymentRepository.getPaymentSummary(company.id);
    } catch (error) {
      throw new Error('Failed to fetch payment summary');
    }
  }

  async processPayment(paymentId: string): Promise<void> {
    try {
      await this.paymentRepository.updatePaymentStatus(paymentId, 'processing');
    } catch (error) {
      throw new Error('Failed to process payment');
    }
  }
}
