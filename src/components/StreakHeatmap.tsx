import React from "react";
import { Award, Calendar, Flame, TrendingUp } from "lucide-react";

interface StreakHeatmapProps {
  history: string[];
  streak: number;
  maxStreak: number;
}

export default function StreakHeatmap({ history, streak, maxStreak }: StreakHeatmapProps) {
  // Generate the last 30 days leading up to today
  const last30Days = Array.from({ length: 30 }, (_, index) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - index));
    return d.toISOString().split("T")[0];
  });

  const isCompleted = (dateStr: string) => history.includes(dateStr);

  return (
    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-xl border border-slate-100 p-3.5 flex items-center gap-3 shadow-xs">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Current Streak
            </div>
            <div className="text-xl font-bold text-slate-800 leading-none mt-1">
              {streak} {streak === 1 ? "day" : "days"}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-3.5 flex items-center gap-3 shadow-xs">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Longest Streak
            </div>
            <div className="text-xl font-bold text-slate-800 leading-none mt-1">
              {maxStreak} {maxStreak === 1 ? "day" : "days"}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-3.5 flex items-center gap-3 shadow-xs">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Consistency Rate
            </div>
            <div className="text-xl font-bold text-slate-800 leading-none mt-1">
              {last30Days.length > 0
                ? Math.round((last30Days.filter(isCompleted).length / 30) * 100)
                : 0}
              % <span className="text-xs text-slate-400 font-normal">/30d</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            30-Day Consistency Heatmap
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            Today is {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl">
          <div className="grid grid-flow-col grid-rows-5 gap-1.5 auto-cols-max">
            {last30Days.map((dateStr) => {
              const active = isCompleted(dateStr);
              const dateObj = new Date(dateStr);
              const dateLabel = dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={dateStr}
                  title={`${dateLabel}: ${active ? "Consistent!" : "No Action"}`}
                  className={`w-4 h-4 rounded-sm transition-all duration-300 relative group cursor-pointer ${
                    active
                      ? "bg-emerald-500 hover:bg-emerald-600 scale-105 shadow-sm shadow-emerald-100"
                      : "bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  {/* Subtle Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-900 text-white text-[10px] font-sans font-medium px-2 py-1 rounded shadow-md whitespace-nowrap z-30">
                    {dateLabel}: {active ? "✓ Completed Step" : "No record"}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-1.5 text-[10px] text-slate-400 font-sans border-l border-slate-100 pl-4 shrink-0 mt-3 sm:mt-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span>
              <span>Consistent Days ({history.length} completed)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-slate-100 border border-slate-200 rounded-sm"></span>
              <span>Rest/Missed Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
