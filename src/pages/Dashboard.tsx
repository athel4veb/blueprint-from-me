
import { useAuth } from '@/contexts/AuthContext';
import PromoterDashboard from '@/components/dashboards/PromoterDashboard';
import CompanyDashboard from '@/components/dashboards/CompanyDashboard';
import SupervisorDashboard from '@/components/dashboards/SupervisorDashboard';

const Dashboard = () => {
  const { profile, loading, user } = useAuth();

  console.log('Dashboard render:', { profile, loading, user: user?.id });

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

  // If user is authenticated but no profile exists, show setup message
  if (user && !profile) {
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

  switch (profile?.user_type) {
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
            {profile && (
              <p className="text-sm text-gray-500 mt-2">
                Current user type: {profile.user_type || 'Not set'}
              </p>
            )}
          </div>
        </div>
      );
  }
};

export default Dashboard;
