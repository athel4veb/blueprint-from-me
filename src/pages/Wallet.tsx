import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, CreditCard, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useWallet } from '@/presentation/hooks/useWallet';
import { useState } from 'react';

const Wallet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [payoutAmount, setPayoutAmount] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  
  const {
    wallet,
    transactions,
    payoutRequests,
    earnings,
    loading,
    error,
    requestPayout
  } = useWallet(user?.id || '');

  const handleRequestPayout = async () => {
    try {
      await requestPayout(parseFloat(payoutAmount), bankDetails);
      toast({
        title: "Success",
        description: "Payout request submitted successfully",
      });
      setPayoutAmount('');
      setBankDetails('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Wallet</h1>
          <p className="text-gray-600">{error}</p>
        </div>
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
                ${earnings.availableForPayout.toFixed(2)}
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
                ${earnings.pendingEarnings.toFixed(2)}
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
                ${earnings.totalEarned.toFixed(2)}
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
                  max={earnings.availableForPayout}
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
              onClick={handleRequestPayout} 
              className="mt-4"
              disabled={earnings.availableForPayout <= 0}
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
                    <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
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
