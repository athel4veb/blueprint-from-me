
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
}

export const LoginForm = ({ email, password, onEmailChange, onPasswordChange }: LoginFormProps) => {
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
      
      // Add a timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Login timeout after 30 seconds')), 30000)
      );

      const loginPromise = supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any;

      console.log('Sign in response:', { data: data?.user?.id, error });

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
        } else if (error.message.includes('timeout')) {
          errorMessage = "Login is taking too long. Please check your internet connection and try again.";
        } else {
          errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
      }

      if (data?.user) {
        console.log('Login successful for user:', data.user.id);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        // Add a small delay before navigation to ensure auth state is updated
        setTimeout(() => {
          navigate("/dashboard");
        }, 100);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Handle network-related errors specifically
      if (error.message.includes('fetch') || error.message.includes('network')) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 mb-6">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          placeholder="Enter your email"
          maxLength={255}
          autoComplete="email"
          disabled={loading}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          placeholder="Enter your password"
          maxLength={128}
          autoComplete="current-password"
          disabled={loading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      
      {loading && (
        <p className="text-sm text-gray-600 text-center mt-2">
          If login is taking too long, please refresh the page and try again.
        </p>
      )}
    </form>
  );
};
