
import { useAuth } from '@/contexts/AuthContext';
import PromoterDashboard from '@/components/dashboards/PromoterDashboard';
import CompanyDashboard from '@/components/dashboards/CompanyDashboard';
import SupervisorDashboard from '@/components/dashboards/SupervisorDashboard';

const Dashboard = () => {
  const { userType } = useAuth();

  switch (userType) {
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
            <h1 className="text-2xl font-bold mb-4">Welcome to the Platform</h1>
            <p className="text-gray-600">Please complete your profile setup.</p>
          </div>
        </div>
      );
  }
};

export default Dashboard;
