import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { formatRelativeTime } from "@/utils/formatters";

const ProfilePage = () => {
  const { user } = useAuth();
  const { getFilteredTasks, getFilteredAuditLog } = useData();

  const tasks = getFilteredTasks();
  const assigned = tasks.filter((t) => t.assigneeId === user?.id);
  const completed = assigned.filter((t) => t.status === "done");
  const logs = getFilteredAuditLog().filter((l) => l.userId === user?.id).slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="glass-card p-6 flex items-start gap-6">
        <UserAvatar name={user?.name ?? ""} size="lg" />
        <div className="flex-1 space-y-2">
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
          <RoleBadge role={user?.role ?? "viewer"} />
          <p className="text-sm text-muted-foreground mt-2">{user?.bio || "No bio set."}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Tasks Assigned", value: assigned.length },
          { label: "Tasks Completed", value: completed.length },
          { label: "Projects", value: new Set(assigned.map((t) => t.projectId)).size },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="font-semibold">Recent Activity</h3>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        ) : (
          logs.map((l) => (
            <div key={l.id} className="flex items-center justify-between text-sm py-2 border-b border-border/30 last:border-0">
              <span>{l.action.toLowerCase()}d {l.entityName}</span>
              <span className="text-xs text-muted-foreground">{formatRelativeTime(l.timestamp)}</span>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage;
