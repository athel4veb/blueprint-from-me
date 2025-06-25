
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, CreditCard, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface WalletData {
  balance: number;
  pending_balance: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
}

interface PayoutRequest {
  id: string;
  amount: number;
  status: string;
  requested_at: string;
  processed_at: string | null;
  notes: string | null;
}

const Wallet = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      fetchWalletData();
      fetchTransactions();
      fetchPayoutRequests();
    }
  }, [profile]);

  const fetchWalletData = async () => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('balance, pending_balance')
        .eq('user_id', profile?.id)
        .single();

      if (error) throw error;
      setWallet(data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', (await supabase.from('wallets').select('id').eq('user_id', profile?.id).single()).data?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchPayoutRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('promoter_id', profile?.id)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setPayoutRequests(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payout requests:', error);
      setLoading(false);
    }
  };

  const requestPayout = async () => {
    if (!payoutAmount || !bankDetails) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(payoutAmount);
    if (amount > (wallet?.balance || 0)) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('payout_requests')
        .insert({
          promoter_id: profile?.id,
          amount: amount,
          bank_details: { details: bankDetails },
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payout request submitted successfully",
      });

      setPayoutAmount('');
      setBankDetails('');
      fetchPayoutRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit payout request",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading wallet...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wallet & Earnings</h1>
          <p className="text-gray-600">Manage your earnings and request payouts</p>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Available Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ${wallet?.balance?.toFixed(2) || '0.00'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-yellow-600" />
                Pending Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                ${wallet?.pending_balance?.toFixed(2) || '0.00'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                Total Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                ${((wallet?.balance || 0) + (wallet?.pending_balance || 0)).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payout Request */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Request Payout</CardTitle>
            <CardDescription>Request a payout of your available balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  max={wallet?.balance || 0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bank Details</label>
                <Textarea
                  placeholder="Enter your bank account details"
                  value={bankDetails}
                  onChange={(e) => setBankDetails(e.target.value)}
                />
              </div>
            </div>
            <Button 
              onClick={requestPayout} 
              className="mt-4"
              disabled={!wallet?.balance || wallet.balance <= 0}
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Request Payout
            </Button>
          </CardContent>
        </Card>

        {/* Payout Requests History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Payout Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Processed Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payoutRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>${request.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={
                        request.status === 'completed' ? 'default' : 
                        request.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(request.requested_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {request.processed_at ? new Date(request.processed_at).toLocaleDateString() : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {payoutRequests.length === 0 && (
              <div className="text-center py-4 text-gray-500">No payout requests yet</div>
            )}
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {transaction.type === 'credit' ? (
                          <ArrowDownLeft className="w-4 h-4 mr-2 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 mr-2 text-red-600" />
                        )}
                        {transaction.type}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell 
                      className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {transactions.length === 0 && (
              <div className="text-center py-4 text-gray-500">No transactions yet</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Wallet;
