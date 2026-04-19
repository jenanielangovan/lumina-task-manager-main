import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useData } from "@/context/DataContext";
import type { Task } from "@/data/mockData";

const priorityColor: Record<string, string> = { critical: "bg-destructive/80", high: "bg-orange-500/80", medium: "bg-yellow-500/80", low: "bg-emerald-500/80" };
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarPage = () => {
  const { getFilteredTasks } = useData();
  const tasks = getFilteredTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((t) => {
      const key = t.dueDate;
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks]);

  const days = useMemo(() => {
    const arr: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let i = 1; i <= daysInMonth; i++) arr.push(i);
    return arr;
  }, [firstDay, daysInMonth]);

  const prev = () => setCurrentDate(new Date(year, month - 1));
  const next = () => setCurrentDate(new Date(year, month + 1));

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const selectedTasks = selectedDay ? (tasksByDate[selectedDay] ?? []) : [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <h1 className="text-2xl font-bold">Calendar</h1>
      <div className="flex gap-6">
        <div className="flex-1 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prev} className="p-1.5 rounded hover:bg-accent"><ChevronLeft className="w-4 h-4" /></button>
            <h2 className="font-semibold">{monthName}</h2>
            <button onClick={next} className="p-1.5 rounded hover:bg-accent"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
            {DAYS.map((d) => <div key={d} className="py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              if (day === null) return <div key={i} />;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayTasks = tasksByDate[dateStr] ?? [];
              const isToday = new Date().toISOString().startsWith(dateStr);
              const isSelected = selectedDay === dateStr;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(dateStr)}
                  className={`aspect-square rounded-lg text-sm flex flex-col items-center justify-start pt-1 gap-0.5 transition-colors ${
                    isSelected ? "bg-primary/20 ring-1 ring-primary" : isToday ? "bg-accent" : "hover:bg-accent/50"
                  }`}
                >
                  <span className={isToday ? "font-bold text-primary" : ""}>{day}</span>
                  <div className="flex gap-0.5">
                    {dayTasks.slice(0, 3).map((t) => (
                      <div key={t.id} className={`w-1.5 h-1.5 rounded-full ${priorityColor[t.priority]}`} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-72 glass-card p-5 shrink-0 hidden lg:block">
          <h3 className="text-sm font-semibold mb-3">
            {selectedDay ? new Date(selectedDay + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "Select a day"}
          </h3>
          {selectedTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks for this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map((t) => (
                <div key={t.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 text-sm">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${priorityColor[t.priority]}`} />
                  <span className="truncate">{t.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarPage;
