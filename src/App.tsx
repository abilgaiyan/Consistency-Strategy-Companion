import React, { useState, useEffect } from "react";
import { Task, Blueprint } from "./types";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskDetail from "./components/TaskDetail";
import StrategyGuide from "./components/StrategyGuide";
import AuthScreen from "./components/AuthScreen";
import SettingsModal from "./components/SettingsModal";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import {
  Flame,
  Sparkles,
  Zap,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Target,
  Compass,
  AlertCircle,
  Settings,
  Loader2,
} from "lucide-react";

// Helper function to calculate streaks based on completed dates
function calculateStreaks(history: string[], existingMax: number): { streak: number; maxStreak: number } {
  if (history.length === 0) return { streak: 0, maxStreak: existingMax };

  // Sort history descending (newest first)
  const sortedDates = Array.from(new Set(history))
    .map((d) => {
      const parts = d.split("-").map(Number);
      return new Date(parts[0], parts[1] - 1, parts[2]); // local timezone
    })
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const firstCompleted = sortedDates[0];
  firstCompleted.setHours(0, 0, 0, 0);

  // If the newest completed date is older than yesterday, current streak is 0
  if (firstCompleted.getTime() < yesterday.getTime()) {
    return { streak: 0, maxStreak: existingMax };
  }

  let currentStreak = 1;
  let prevDate = firstCompleted;

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i];
    currentDate.setHours(0, 0, 0, 0);

    const diffTime = prevDate.getTime() - currentDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      prevDate = currentDate;
    } else if (diffDays === 0) {
      // duplicate date, ignore
      continue;
    } else {
      break; // gap found
    }
  }

  const newMax = Math.max(existingMax, currentStreak);
  return { streak: currentStreak, maxStreak: newMax };
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const yesterdayStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  })();

  const todayStr = new Date().toISOString().split("T")[0];

  // Load User, Profile, and Tasks from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        // Fetch or create user profile document in Firestore
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        let profileData = null;

        if (docSnap.exists()) {
          profileData = docSnap.data();
          setUserProfile(profileData);
        } else {
          profileData = {
            userId: user.uid,
            email: user.email || (user.isAnonymous ? "Guest Session" : ""),
            customGeminiApiKey: "",
            updatedAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, profileData);
          setUserProfile(profileData);
        }

        // Listen for real-time changes to the user's profile
        const unsubProfile = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUserProfile(doc.data());
          }
        });

        // Query real-time task list updates from Firestore
        const tasksQuery = query(collection(db, "tasks"), where("userId", "==", user.uid));
        const unsubTasks = onSnapshot(tasksQuery, (snapshot) => {
          const loadedTasks: Task[] = [];
          snapshot.forEach((doc) => {
            loadedTasks.push({ id: doc.id, ...doc.data() } as Task);
          });

          // Sort descending by createdAt
          loadedTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setTasks(loadedTasks);
          setIsLoadingAuth(false);
        }, (error) => {
          console.error("Firestore tasks listener error:", error);
          setIsLoadingAuth(false);
        });

        return () => {
          unsubProfile();
          unsubTasks();
        };
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setTasks([]);
        setSelectedTaskId(null);
        setIsLoadingAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Synchronize selectedTaskId with tasks list
  useEffect(() => {
    if (tasks.length > 0) {
      if (!selectedTaskId || !tasks.some((t) => t.id === selectedTaskId)) {
        setSelectedTaskId(tasks[0].id);
      }
    } else {
      setSelectedTaskId(null);
    }
  }, [tasks, selectedTaskId]);

  const handleCreateBlueprint = async (taskName: string, context: string) => {
    if (!currentUser) return;
    setIsGenerating(true);
    setErrorMsg("");

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (userProfile?.customGeminiApiKey) {
        headers["x-gemini-api-key"] = userProfile.customGeminiApiKey;
      }

      const res = await fetch("/api/blueprint", {
        method: "POST",
        headers,
        body: JSON.stringify({ taskName, context }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate consistency blueprint from server.");
      }

      const blueprint: Blueprint = await res.json();

      const taskId = `task-${Date.now()}`;
      const newTask: Task = {
        id: taskId,
        userId: currentUser.uid,
        name: taskName,
        context: context || undefined,
        createdAt: new Date().toISOString(),
        blueprint,
        history: [],
        streak: 0,
        maxStreak: 0,
      };

      await setDoc(doc(db, "tasks", taskId), newTask);
      setSelectedTaskId(taskId);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred during blueprint generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "tasks", taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleCompleteToday = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (task.history.includes(todayStr)) return; // already done

    const newHistory = [...task.history, todayStr];
    const { streak, maxStreak } = calculateStreaks(newHistory, task.maxStreak);

    try {
      await updateDoc(doc(db, "tasks", taskId), {
        history: newHistory,
        streak,
        maxStreak,
        lastCompletedDate: todayStr,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to update task completion:", err);
    }
  };

  const handleQuickComplete = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (task.history.includes(todayStr)) {
      // Toggle off today
      const newHistory = task.history.filter((d) => d !== todayStr);
      const { streak, maxStreak } = calculateStreaks(newHistory, task.maxStreak);
      try {
        await updateDoc(doc(db, "tasks", taskId), {
          history: newHistory,
          streak,
          maxStreak,
          lastCompletedDate: newHistory[newHistory.length - 1] || null,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Failed to untoggle task:", err);
      }
    } else {
      await handleCompleteToday(taskId);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      // Exclude 'id' field from raw payload as document ID is used as primary key
      const { id, ...dataToSave } = updatedTask;
      await setDoc(doc(db, "tasks", updatedTask.id), {
        ...dataToSave,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to update task details:", err);
    }
  };

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-500">
            Initializing your strategy workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Dynamic atmospheric header */}
      <header className="bg-white border-b border-slate-150/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-sans font-extrabold text-lg text-slate-900 tracking-tight leading-none flex items-center gap-2">
                Consistency Strategy Companion
              </h1>
              <p className="text-[11px] text-slate-500 font-sans mt-1">
                Tricks create novelty. These five strategies create consistency.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-100/60 rounded-full px-3 py-1 text-xs text-amber-800 font-medium font-sans">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Show up. Every single day.</span>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl transition-all cursor-pointer flex items-center justify-center border border-slate-150"
              title="Settings"
            >
              <Settings className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quote Hero Banner */}
        <div className="bg-indigo-950 text-slate-100 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-indigo-500/20 via-indigo-500/5 to-transparent rounded-full -mr-20 -mt-20"></div>
          <div className="relative max-w-2xl">
            <div className="text-[10px] font-mono font-bold tracking-widest text-indigo-300 uppercase mb-2">
              Darius Foroux premise
            </div>
            <p className="text-xl md:text-2xl font-sans font-bold leading-snug tracking-tight text-white">
              &ldquo;One of the biggest mistakes you can make if you want to be consistent is trying to 'trick' your brain... Tricks focus on the how, but discipline requires a why.&rdquo;
            </p>
            <p className="text-xs text-indigo-300 mt-3 font-medium">
              — Darius Foroux, Productivity Author
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-800 text-sm">Blueprint Generation Failed</h4>
              <p className="text-xs text-rose-600 mt-0.5 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & List */}
          <div className="lg:col-span-4 space-y-6">
            <TaskForm onSubmit={handleCreateBlueprint} isLoading={isGenerating} />
            <TaskList
              tasks={tasks}
              selectedTaskId={selectedTaskId}
              onSelectTask={(id) => setSelectedTaskId(id)}
              onDeleteTask={handleDeleteTask}
              onQuickComplete={handleQuickComplete}
            />
          </div>

          {/* Right Column: Dynamic Detail Panel or Welcome View */}
          <div className="lg:col-span-8">
            {selectedTask ? (
              <TaskDetail
                task={selectedTask}
                onCompleteToday={handleCompleteToday}
                onUpdateTask={handleUpdateTask}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-150 p-8 text-center font-sans shadow-sm">
                <div className="mx-auto w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 border border-indigo-100">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-sans font-extrabold text-slate-800 text-lg tracking-tight">
                  Formulate a Consistency Habit
                </h3>
                <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-normal">
                  Write down any task you currently struggle to perform consistently. Our AI engine will align it with the five principles to unlock progress.
                </p>

                <div className="mt-8 border-t border-slate-100 pt-8 text-left">
                  <StrategyGuide />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Strategy Guide reference (shown underneath if a task is active) */}
        {selectedTask && (
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-4 px-1">
              <Compass className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                Darius Foroux's Strategy Reference Guide
              </h3>
            </div>
            <StrategyGuide />
          </div>
        )}
      </main>

      {/* Modern, clean footer */}
      <footer className="bg-white border-t border-slate-100/80 py-8 mt-16 text-center text-xs text-slate-400 font-sans">
        <p>Consistency Strategy Companion • Built with React, Tailwind CSS, & Gemini AI</p>
        <p className="mt-1.5 font-medium text-slate-400/80">
          Showing up consistently is the only metric that matters.
        </p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        userProfile={userProfile}
        onProfileUpdate={(updated) => setUserProfile(updated)}
      />
    </div>
  );
}
