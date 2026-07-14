import React from "react";
import { Task } from "../types";
import { motion } from "motion/react";
import { Flame, CheckCircle2, ChevronRight, Clipboard, Trash2, CalendarCheck } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onDeleteTask: (taskId: string, e: React.MouseEvent) => void;
  onQuickComplete: (taskId: string, e: React.MouseEvent) => void;
}

export default function TaskList({
  tasks,
  selectedTaskId,
  onSelectTask,
  onDeleteTask,
  onQuickComplete,
}: TaskListProps) {
  const todayStr = new Date().toISOString().split("T")[0];

  const hasCompletedToday = (task: Task) => {
    return task.history.includes(todayStr);
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center font-sans">
        <div className="mx-auto w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
          <Clipboard className="w-5 h-5" />
        </div>
        <h4 className="font-semibold text-slate-800 text-sm">No tasks added yet</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-[220px] mx-auto leading-normal">
          Formulate a hard task using the form above to unlock your first custom Consistency Blueprint!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-sans">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-2 px-1">
        Your Ongoing Journeys ({tasks.length})
      </h3>

      <div className="space-y-2.5">
        {tasks.map((task) => {
          const isSelected = selectedTaskId === task.id;
          const completedToday = hasCompletedToday(task);

          return (
            <motion.div
              layoutId={`task-card-${task.id}`}
              key={task.id}
              className={`group relative rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                isSelected
                  ? "bg-indigo-50/40 border-indigo-200 shadow-sm"
                  : "bg-white border-slate-100 hover:border-slate-250 shadow-xs hover:shadow-sm"
              }`}
              onClick={() => onSelectTask(task.id)}
            >
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  {/* Circular Complete Checkbox */}
                  <button
                    onClick={(e) => onQuickComplete(task.id, e)}
                    title={completedToday ? "Completed today!" : "Mark as consistent for today"}
                    className={`mt-0.5 w-6 h-6 rounded-full shrink-0 flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                      completedToday
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50"
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${completedToday ? "opacity-100 scale-100" : "opacity-0 scale-75 group-hover:opacity-40"}`} />
                  </button>

                  <div className="min-w-0">
                    <h4 className={`text-sm font-bold truncate leading-tight ${
                      completedToday ? "text-slate-500 line-through font-medium" : "text-slate-800"
                    }`}>
                      {task.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs font-semibold text-slate-400 font-sans">
                        <Flame className={`w-3.5 h-3.5 ${task.streak > 0 ? "text-amber-500 fill-amber-500" : "text-slate-300"}`} />
                        <span className={task.streak > 0 ? "text-amber-600 font-bold" : "text-slate-400"}>
                          {task.streak}d streak
                        </span>
                      </span>

                      {completedToday && (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CalendarCheck className="w-3 h-3" />
                          Done today
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => onDeleteTask(task.id, e)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isSelected ? "translate-x-0.5 text-indigo-500" : "group-hover:translate-x-0.5"
                  }`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
