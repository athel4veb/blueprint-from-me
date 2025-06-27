
import { useAuth } from '@/presentation/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ManageJobs = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
          <p className="text-gray-600">Create and manage your job postings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Job management features will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageJobs;
