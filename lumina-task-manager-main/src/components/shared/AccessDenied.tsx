import { Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/utils/permissions";
import type { Role } from "@/data/mockUsers";
import { RoleBadge } from "./RoleBadge";

interface AccessDeniedProps {
  requiredRoles?: Role[];
}

export const AccessDenied = ({ requiredRoles }: AccessDeniedProps) => {
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="p-4 rounded-full bg-destructive/10">
        <Shield className="w-12 h-12 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold">Access Denied</h1>
      <p className="text-muted-foreground text-center max-w-md">
        Your current role <RoleBadge role={user?.role ?? "viewer"} /> does not have permission to access this page.
      </p>
      {requiredRoles && requiredRoles.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Required roles: {requiredRoles.map((r) => ROLE_LABELS[r]).join(", ")}
        </p>
      )}
    </div>
  );
};
