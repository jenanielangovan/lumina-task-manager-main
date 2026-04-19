import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { formatRelativeTime } from "@/utils/formatters";

const actionColors: Record<string, string> = {
  CREATE: "text-emerald-400",
  UPDATE: "text-blue-400",
  DELETE: "text-destructive",
  LOGIN: "text-muted-foreground",
};

const AuditLogsPage = () => {
  const { user } = useAuth();
  const { getFilteredAuditLog } = useData();
  const [actionFilter, setActionFilter] = useState("all");
  const [searchUser, setSearchUser] = useState("");

  const logs = getFilteredAuditLog();

  const filtered = useMemo(() => {
    return logs
      .filter((l) => actionFilter === "all" || l.action === actionFilter)
      .filter((l) => !searchUser || l.userName.toLowerCase().includes(searchUser.toLowerCase()))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [logs, actionFilter, searchUser]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <h1 className="text-2xl font-bold">Audit Logs</h1>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={searchUser} onChange={(e) => setSearchUser(e.target.value)} placeholder="Filter by user..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="LOGIN">Login</option>
        </select>
      </div>
      <div className="glass-card p-5 space-y-1">
        {filtered.map((entry) => (
          <div key={entry.id} className="flex items-start gap-3 py-3 border-b border-border/30 last:border-0">
            <UserAvatar name={entry.userName} size="sm" />
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">{entry.userName}</span>{" "}
                <span className={actionColors[entry.action]}>{entry.action.toLowerCase()}d</span>{" "}
                <span className="text-muted-foreground">{entry.entity}</span>{" "}
                <span className="font-medium">"{entry.entityName}"</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{formatRelativeTime(entry.timestamp)}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No audit logs found.</p>}
      </div>
    </motion.div>
  );
};

export default AuditLogsPage;
