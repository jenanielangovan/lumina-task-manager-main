import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useTenant } from "@/context/TenantContext";
import { can } from "@/utils/permissions";
import { getDaysUntil, formatDate } from "@/utils/formatters";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { MOCK_USERS } from "@/data/mockUsers";
import { useNavigate } from "react-router-dom";

const statusColors: Record<string, string> = {
  planning: "bg-blue-500/20 text-blue-400",
  active: "bg-emerald-500/20 text-emerald-400",
  completed: "bg-primary/20 text-primary",
  on_hold: "bg-warning/20 text-warning",
};

const ProjectsPage = () => {
  const { user } = useAuth();
  const { getFilteredProjects, addProject } = useData();
  const { activeTenant } = useTenant();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const projects = getFilteredProjects();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTenant) return;
    addProject({
      tenantId: activeTenant.id,
      name,
      description,
      status: "planning",
      progress: 0,
      ownerId: user?.id ?? "",
      memberIds: [user?.id ?? ""],
      dueDate,
    });
    setShowModal(false);
    setName("");
    setDescription("");
    setDueDate("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        {can(user, "canCreateProject") && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium glow-btn">
            <Plus className="w-4 h-4" /> New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => {
          const days = getDaysUntil(p.dueDate);
          const members = MOCK_USERS.filter((u) => p.memberIds.includes(u.id));
          const circumference = 2 * Math.PI * 36;
          const offset = circumference - (p.progress / 100) * circumference;

          return (
            <motion.div
              key={p.id}
              whileHover={{ y: -2 }}
              onClick={() => navigate(`/tasks`)}
              className="glass-card p-5 cursor-pointer hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status]}`}>
                    {p.status}
                  </span>
                </div>
                <svg width="48" height="48" className="-rotate-90">
                  <circle cx="24" cy="24" r="18" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                  <circle cx="24" cy="24" r="18" fill="none" stroke="hsl(var(--primary))" strokeWidth="3"
                    strokeDasharray={2 * Math.PI * 18} strokeDashoffset={2 * Math.PI * 18 - (p.progress / 100) * 2 * Math.PI * 18}
                    strokeLinecap="round" />
                  <text x="24" y="24" textAnchor="middle" dy="0.35em" className="fill-foreground text-[10px] font-semibold" transform="rotate(90,24,24)">
                    {p.progress}%
                  </text>
                </svg>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {members.slice(0, 3).map((m) => (
                    <UserAvatar key={m.id} name={m.name} size="sm" className="ring-2 ring-card" />
                  ))}
                  {members.length > 3 && <span className="text-xs text-muted-foreground ml-2">+{members.length - 3}</span>}
                </div>
                <span className={`flex items-center gap-1 text-xs ${days < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                  <Clock className="w-3 h-3" />
                  {formatDate(p.dueDate)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">New Project</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" required />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" rows={3} />
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" required />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm border border-input hover:bg-accent transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground glow-btn">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectsPage;
