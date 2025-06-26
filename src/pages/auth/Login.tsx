
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { seedTestUsers } from "@/utils/seedTestUsers";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Input validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Login attempt for:', email);
    
    // Client-side validation
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (!password || password.length < 1) {
      toast({
        title: "Missing password",
        description: "Please enter your password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting to sign in...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      console.log('Sign in response:', { data: data.user?.id, error });

      if (error) {
        console.error('Login error:', error);
        let errorMessage = "Login failed. Please try again.";
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Please verify your email address before logging in. Check your inbox for a confirmation email.";
        } else if (error.message.includes('Too many requests')) {
          errorMessage = "Too many login attempts. Please wait a few minutes before trying again.";
        } else if (error.message.includes('User not found')) {
          errorMessage = "No account found with this email address. Please register first.";
        } else {
          errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
      }

      if (data.user) {
        console.log('Login successful for user:', data.user.id);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Test credentials helper
  const testCredentials = [
    { type: 'Admin', email: 'admin@test.com', password: 'password123', description: 'Full system access' },
    { type: 'Company Owner', email: 'company@test.com', password: 'password123', description: 'John Company' },
    { type: 'Company Manager', email: 'manager@test.com', password: 'password123', description: 'Sarah Manager' },
    { type: 'Event Coordinator', email: 'coordinator@test.com', password: 'password123', description: 'Alex Coordinator' },
    { type: 'Supervisor', email: 'supervisor@test.com', password: 'password123', description: 'Mike Supervisor' },
    { type: 'Second Supervisor', email: 'supervisor2@test.com', password: 'password123', description: 'Lisa Thompson' },
    { type: 'Promoter', email: 'promoter@test.com', password: 'password123', description: 'Jane Promoter' },
    { type: 'Promoter 2', email: 'promoter2@test.com', password: 'password123', description: 'Maria Rodriguez' },
    { type: 'Promoter 3', email: 'promoter3@test.com', password: 'password123', description: 'David Chen' },
    { type: 'Second Company', email: 'company2@test.com', password: 'password123', description: 'Robert Williams' }
  ];

  const fillTestCredentials = (credentials: { email: string; password: string }) => {
    setEmail(credentials.email);
    setPassword(credentials.password);
  };

  // Handle seeding test users
  const handleSeedTestUsers = async () => {
    setSeeding(true);
    try {
      await seedTestUsers();
      toast({
        title: "Test users created",
        description: "All test accounts have been created with proper roles assigned",
      });
    } catch (error) {
      console.error('Seeding error:', error);
      toast({
        title: "Seeding failed",
        description: "Failed to create test users. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                maxLength={255}
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                maxLength={128}
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          {/* Test users seeding section */}
          <div className="mb-6 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800 mb-2 font-medium">Create All Test Users First:</p>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleSeedTestUsers}
              disabled={seeding}
              className="w-full text-blue-700 border-blue-300"
            >
              {seeding ? "Creating All Test Users..." : "Create All Test Users & Assign Roles"}
            </Button>
          </div>
          
          {/* Test credentials section */}
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-3 font-medium">Test Accounts (create users first):</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {testCredentials.map((cred, index) => (
                <Button 
                  key={index}
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fillTestCredentials({ email: cred.email, password: cred.password })}
                  className="text-xs justify-between p-2 h-auto"
                >
                  <div className="text-left">
                    <div className="font-medium">{cred.type}</div>
                    <div className="text-xs text-gray-500">{cred.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link to="/auth/register" className="text-sm text-blue-600 hover:text-blue-500">
              Don't have an account? Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
