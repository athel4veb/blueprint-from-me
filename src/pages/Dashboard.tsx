import { useAuth } from '@/presentation/contexts/AuthContext';
import PromoterDashboard from '@/components/dashboards/PromoterDashboard';
import CompanyDashboard from '@/components/dashboards/CompanyDashboard';
import SupervisorDashboard from '@/components/dashboards/SupervisorDashboard';

const Dashboard = () => {
  const { user, loading, userType } = useAuth();

  console.log('Dashboard render:', { user: user?.id, loading, userType });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-2">Loading...</div>
          <div className="text-sm text-gray-500">Setting up your profile...</div>
        </div>
      </div>
    );
  }

  // If user is authenticated but no user exists, show setup message
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to EventStaff Pro</h1>
          <p className="text-gray-600 mb-4">Setting up your profile...</p>
          <p className="text-sm text-gray-500">If this takes too long, please refresh the page.</p>
        </div>
      </div>
    );
  }

  switch (user?.userType) {
    case 'promoter':
      return <PromoterDashboard />;
    case 'company':
      return <CompanyDashboard />;
    case 'supervisor':
      return <SupervisorDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to EventStaff Pro</h1>
            <p className="text-gray-600">Please complete your profile setup or contact support.</p>
            {user && (
              <p className="text-sm text-gray-500 mt-2">
                Current user type: {user.userType || 'Not set'}
              </p>
            )}
          </div>
        </div>
      );
  }
};

export default Dashboard;
