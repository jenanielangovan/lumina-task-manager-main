import { Role } from "@/data/mockUsers";

export type Permission =
  | "canManageTenants"
  | "canManageAllUsers"
  | "canDeleteTenant"
  | "canViewAuditLogs"
  | "canManageRoles"
  | "canCreateProject"
  | "canDeleteProject"
  | "canCreateTask"
  | "canDeleteTask";

export const PERMISSIONS: Record<Role, Partial<Record<Permission, boolean>>> = {
  super_admin: {
    canManageTenants: true,
    canManageAllUsers: true,
    canDeleteTenant: true,
    canViewAuditLogs: true,
    canManageRoles: true,
    canCreateProject: true,
    canDeleteProject: true,
    canCreateTask: true,
    canDeleteTask: true,
  },
  tenant_admin: {
    canManageTenants: false,
    canManageAllUsers: false,
    canDeleteTenant: false,
    canViewAuditLogs: true,
    canManageRoles: true,
    canCreateProject: true,
    canDeleteProject: true,
    canCreateTask: true,
    canDeleteTask: true,
  },
  project_manager: {
    canManageRoles: false,
    canViewAuditLogs: true,
    canCreateProject: true,
    canDeleteProject: false,
    canCreateTask: true,
    canDeleteTask: true,
  },
  team_member: {
    canCreateTask: true,
    canDeleteTask: false,
    canCreateProject: false,
    canViewAuditLogs: false,
  },
  viewer: {
    canCreateTask: false,
    canDeleteTask: false,
    canCreateProject: false,
    canViewAuditLogs: false,
  },
};

export const can = (user: { role: Role } | null | undefined, permission: Permission): boolean => {
  if (!user) return false;
  return !!PERMISSIONS[user.role]?.[permission];
};

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  tenant_admin: "Tenant Admin",
  project_manager: "Project Manager",
  team_member: "Team Member",
  viewer: "Viewer",
};

export const ROLE_COLORS: Record<Role, string> = {
  super_admin: "bg-destructive/20 text-destructive",
  tenant_admin: "bg-orange-500/20 text-orange-400",
  project_manager: "bg-blue-500/20 text-blue-400",
  team_member: "bg-emerald-500/20 text-emerald-400",
  viewer: "bg-muted text-muted-foreground",
};
