import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useTenant } from "@/context/TenantContext";
import { can } from "@/utils/permissions";
import { formatDate } from "@/utils/formatters";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { MOCK_USERS } from "@/data/mockUsers";
import type { Task, TaskPriority, TaskStatus } from "@/data/mockData";

const priorityDot: Record<TaskPriority, string> = { critical: "bg-destructive", high: "bg-orange-500", medium: "bg-yellow-500", low: "bg-emerald-500" };
const statusPill: Record<TaskStatus, string> = { todo: "bg-muted text-muted-foreground", in_progress: "bg-blue-500/20 text-blue-400", in_review: "bg-purple-500/20 text-purple-400", done: "bg-emerald-500/20 text-emerald-400" };

const PER_PAGE = 10;

const TasksPage = () => {
  const { user } = useAuth();
  const { getFilteredTasks, getFilteredProjects, addTask, deleteTask } = useData();
  const { activeTenant } = useTenant();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [newProject, setNewProject] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

  const tasks = getFilteredTasks();
  const projects = getFilteredProjects();

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
      return true;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTenant) return;
    addTask({
      tenantId: activeTenant.id,
      projectId: newProject || projects[0]?.id || "",
      title: newTitle,
      description: "",
      status: "todo",
      priority: newPriority,
      assigneeId: user?.id ?? "",
      dueDate: newDueDate || new Date().toISOString().split("T")[0],
      tags: [],
    });
    setShowCreate(false);
    setNewTitle("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        {can(user, "canCreateTask") && (
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium glow-btn">
            <Plus className="w-4 h-4" /> New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search tasks..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="in_review">In Review</option>
          <option value="done">Done</option>
        </select>
        <select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Assignee</th>
                <th className="px-4 py-3 font-medium">Due Date</th>
                {can(user, "canDeleteTask") && <th className="px-4 py-3 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paged.map((t) => {
                const proj = projects.find((p) => p.id === t.projectId);
                const assignee = MOCK_USERS.find((u) => u.id === t.assigneeId);
                return (
                  <tr key={t.id} onClick={() => setSelectedTask(t)} className="border-b border-border/50 hover:bg-accent/30 cursor-pointer transition-colors">
                    <td className="px-4 py-3 font-medium">{t.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{proj?.name ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${priorityDot[t.priority]}`} />
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusPill[t.status]}`}>
                        {t.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {assignee && (
                        <div className="flex items-center gap-2">
                          <UserAvatar name={assignee.name} size="sm" />
                          <span>{assignee.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(t.dueDate)}</td>
                    {can(user, "canDeleteTask") && (
                      <td className="px-4 py-3">
                        <button onClick={(e) => { e.stopPropagation(); deleteTask(t.id); }} className="text-destructive hover:underline text-xs">Delete</button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{filtered.length} tasks</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded hover:bg-accent disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 rounded hover:bg-accent disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Task Detail Slide-over */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end bg-background/60 backdrop-blur-sm" onClick={() => setSelectedTask(null)}>
            <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} className="w-full max-w-md bg-card border-l border-border h-full overflow-y-auto p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">{selectedTask.title}</h2>
                <button onClick={() => setSelectedTask(null)}><X className="w-5 h-5" /></button>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusPill[selectedTask.status]}`}>{selectedTask.status.replace("_", " ")}</span>
                <span className="flex items-center gap-1 text-xs"><span className={`w-2 h-2 rounded-full ${priorityDot[selectedTask.priority]}`} />{selectedTask.priority}</span>
              </div>
              <p className="text-sm text-muted-foreground">{selectedTask.description || "No description provided."}</p>
              <div className="text-sm space-y-2">
                <p><span className="text-muted-foreground">Due:</span> {formatDate(selectedTask.dueDate)}</p>
                <p><span className="text-muted-foreground">Tags:</span> {selectedTask.tags.join(", ") || "None"}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">Comments</h3>
                {selectedTask.comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No comments yet.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedTask.comments.map((c) => {
                      const commenter = MOCK_USERS.find((u) => u.id === c.userId);
                      return (
                        <div key={c.id} className="p-3 rounded-lg bg-muted/30 text-sm">
                          <span className="font-medium">{commenter?.name}</span>
                          <p className="text-muted-foreground mt-1">{c.text}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
          <div className="glass-card p-6 w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">New Task</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Task title" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
              <select value={newProject} onChange={(e) => setNewProject(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as TaskPriority)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg text-sm border border-input hover:bg-accent">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground glow-btn">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TasksPage;
