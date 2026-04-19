import { useLocation, Link } from "react-router-dom";
import { Bell, Moon, Sun, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useData } from "@/context/DataContext";
import { UserAvatar } from "./UserAvatar";
import { useState, useRef, useEffect } from "react";

const pageNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/tasks": "Tasks",
  "/kanban": "Kanban Board",
  "/calendar": "Calendar",
  "/team": "Team Members",
  "/roles": "Role Management",
  "/audit-logs": "Audit Logs",
  "/settings": "Settings",
  "/profile": "Profile",
  "/notifications": "Notifications",
  "/tenants": "Tenants",
};

export const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadNotificationCount } = useData();
  const [userMenu, setUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const pageName = pageNames[location.pathname] ?? "Page";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">Home</Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">{pageName}</span>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent transition-colors" title="Toggle theme">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <Link to="/notifications" className="p-2 rounded-lg hover:bg-accent transition-colors relative" title="Notifications">
          <Bell className="w-4 h-4" />
          {unreadNotificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-[10px] flex items-center justify-center font-medium">
              {unreadNotificationCount}
            </span>
          )}
        </Link>
        <div ref={menuRef} className="relative">
          <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <UserAvatar name={user?.name ?? ""} size="sm" />
          </button>
          {userMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-50 py-1">
              <Link to="/profile" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors">
                <User className="w-4 h-4" /> Profile
              </Link>
              <Link to="/settings" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <hr className="border-border my-1" />
              <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors w-full text-destructive">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
