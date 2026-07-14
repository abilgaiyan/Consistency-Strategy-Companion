import React, { useState, useEffect } from "react";
import { Task } from "../types";
import StreakHeatmap from "./StreakHeatmap";
import {
  Sparkles,
  Shield,
  Lightbulb,
  CheckSquare,
  Smile,
  Zap,
  CheckCircle,
  HelpCircle,
  UserCheck,
  ZapOff,
  Flame,
  Volume2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TaskDetailProps {
  task: Task;
  onCompleteToday: (taskId: string) => void;
  onUpdateTask: (updatedTask: Task) => void;
}

export default function TaskDetail({ task, onCompleteToday, onUpdateTask }: TaskDetailProps) {
  const [preparedFriction, setPreparedFriction] = useState<boolean[]>([false, false, false]);
  const [recitedIdentity, setRecitedIdentity] = useState(false);
  const [showCelebration, setShowCompletedCelebration] = useState(false);
  const [celebrationQuote, setCelebrationQuote] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];
  const isCompletedToday = task.history.includes(todayStr);

  const quotes = [
    "Consistency isn't about being perfect; it's about showing up when you have zero motivation.",
    "Every smallest step is a vote for the person you wish to become.",
    "Do not break the chain. Lower the bar so low that failing is impossible.",
    "Amateurs wait for motivation. Professionals build systems and automate choices.",
    "Reduce the friction to start. The hardest part of any task is the first 2 minutes.",
  ];

  useEffect(() => {
    // Reset temporary states on task switch
    setPreparedFriction([false, false, false]);
    setRecitedIdentity(false);
    setShowCompletedCelebration(false);
  }, [task.id]);

  const handleToggleFriction = (idx: number) => {
    const updated = [...preparedFriction];
    updated[idx] = !updated[idx];
    setPreparedFriction(updated);
  };

  const handleComplete = () => {
    if (isCompletedToday) return;

    // Pick a random encouraging quote
    const randQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCelebrationQuote(randQuote);
    setShowCompletedCelebration(true);

    onCompleteToday(task.id);
  };

  const speakCoachMessage = () => {
    if (!task.blueprint?.coachMessage) return;
    const utterance = new SpeechSynthesisUtterance(task.blueprint.coachMessage);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const bp = task.blueprint;

  if (!bp) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center font-sans">
        <div className="mx-auto w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 mb-3 border border-indigo-100">
          <Sparkles className="w-5 h-5 animate-spin" />
        </div>
        <h4 className="font-semibold text-slate-800 text-sm">Blueprint is being constructed</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-[260px] mx-auto leading-normal">
          AI is aligning the 5 strategies of consistency with your goal. Hold on just a second!
        </p>
      </div>
    );
  }

  const allPrepared = preparedFriction.every((v) => v);

  return (
    <div className="space-y-6 font-sans">
      {/* Header section with Streak stats */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-5 mb-5">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
              Active Strategy Blueprint
            </span>
            <h2 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight mt-2">
              {task.name}
            </h2>
            {task.context && (
              <p className="text-xs text-slate-400 font-sans mt-1.5 leading-normal max-w-xl">
                Context: &ldquo;{task.context}&rdquo;
              </p>
            )}
          </div>

          <div className="shrink-0 flex items-center">
            {isCompletedToday ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                <div>
                  <div className="text-xs font-bold text-emerald-800 font-sans leading-none">
                    Consistent Today!
                  </div>
                  <div className="text-[10px] text-emerald-600 font-sans mt-0.5">
                    Step complete, streak safe.
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleComplete}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-sans font-bold text-sm px-5 py-3 rounded-xl shadow-md shadow-emerald-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4 text-white" />
                <span>Establish Consistency Today</span>
              </button>
            )}
          </div>
        </div>

        {/* Embedded Consistency Streak Heatmap */}
        <StreakHeatmap history={task.history} streak={task.streak} maxStreak={task.maxStreak} />
      </div>

      {/* Main Grid: Left column (Strategies), Right column (Coach Message & Preparation) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - The 5 Strategy Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          {/* Strategy 1: Big Why */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-white relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full -mr-8 -mt-8"></div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-300 uppercase tracking-widest mb-3">
              <span className="px-1.5 py-0.5 bg-indigo-500/20 rounded">01</span>
              <span>The Big Why / Bigger Picture</span>
            </div>
            <h3 className="font-sans font-semibold text-xs text-slate-400 leading-normal uppercase font-mono mb-2">
              Transforming a should into a must
            </h3>
            <p className="text-lg font-sans font-medium tracking-tight italic leading-relaxed text-indigo-50">
              &ldquo;{bp.bigWhy}&rdquo;
            </p>
            <div className="mt-4 text-[10px] text-slate-400 font-sans flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span><strong>Darius says:</strong> If your reason for working is small, your brain will easily talk you out of it.</span>
            </div>
          </div>

          {/* Strategy 2: Identity Shifting Statement */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-3.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">
                <span className="px-1.5 py-0.5 bg-indigo-50 rounded">02</span>
                <span>Identity Alignment</span>
              </div>
              <span className="text-[10px] text-slate-400 font-sans">Vote for your future self</span>
            </div>

            <div className={`p-4 rounded-xl transition-all duration-300 border flex items-center justify-between gap-4 ${
              recitedIdentity
                ? "bg-indigo-50/30 border-indigo-100"
                : "bg-slate-50 border-slate-100 hover:border-indigo-100/50"
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                  recitedIdentity ? "bg-indigo-100 text-indigo-700" : "bg-white text-slate-400 border border-slate-100"
                }`}>
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
                    Adopt the Identity
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mt-1 leading-snug">
                    {bp.identityStatement}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setRecitedIdentity(!recitedIdentity)}
                className={`text-xs font-sans font-bold px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
                  recitedIdentity
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                    : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {recitedIdentity ? "Recited ✓" : "Recite to Self"}
              </button>
            </div>
          </div>

          {/* Strategy 3: Automate Your Choices */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-3.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">
                <span className="px-1.5 py-0.5 bg-indigo-50 rounded">03</span>
                <span>Automated Choice Trigger</span>
              </div>
              <span className="text-[10px] text-slate-400 font-sans">Eliminate Decision Fatigue</span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">
                Firm Condition (Trigger &gt; Action)
              </div>
              <p className="text-sm font-medium text-slate-700 leading-relaxed font-sans italic">
                {bp.automationRule}
              </p>
            </div>
          </div>

          {/* Strategy 5: Smallest Possible Step (The Core Action) */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full -mr-8 -mt-8"></div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">
                <span className="px-1.5 py-0.5 bg-emerald-100 rounded">05</span>
                <span>The Smallest Possible Step</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded-full font-sans">
                Too micro to fail
              </span>
            </div>

            <h3 className="font-sans font-extrabold text-lg text-emerald-950 leading-tight">
              {bp.smallestStep}
            </h3>
            <p className="text-xs text-emerald-800/80 font-sans mt-2 leading-relaxed">
              When motivation is dead, the rule is to reduce the bar to 0. Do not write a paper; write one sentence. Do not run 5 miles; put on your running shoes. Once you take this step, momentum takes over.
            </p>

            <div className="mt-5 pt-4 border-t border-emerald-100/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-emerald-700 font-semibold font-sans">
                Ready to take this micro-step right now?
              </span>

              {isCompletedToday ? (
                <div className="bg-emerald-500 text-white text-xs font-bold font-sans py-2.5 px-4 rounded-lg flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Completed for Today!</span>
                </div>
              ) : (
                <button
                  onClick={handleComplete}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs py-2.5 px-5 rounded-lg transition-colors cursor-pointer shadow-sm hover:shadow-md"
                >
                  Confirm Micro-Step Taken
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Coach Advice & Friction Preparation */}
        <div className="lg:col-span-4 space-y-6">
          {/* Strategy 4: Environment Friction Preparation */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest mb-3.5">
              <span className="px-1.5 py-0.5 bg-indigo-50 rounded">04</span>
              <span>Friction Reducers</span>
            </div>

            <h4 className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider mb-2">
              Prep your environment
            </h4>
            <p className="text-xs text-slate-400 font-sans mb-4 leading-normal">
              Make starting effortless. Prepare these three setup actions in your physical or digital space:
            </p>

            <div className="space-y-2.5">
              {bp.frictionReducers.map((reducer, idx) => {
                const checked = preparedFriction[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleFriction(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      checked
                        ? "bg-slate-50/50 border-slate-200 text-slate-500"
                        : "bg-white border-slate-100 hover:border-slate-200 text-slate-800"
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                      checked ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300"
                    }`}>
                      {checked && <CheckCircle className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                    </div>
                    <span className={`text-xs font-medium leading-relaxed font-sans ${checked ? "line-through" : ""}`}>
                      {reducer}
                    </span>
                  </button>
                );
              })}
            </div>

            {allPrepared && (
              <div className="mt-4 p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-2 animate-bounce">
                <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-[10px] font-bold text-indigo-800 font-sans uppercase tracking-wide">
                  Environment optimized! No friction.
                </span>
              </div>
            )}
          </div>

          {/* Coach Message Card */}
          <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100/50 p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                <h4 className="text-xs font-bold text-indigo-800 font-mono uppercase tracking-wider">
                  Consistency Coach
                </h4>
              </div>

              <button
                onClick={speakCoachMessage}
                title="Speak advice out loud"
                className="p-1.5 text-indigo-500 hover:text-indigo-700 bg-white border border-indigo-100 rounded-lg hover:shadow-xs transition-all shrink-0 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-indigo-950 font-sans italic leading-relaxed">
              &ldquo;{bp.coachMessage}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Celebration Modal / Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl max-w-md w-full p-6 text-center font-sans overflow-hidden relative"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-emerald-500"></div>

              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-emerald-500 mb-4 border border-emerald-100 mt-2">
                <CheckCircle className="w-6 h-6 fill-emerald-100 text-emerald-600" />
              </div>

              <h3 className="font-sans font-extrabold text-slate-800 text-xl tracking-tight">
                Consistency Locked In!
              </h3>
              <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-normal">
                You successfully completed the step today. Remember: showing up is the only rule. Every small step builds momentum.
              </p>

              <div className="my-5 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">
                  Daily Reinforcement
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed font-sans">
                  &ldquo;{celebrationQuote}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 bg-amber-50/60 border border-amber-100/50 rounded-xl p-3.5 mb-5 max-w-[240px] mx-auto">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                <div className="text-left">
                  <div className="text-[10px] font-bold text-amber-700 font-mono uppercase leading-none">
                    Habit Streak
                  </div>
                  <div className="text-sm font-extrabold text-slate-800 leading-none mt-1">
                    {task.streak} {task.streak === 1 ? "day" : "days"} consistent
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowCompletedCelebration(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-semibold text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                Keep the Chain Going
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
