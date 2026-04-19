import React, { createContext, useContext, useState, useCallback } from "react";
import { MOCK_TASKS, MOCK_PROJECTS, MOCK_AUDIT_LOG, MOCK_NOTIFICATIONS, Task, Project, AuditLogEntry, Notification, TaskStatus } from "@/data/mockData";
import { useAuth } from "./AuthContext";
import { useTenant } from "./TenantContext";

interface DataContextType {
  tasks: Task[];
  projects: Project[];
  auditLog: AuditLogEntry[];
  notifications: Notification[];
  getFilteredTasks: () => Task[];
  getFilteredProjects: () => Project[];
  getFilteredAuditLog: () => AuditLogEntry[];
  getFilteredNotifications: () => Notification[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "comments">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
  addProject: (project: Omit<Project, "id" | "createdAt">) => void;
  addAuditEntry: (entry: Omit<AuditLogEntry, "id" | "timestamp">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationCount: number;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { activeTenant } = useTenant();
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOG);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const tenantId = user?.role === "super_admin" ? activeTenant?.id : user?.tenantId;

  const getFilteredTasks = useCallback(() => {
    if (!tenantId) return [];
    return tasks.filter((t) => t.tenantId === tenantId);
  }, [tasks, tenantId]);

  const getFilteredProjects = useCallback(() => {
    if (!tenantId) return [];
    return projects.filter((p) => p.tenantId === tenantId);
  }, [projects, tenantId]);

  const getFilteredAuditLog = useCallback(() => {
    if (user?.role === "super_admin" && !activeTenant) return auditLog;
    if (!tenantId) return [];
    return auditLog.filter((l) => l.tenantId === tenantId || l.tenantId === null);
  }, [auditLog, tenantId, user, activeTenant]);

  const getFilteredNotifications = useCallback(() => {
    if (!user) return [];
    return notifications.filter((n) => n.userId === user.id);
  }, [notifications, user]);

  const unreadNotificationCount = getFilteredNotifications().filter((n) => !n.read).length;

  const addTask = useCallback((task: Omit<Task, "id" | "createdAt" | "comments">) => {
    const newTask: Task = { ...task, id: `t_${Date.now()}`, createdAt: new Date().toISOString(), comments: [] };
    setTasks((prev) => [...prev, newTask]);
    addAuditEntry({ tenantId: task.tenantId, userId: user?.id ?? "", userName: user?.name ?? "", action: "CREATE", entity: "task", entityName: task.title });
  }, [user]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    const task = tasks.find((t) => t.id === id);
    if (task && user) {
      addAuditEntry({ tenantId: task.tenantId, userId: user.id, userName: user.name, action: "UPDATE", entity: "task", entityName: task.title });
    }
  }, [tasks, user]);

  const deleteTask = useCallback((id: string) => {
    const task = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (task && user) {
      addAuditEntry({ tenantId: task.tenantId, userId: user.id, userName: user.name, action: "DELETE", entity: "task", entityName: task.title });
    }
  }, [tasks, user]);

  const addProject = useCallback((project: Omit<Project, "id" | "createdAt">) => {
    const newProject: Project = { ...project, id: `p_${Date.now()}`, createdAt: new Date().toISOString() };
    setProjects((prev) => [...prev, newProject]);
    if (user) {
      addAuditEntry({ tenantId: project.tenantId, userId: user.id, userName: user.name, action: "CREATE", entity: "project", entityName: project.name });
    }
  }, [user]);

  const addAuditEntry = useCallback((entry: Omit<AuditLogEntry, "id" | "timestamp">) => {
    setAuditLog((prev) => [{ ...entry, id: `a_${Date.now()}`, timestamp: new Date().toISOString() }, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    if (!user) return;
    setNotifications((prev) => prev.map((n) => (n.userId === user.id ? { ...n, read: true } : n)));
  }, [user]);

  return (
    <DataContext.Provider
      value={{
        tasks, projects, auditLog, notifications,
        getFilteredTasks, getFilteredProjects, getFilteredAuditLog, getFilteredNotifications,
        addTask, updateTask, updateTaskStatus, deleteTask, addProject, addAuditEntry,
        markNotificationRead, markAllNotificationsRead, unreadNotificationCount,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
