
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SecurityHeaders } from "@/components/security/SecurityHeaders";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ManageJobs from "./pages/ManageJobs";
import Wallet from "./pages/Wallet";
import Ratings from "./pages/Ratings";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import CompanyProfile from "./pages/CompanyProfile";
import Training from "./pages/Training";
import AdminPanel from "./pages/AdminPanel";
import Messages from "./pages/Messages";
import Calendar from "./pages/Calendar";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

// Configure QueryClient with security considerations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't retry on authentication errors
      retry: (failureCount, error: any) => {
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
      // Set reasonable stale time to prevent excessive requests
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Enable error boundary for unhandled errors
      throwOnError: (error: any) => {
        // Don't throw for expected auth errors
        return error?.status !== 401 && error?.status !== 403;
      },
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SecurityHeaders />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jobs" 
              element={
                <ProtectedRoute>
                  <Jobs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jobs/:id" 
              element={
                <ProtectedRoute>
                  <JobDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/manage-jobs" 
              element={
                <ProtectedRoute requiredRole="company">
                  <ManageJobs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wallet" 
              element={
                <ProtectedRoute requiredRole="promoter">
                  <Wallet />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ratings" 
              element={
                <ProtectedRoute>
                  <Ratings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payments" 
              element={
                <ProtectedRoute requiredRole="company">
                  <Payments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/company-profile" 
              element={
                <ProtectedRoute requiredRole="company">
                  <CompanyProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/training" 
              element={
                <ProtectedRoute>
                  <Training />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
