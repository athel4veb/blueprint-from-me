
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
        // Handle specific authentication errors
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

  // Add test credentials helper
  const fillTestCredentials = (type: 'company' | 'promoter' | 'supervisor') => {
    const credentials = {
      company: { email: 'company@test.com', password: 'password123' },
      promoter: { email: 'promoter@test.com', password: 'password123' },
      supervisor: { email: 'supervisor@test.com', password: 'password123' }
    };
    
    setEmail(credentials[type].email);
    setPassword(credentials[type].password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
          
          {/* Test credentials section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-2">Test with pre-seeded accounts:</p>
            <div className="flex flex-col gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => fillTestCredentials('company')}
                className="text-xs"
              >
                Fill Company Credentials
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => fillTestCredentials('promoter')}
                className="text-xs"
              >
                Fill Promoter Credentials
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => fillTestCredentials('supervisor')}
                className="text-xs"
              >
                Fill Supervisor Credentials
              </Button>
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
