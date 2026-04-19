import { motion } from "framer-motion";
import { ListTodo, AlertTriangle, Users, TrendingUp, TrendingDown, Plus, Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useTenant } from "@/context/TenantContext";
import { can } from "@/utils/permissions";
import { formatRelativeTime, getDaysUntil, getInitials, getAvatarColor } from "@/utils/formatters";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useNavigate } from "react-router-dom";

const anim = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const DashboardPage = () => {
  const { user } = useAuth();
  const { getFilteredTasks, getFilteredProjects, getFilteredAuditLog } = useData();
  const { tenants } = useTenant();
  const navigate = useNavigate();

  const tasks = getFilteredTasks();
  const projects = getFilteredProjects();
  const auditLog = getFilteredAuditLog();

  const totalTasks = tasks.length;
  const overdue = tasks.filter((t) => getDaysUntil(t.dueDate) < 0 && t.status !== "done").length;
  const done = tasks.filter((t) => t.status === "done").length;
  const completionPct = totalTasks ? Math.round((done / totalTasks) * 100) : 0;

  const stats = [
    { label: "Total Tasks", value: totalTasks, icon: ListTodo, trend: "+12%", up: true },
    { label: "Overdue", value: overdue, icon: AlertTriangle, trend: overdue > 0 ? `${overdue} tasks` : "None", up: false },
    { label: "Team Members", value: new Set(tasks.map((t) => t.assigneeId)).size, icon: Users, trend: "+2", up: true },
    { label: "Completion", value: `${completionPct}%`, icon: TrendingUp, trend: "+5%", up: true },
  ];

  // Heatmap (mock data)
  const heatmapData = Array.from({ length: 84 }, () => Math.floor(Math.random() * 5));
  const heatColors = ["bg-muted/30", "bg-emerald-900/40", "bg-emerald-700/50", "bg-emerald-500/60", "bg-emerald-400/80"];

  return (
    <motion.div {...anim} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        {can(user, "canCreateTask") && (
          <button onClick={() => navigate("/tasks")} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium glow-btn">
            <Plus className="w-4 h-4" /> Create Task
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} {...anim} transition={{ delay: i * 0.05 }} className="glass-card p-5 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold mt-0.5">{s.value}</p>
              <span className={`text-xs flex items-center gap-1 mt-1 ${s.up ? "text-emerald-400" : "text-destructive"}`}>
                {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {s.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap */}
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="text-sm font-semibold mb-4">Productivity</h3>
          <div className="grid grid-cols-12 gap-1">
            {heatmapData.map((v, i) => (
              <div key={i} className={`aspect-square rounded-sm ${heatColors[v]}`} />
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {auditLog.slice(0, 8).map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 text-sm">
                <UserAvatar name={entry.userName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="truncate">
                    <span className="font-medium">{entry.userName}</span>{" "}
                    <span className={entry.action === "CREATE" ? "text-emerald-400" : entry.action === "DELETE" ? "text-destructive" : entry.action === "UPDATE" ? "text-blue-400" : "text-muted-foreground"}>
                      {entry.action.toLowerCase()}d
                    </span>{" "}
                    {entry.entityName}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatRelativeTime(entry.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Progress */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold mb-4">Project Progress</h3>
        <div className="space-y-4">
          {projects.map((p) => {
            const days = getDaysUntil(p.dueDate);
            return (
              <div key={p.id} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">{p.name}</span>
                    <span className={`text-xs ${days < 0 ? "text-destructive" : days < 7 ? "text-warning" : "text-muted-foreground"}`}>
                      {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold w-12 text-right">{p.progress}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Super Admin: Tenant Overview */}
      {user?.role === "super_admin" && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">Tenant Overview</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tenants.map((t) => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.plan} • {t.members} members</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardPage;
