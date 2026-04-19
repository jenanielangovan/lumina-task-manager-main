import { useState } from "react";
import { motion } from "framer-motion";
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, MessageSquare } from "lucide-react";
import { useData } from "@/context/DataContext";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { MOCK_USERS } from "@/data/mockUsers";
import { formatDate } from "@/utils/formatters";
import type { Task, TaskStatus } from "@/data/mockData";

const columns: { id: TaskStatus; label: string }[] = [
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "in_review", label: "In Review" },
  { id: "done", label: "Done" },
];

const priorityBar: Record<string, string> = { critical: "bg-destructive", high: "bg-orange-500", medium: "bg-yellow-500", low: "bg-emerald-500" };

const SortableCard = ({ task }: { task: Task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const assignee = MOCK_USERS.find((u) => u.id === task.assigneeId);

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className="glass-card p-3 cursor-grab active:cursor-grabbing flex gap-2 hover:border-primary/30 transition-colors"
    >
      <div className={`w-1 rounded-full shrink-0 ${priorityBar[task.priority]}`} />
      <div className="flex-1 min-w-0 space-y-2">
        <p className="text-sm font-medium">{task.title}</p>
        <div className="flex items-center justify-between">
          {assignee && <UserAvatar name={assignee.name} size="sm" />}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {task.comments.length > 0 && (
              <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" />{task.comments.length}</span>
            )}
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const KanbanPage = () => {
  const { getFilteredTasks, updateTaskStatus } = useData();
  const tasks = getFilteredTasks();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    const targetColumn = columns.find((c) => c.id === overId);
    if (targetColumn) {
      updateTaskStatus(taskId, targetColumn.id);
      return;
    }

    // Check if dropped on another task — move to that task's column
    const targetTask = tasks.find((t) => t.id === overId);
    if (targetTask) {
      updateTaskStatus(taskId, targetTask.status);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <h1 className="text-2xl font-bold">Kanban Board</h1>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{col.label}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{colTasks.length}</span>
                </div>
                <SortableContext items={[col.id, ...colTasks.map((t) => t.id)]} strategy={verticalListSortingStrategy}>
                  <div id={col.id} className="space-y-2 min-h-[200px] p-2 rounded-lg bg-muted/20">
                    {colTasks.map((t) => (
                      <SortableCard key={t.id} task={t} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>
      </DndContext>
    </motion.div>
  );
};

export default KanbanPage;
