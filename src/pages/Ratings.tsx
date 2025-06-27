
import { useAuth } from '@/presentation/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Ratings = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ratings & Reviews</h1>
          <p className="text-gray-600">View and manage ratings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ratings Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ratings and reviews will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Ratings;
