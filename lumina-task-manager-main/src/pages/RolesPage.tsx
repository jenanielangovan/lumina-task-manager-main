import { motion } from "framer-motion";
import { PERMISSIONS, ROLE_LABELS, Permission } from "@/utils/permissions";
import { Check, X, Lock } from "lucide-react";
import type { Role } from "@/data/mockUsers";

const roles: Role[] = ["super_admin", "tenant_admin", "project_manager", "team_member", "viewer"];
const permissions: { key: Permission; label: string }[] = [
  { key: "canCreateProject", label: "Create Project" },
  { key: "canDeleteProject", label: "Delete Project" },
  { key: "canCreateTask", label: "Create Task" },
  { key: "canDeleteTask", label: "Delete Task" },
  { key: "canManageAllUsers", label: "Manage Users" },
  { key: "canViewAuditLogs", label: "View Audit Logs" },
  { key: "canManageRoles", label: "Manage Roles" },
  { key: "canManageTenants", label: "Manage Tenants" },
  { key: "canDeleteTenant", label: "Delete Tenant" },
];

const RolesPage = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <h1 className="text-2xl font-bold">Role Management</h1>
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
              {permissions.map((p) => (
                <th key={p.key} className="px-3 py-3 text-center font-medium text-muted-foreground text-xs">{p.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role} className="border-b border-border/50">
                <td className="px-4 py-3 font-medium flex items-center gap-2">
                  {role === "super_admin" && <Lock className="w-3 h-3 text-muted-foreground" />}
                  {ROLE_LABELS[role]}
                </td>
                {permissions.map((p) => (
                  <td key={p.key} className="px-3 py-3 text-center">
                    {PERMISSIONS[role]?.[p.key] ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <p className="text-xs text-muted-foreground">* Super Admin permissions are locked and cannot be modified.</p>
  </motion.div>
);

export default RolesPage;
