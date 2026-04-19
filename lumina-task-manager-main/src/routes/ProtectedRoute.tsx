import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { can, Permission } from "@/utils/permissions";
import { AccessDenied } from "@/components/shared/AccessDenied";
import type { Role } from "@/data/mockUsers";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requiredRoles?: Role[];
}

export const ProtectedRoute = ({ children, requiredPermission, requiredRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredPermission && !can(user, requiredPermission)) return <AccessDenied requiredRoles={requiredRoles} />;
  if (requiredRoles && !requiredRoles.includes(user!.role)) return <AccessDenied requiredRoles={requiredRoles} />;
  return <>{children}</>;
};
