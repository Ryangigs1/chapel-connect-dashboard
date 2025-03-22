
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { useAuth } from "./lib/auth";
import { ThemeProvider } from "./lib/theme";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Students from "./pages/Students";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UserProfile from "./pages/UserProfile";
import ChapelEvents from "./pages/ChapelEvents";
import Dashboard from "./pages/Dashboard";
import Gallery from "./pages/Gallery";
import Music from "./pages/Music";
import PrayerRequest from "./pages/PrayerRequest";
import ChapelRules from "./pages/ChapelRules";
import Chaplains from "./pages/Chaplains";
import { useState } from "react";

// Root component to check authentication state
const Root = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // If still loading auth state, show nothing (the ProtectedRoute will handle loading UI)
  if (loading) return null;
  
  // If not authenticated, redirect to sign-in
  return isAuthenticated ? <Dashboard /> : <Navigate to="/sign-in" replace />;
};

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Auth routes */}
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                
                {/* Root route - checks auth and redirects appropriately */}
                <Route path="/" element={<Root />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/index" element={
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
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } />
                <Route path="/events" element={
                  <ProtectedRoute>
                    <ChapelEvents />
                  </ProtectedRoute>
                } />
                <Route path="/gallery" element={
                  <ProtectedRoute>
                    <Gallery />
                  </ProtectedRoute>
                } />
                <Route path="/music" element={
                  <ProtectedRoute>
                    <Music />
                  </ProtectedRoute>
                } />
                <Route path="/prayer-request" element={
                  <ProtectedRoute>
                    <PrayerRequest />
                  </ProtectedRoute>
                } />
                <Route path="/chapel-rules" element={
                  <ProtectedRoute>
                    <ChapelRules />
                  </ProtectedRoute>
                } />
                <Route path="/chaplains" element={
                  <ProtectedRoute>
                    <Chaplains />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
