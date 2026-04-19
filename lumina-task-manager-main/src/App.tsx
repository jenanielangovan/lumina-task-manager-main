import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { TenantProvider } from "@/context/TenantContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { DataProvider } from "@/context/DataContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import DashboardPage from "@/pages/DashboardPage";
import ProjectsPage from "@/pages/ProjectsPage";
import TasksPage from "@/pages/TasksPage";
import KanbanPage from "@/pages/KanbanPage";
import CalendarPage from "@/pages/CalendarPage";
import TeamPage from "@/pages/TeamPage";
import RolesPage from "@/pages/RolesPage";
import AuditLogsPage from "@/pages/AuditLogsPage";
import SettingsPage from "@/pages/SettingsPage";
import ProfilePage from "@/pages/ProfilePage";
import NotificationsPage from "@/pages/NotificationsPage";
import TenantsPage from "@/pages/TenantsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TenantProvider>
          <DataProvider>
            <TooltipProvider>
              <Toaster />
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/projects" element={<ProtectedRoute requiredRoles={["super_admin","tenant_admin","project_manager","team_member"]}><ProjectsPage /></ProtectedRoute>} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/kanban" element={<KanbanPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/team" element={<ProtectedRoute requiredRoles={["super_admin","tenant_admin","project_manager"]}><TeamPage /></ProtectedRoute>} />
                    <Route path="/roles" element={<ProtectedRoute requiredPermission="canManageRoles" requiredRoles={["super_admin","tenant_admin"]}><RolesPage /></ProtectedRoute>} />
                    <Route path="/audit-logs" element={<ProtectedRoute requiredPermission="canViewAuditLogs" requiredRoles={["super_admin","tenant_admin","project_manager"]}><AuditLogsPage /></ProtectedRoute>} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/tenants" element={<ProtectedRoute requiredRoles={["super_admin"]}><TenantsPage /></ProtectedRoute>} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </DataProvider>
        </TenantProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
