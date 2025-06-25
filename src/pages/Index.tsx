
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Users, Star, Briefcase, Wallet, CreditCard } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const getDashboardNavigation = () => {
    if (!user || !profile) return null;

    const baseButtons = [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Browse Jobs", path: "/jobs" },
      { label: "Ratings & Reviews", path: "/ratings" }
    ];

    if (profile.user_type === 'promoter') {
      baseButtons.push({ label: "My Wallet", path: "/wallet" });
    } else if (profile.user_type === 'company') {
      baseButtons.push(
        { label: "Manage Jobs", path: "/manage-jobs" },
        { label: "Payments", path: "/payments" }
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {baseButtons.map((button) => (
          <Button
            key={button.path}
            variant="outline"
            onClick={() => navigate(button.path)}
          >
            {button.label}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">EventStaff Pro</h1>
          </div>
          <div className="space-x-4">
            {user ? (
              getDashboardNavigation()
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/auth/login')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/auth/register')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Connect Events with Perfect Staff
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          The premier platform connecting event companies with talented promoters, models, and supervisors. 
          Find your next opportunity or hire the perfect team for your event.
        </p>
        <div className="space-x-4">
          <Button size="lg" onClick={() => navigate('/jobs')}>
            Browse Jobs
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/auth/register')}>
            Join Our Network
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need in One Platform
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Event Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create and manage events with detailed job postings and requirements
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Talent Pool</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access a network of qualified promoters, models, and supervisors
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Star className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Rating System</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Build trust with comprehensive ratings and feedback system
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Briefcase className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Job Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Smart matching system connects the right talent with the right events
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Wallet className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>Wallet System</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Secure payment processing and earnings management for promoters
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CreditCard className="h-12 w-12 text-teal-600 mx-auto mb-4" />
              <CardTitle>Payment Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Streamlined payment processing and financial tracking for companies
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8">
            Join thousands of event professionals already using EventStaff Pro
          </p>
          <div className="space-x-4">
            <Button size="lg" variant="secondary" onClick={() => navigate('/auth/register')}>
              Sign Up Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/jobs')}>
              Browse Opportunities
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Briefcase className="h-6 w-6" />
            <span className="text-xl font-bold">EventStaff Pro</span>
          </div>
          <p className="text-gray-400">
            Connecting events with perfect staff since 2024
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
