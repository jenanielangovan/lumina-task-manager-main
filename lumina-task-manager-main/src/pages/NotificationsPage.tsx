import { motion } from "framer-motion";
import { Bell, Check } from "lucide-react";
import { useData } from "@/context/DataContext";
import { formatRelativeTime } from "@/utils/formatters";

const iconMap: Record<string, string> = {
  task_assigned: "📋",
  task_completed: "✅",
  comment: "💬",
  mention: "@",
  project_update: "📁",
};

const NotificationsPage = () => {
  const { getFilteredNotifications, markNotificationRead, markAllNotificationsRead } = useData();
  const notifications = getFilteredNotifications().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const today = new Date().toDateString();
  const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const groups = [
    { label: "Today", items: notifications.filter((n) => new Date(n.timestamp).toDateString() === today) },
    { label: "This Week", items: notifications.filter((n) => { const d = new Date(n.timestamp); return d.toDateString() !== today && d > thisWeek; }) },
    { label: "Older", items: notifications.filter((n) => new Date(n.timestamp) <= thisWeek) },
  ].filter((g) => g.items.length > 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button onClick={markAllNotificationsRead} className="flex items-center gap-1.5 text-sm text-primary hover:underline">
          <Check className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No notifications yet.</p>
        </div>
      ) : (
        groups.map((g) => (
          <div key={g.label}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">{g.label}</h3>
            <div className="space-y-1">
              {g.items.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`glass-card p-4 flex items-start gap-3 cursor-pointer transition-colors ${!n.read ? "border-primary/20" : "opacity-70"}`}
                >
                  <span className="text-lg">{iconMap[n.type] ?? "📌"}</span>
                  <div className="flex-1">
                    <p className="text-sm">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(n.timestamp)}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </motion.div>
  );
};

export default NotificationsPage;
