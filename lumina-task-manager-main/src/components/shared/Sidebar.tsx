import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FolderKanban, ListTodo, Columns3, Calendar,
  Users, Shield, FileText, Settings, LogOut, ChevronLeft, ChevronRight,
  Building2, Sparkles, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import { can, Permission } from "@/utils/permissions";
import { UserAvatar } from "./UserAvatar";
import { RoleBadge } from "./RoleBadge";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  permission?: Permission;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", path: "/projects", icon: FolderKanban, roles: ["super_admin", "tenant_admin", "project_manager", "team_member"] },
  { label: "Tasks", path: "/tasks", icon: ListTodo },
  { label: "Kanban", path: "/kanban", icon: Columns3 },
  { label: "Calendar", path: "/calendar", icon: Calendar },
  { label: "Team", path: "/team", icon: Users, roles: ["super_admin", "tenant_admin", "project_manager"] },
  { label: "Roles", path: "/roles", icon: Shield, permission: "canManageRoles" },
  { label: "Audit Logs", path: "/audit-logs", icon: FileText, permission: "canViewAuditLogs" },
  { label: "Tenants", path: "/tenants", icon: Building2, roles: ["super_admin"] },
  { label: "Settings", path: "/settings", icon: Settings },
];

export const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { activeTenant, tenants, setActiveTenantId } = useTenant();
  const [tenantDropdown, setTenantDropdown] = useState(false);
  const location = useLocation();

  const visibleItems = navItems.filter((item) => {
    if (item.permission && !can(user, item.permission)) return false;
    if (item.roles && !item.roles.includes(user?.role ?? "")) return false;
    return true;
  });

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2 }}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border">
        <Sparkles className="w-6 h-6 text-primary shrink-0" />
        <AnimatePresence>
          {!collapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-bold text-lg whitespace-nowrap">
              Lumina Task
            </motion.span>
          )}
        </AnimatePresence>
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Tenant Switcher (super_admin only) */}
      {user?.role === "super_admin" && !collapsed && (
        <div className="px-3 py-2 border-b border-sidebar-border relative">
          <button
            onClick={() => setTenantDropdown(!tenantDropdown)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-sidebar-accent text-sm transition-colors"
          >
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="truncate">{activeTenant?.name ?? "All Tenants"}</span>
            <ChevronDown className="w-3 h-3 ml-auto text-muted-foreground" />
          </button>
          {tenantDropdown && (
            <div className="absolute left-3 right-3 top-full mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 py-1">
              {tenants.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setActiveTenantId(t.id); setTenantDropdown(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors ${t.id === activeTenant?.id ? "text-primary" : ""}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                active
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              } ${collapsed ? "justify-center px-0" : ""}`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-3">
        <div className={`flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}>
          <UserAvatar name={user?.name ?? ""} size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <RoleBadge role={user?.role ?? "viewer"} />
            </div>
          )}
          {!collapsed && (
            <button onClick={logout} className="text-muted-foreground hover:text-destructive transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
