
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { useAuth } from "./lib/auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Students from "./pages/Students";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminSignIn from "./pages/AdminSignIn";

const queryClient = new QueryClient();

// Root component to check authentication state
const Root = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // If still loading auth state, show nothing (the ProtectedRoute will handle loading UI)
  if (loading) return null;
  
  // If not authenticated, redirect to sign-in
  return isAuthenticated ? <Index /> : <Navigate to="/sign-in" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Auth routes */}
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/admin/login" element={<AdminSignIn />} />
            
            {/* Root route - checks auth and redirects appropriately */}
            <Route path="/" element={<Root />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/students" element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            } />
            <Route path="/students/:studentId" element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute isAdmin={true}>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/admin/attendance/:attendanceId" element={
              <ProtectedRoute isAdmin={true}>
                <Admin />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
