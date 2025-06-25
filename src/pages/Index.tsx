
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">EventStaff Pro</h1>
            <div className="space-x-4">
              <Link to="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Connect Events with Top Talent
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The leading platform for event staffing. Companies post jobs, promoters apply, 
            and we handle everything from matching to payments.
          </p>
          <div className="space-x-4">
            <Link to="/auth/register">
              <Button size="lg" className="px-8 py-3">
                Join as Promoter
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button size="lg" variant="outline" className="px-8 py-3">
                Post Jobs
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>For Promoters</CardTitle>
              <CardDescription>
                Find flexible event work that fits your schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Browse available jobs by location</li>
                <li>• Apply with one click</li>
                <li>• Get paid securely after completion</li>
                <li>• Build your reputation with ratings</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Companies</CardTitle>
              <CardDescription>
                Staff your events with qualified promoters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Post jobs in minutes</li>
                <li>• Review applications and ratings</li>
                <li>• Manage multiple locations</li>
                <li>• Track performance and payments</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Supervisors</CardTitle>
              <CardDescription>
                Oversee teams and manage event operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Monitor team performance</li>
                <li>• Submit daily reports</li>
                <li>• Coordinate with promoters</li>
                <li>• Ensure quality standards</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of promoters and companies already using our platform
          </p>
          <Link to="/auth/register">
            <Button size="lg" className="px-8 py-3">
              Create Your Account
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
