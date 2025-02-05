import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Templates from "./pages/Templates";
import CreateAgent from "./pages/CreateAgent";
import Agents from "./pages/Agents";
import AgentChat from "./pages/AgentChat";
import Monitoring from "./pages/Monitoring";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <AppSidebar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Index />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/templates"
                      element={
                        <ProtectedRoute>
                          <Templates />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/create"
                      element={
                        <ProtectedRoute>
                          <CreateAgent />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/agents"
                      element={
                        <ProtectedRoute>
                          <Agents />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/chat"
                      element={
                        <ProtectedRoute>
                          <AgentChat />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/monitoring"
                      element={
                        <ProtectedRoute>
                          <Monitoring />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </SidebarProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;