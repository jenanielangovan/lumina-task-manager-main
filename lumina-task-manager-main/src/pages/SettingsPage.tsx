import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { user } = useAuth();
  const { activeTenant } = useTenant();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [tab, setTab] = useState("general");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const tabs = ["general", "security", "notifications", "danger"];
  const isSuperAdmin = user?.role === "super_admin";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="flex gap-2 border-b border-border">
        {tabs.map((t) => {
          if (t === "danger" && !isSuperAdmin) return null;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "danger" ? "Danger Zone" : t}
            </button>
          );
        })}
      </div>

      {tab === "general" && (
        <div className="glass-card p-6 space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium mb-1.5">Tenant Name</label>
            <input type="text" defaultValue={activeTenant?.name ?? ""} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Slug</label>
            <input type="text" defaultValue={activeTenant?.slug ?? ""} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Timezone</label>
            <select className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option>UTC</option>
              <option>US/Eastern</option>
              <option>US/Pacific</option>
              <option>Europe/London</option>
              <option>Asia/Tokyo</option>
            </select>
          </div>
          <button onClick={() => toast({ title: "Settings saved!" })} className="px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground glow-btn">Save Changes</button>
        </div>
      )}

      {tab === "security" && (
        <div className="glass-card p-6 space-y-4 max-w-lg">
          <h3 className="font-semibold">Change Password</h3>
          <input type="password" placeholder="Current password" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <input type="password" placeholder="New password" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <input type="password" placeholder="Confirm new password" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <button onClick={() => toast({ title: "Password updated!" })} className="px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground glow-btn">Update Password</button>
        </div>
      )}

      {tab === "notifications" && (
        <div className="glass-card p-6 space-y-4 max-w-lg">
          {["Task assigned", "Task completed", "New comment", "Project updates", "Weekly digest"].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-sm">{item}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-background after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </div>
      )}

      {tab === "danger" && isSuperAdmin && (
        <div className="glass-card p-6 max-w-lg border-destructive/30">
          <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">Deleting a tenant will permanently remove all associated data.</p>
          <button onClick={() => setShowDeleteConfirm(true)} className="px-4 py-2 rounded-lg text-sm bg-destructive text-destructive-foreground">Delete Tenant</button>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
          <div className="glass-card p-6 w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-destructive">Confirm Delete</h3>
            <p className="text-sm text-muted-foreground">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg text-sm border border-input hover:bg-accent">Cancel</button>
              <button onClick={() => { setShowDeleteConfirm(false); toast({ title: "Tenant deleted", variant: "destructive" }); }} className="px-4 py-2 rounded-lg text-sm bg-destructive text-destructive-foreground">Delete</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SettingsPage;
