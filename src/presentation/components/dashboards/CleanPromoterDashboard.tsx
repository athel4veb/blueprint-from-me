
import { useAuth } from '@/presentation/contexts/AuthContext';

export const CleanPromoterDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Promoter Dashboard</h1>
      <p>Welcome, {user?.fullName}!</p>
    </div>
  );
};
