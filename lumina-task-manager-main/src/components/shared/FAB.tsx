import { useState } from "react";
import { Plus, ListTodo, FolderKanban, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { can } from "@/utils/permissions";
import { useAuth } from "@/context/AuthContext";

export const FAB = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const actions = [
    { label: "New Task", icon: ListTodo, path: "/tasks", permission: "canCreateTask" as const },
    { label: "New Project", icon: FolderKanban, path: "/projects", permission: "canCreateProject" as const },
  ].filter((a) => can(user, a.permission));

  if (actions.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center glow-btn transition-transform hover:scale-105"
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }}>
          {open ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </motion.div>
      </button>
      <AnimatePresence>
        {open && actions.map((a, i) => (
          <motion.button
            key={a.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => { navigate(a.path); setOpen(false); }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground shadow-lg text-sm font-medium hover:bg-accent transition-colors"
          >
            <a.icon className="w-4 h-4" /> {a.label}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
};
