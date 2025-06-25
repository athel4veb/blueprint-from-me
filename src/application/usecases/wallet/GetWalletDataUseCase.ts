
import { IWalletRepository } from '@/domain/repositories/IWalletRepository';

export class GetWalletDataUseCase {
  constructor(private walletRepository: IWalletRepository) {}

  async execute(userId: string) {
    const [wallet, earnings, payoutRequests] = await Promise.all([
      this.walletRepository.getWalletByUserId(userId),
      this.walletRepository.calculateEarnings(userId),
      this.walletRepository.getPayoutRequests(userId)
    ]);

    const transactions = wallet 
      ? await this.walletRepository.getTransactionsByWallet(wallet.id)
      : [];

    return {
      wallet,
      earnings,
      transactions,
      payoutRequests
    };
  }
}
