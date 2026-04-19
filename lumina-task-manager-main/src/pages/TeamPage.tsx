import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import { MOCK_USERS } from "@/data/mockUsers";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { formatDate } from "@/utils/formatters";
import { useData } from "@/context/DataContext";

const TeamPage = () => {
  const { user } = useAuth();
  const { activeTenant } = useTenant();
  const { getFilteredTasks } = useData();
  const [showInvite, setShowInvite] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const tasks = getFilteredTasks();
  const members = MOCK_USERS.filter((u) => u.tenantId === activeTenant?.id);
  const canInvite = user?.role === "super_admin" || user?.role === "tenant_admin";

  const selectedTasks = selectedMember ? tasks.filter((t) => t.assigneeId === selectedMember) : [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team Members</h1>
        {canInvite && (
          <button onClick={() => setShowInvite(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium glow-btn">
            <UserPlus className="w-4 h-4" /> Invite Member
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => {
          const memberTasks = tasks.filter((t) => t.assigneeId === m.id);
          return (
            <motion.div
              key={m.id}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedMember(m.id === selectedMember ? null : m.id)}
              className={`glass-card p-5 cursor-pointer transition-colors ${selectedMember === m.id ? "ring-1 ring-primary" : "hover:border-primary/30"}`}
            >
              <div className="flex items-start gap-3">
                <UserAvatar name={m.name} size="lg" />
                <div className="flex-1">
                  <h3 className="font-semibold">{m.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" />{m.email}</p>
                  <div className="mt-2"><RoleBadge role={m.role} /></div>
                  <p className="text-xs text-muted-foreground mt-2">Since {formatDate(m.joinedAt)}</p>
                  <p className="text-xs text-muted-foreground">{memberTasks.length} tasks assigned</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1" title="Active" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {selectedMember && selectedTasks.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-3">Assigned Tasks</h3>
          <div className="space-y-2">
            {selectedTasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm">
                <span>{t.title}</span>
                <span className="text-xs text-muted-foreground">{t.status.replace("_", " ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowInvite(false)}>
          <div className="glass-card p-6 w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">Invite Member</h2>
            <input type="email" placeholder="Email address" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <select className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="team_member">Team Member</option>
              <option value="project_manager">Project Manager</option>
              <option value="viewer">Viewer</option>
            </select>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowInvite(false)} className="px-4 py-2 rounded-lg text-sm border border-input hover:bg-accent">Cancel</button>
              <button onClick={() => setShowInvite(false)} className="px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground glow-btn">Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TeamPage;
