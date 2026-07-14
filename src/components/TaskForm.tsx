import React, { useState } from "react";
import { Sparkles, PlusCircle, HelpCircle, Loader2 } from "lucide-react";

interface TaskFormProps {
  onSubmit: (taskName: string, context: string) => Promise<void>;
  isLoading: boolean;
}

export default function TaskForm({ onSubmit, isLoading }: TaskFormProps) {
  const [taskName, setTaskName] = useState("");
  const [context, setContext] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!taskName.trim()) {
      setError("Please specify the hard thing you are trying to tackle.");
      return;
    }

    try {
      await onSubmit(taskName.trim(), context.trim());
      setTaskName("");
      setContext("");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  const handleQuickSelect = (exampleName: string, exampleContext: string) => {
    setTaskName(exampleName);
    setContext(exampleContext);
  };

  const examples = [
    {
      name: "Go to the gym after a 10-hour work shift",
      context: "I feel completely exhausted at 6 PM and my couch is too tempting.",
    },
    {
      name: "Write the first chapter of my thesis proposal",
      context: "I have a severe blank-page syndrome and feel anxious about writing poorly.",
    },
    {
      name: "Declutter and organize the massive garage storage",
      context: "It has been piled with old boxes for 3 years. It looks so overwhelming I don't know where to start.",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 font-sans">
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
          <Sparkles className="w-5 h-5 text-indigo-600 fill-indigo-100 animate-pulse" />
        </div>
        <div>
          <h3 className="font-sans font-bold text-slate-800 text-lg">
            What is the hard thing you are putting off?
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-normal">
            Enter the exact action you are struggling to do. Gemini AI will break it down into an actionable, consistency-driven blueprint based on Darius Foroux's proven strategies.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="taskName" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
            The Hard Thing *
          </label>
          <input
            id="taskName"
            type="text"
            placeholder="e.g., Code my web portfolio, clean the garage, do taxes"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            disabled={isLoading}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-sans"
          />
        </div>

        <div>
          <label htmlFor="context" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
            <span>Why is it hard? (Optional Context)</span>
            <span className="text-[10px] text-slate-400 font-normal italic">Helps AI customize strategies</span>
          </label>
          <textarea
            id="context"
            rows={3}
            placeholder="e.g., I'm incredibly tired when I get home, I feel overwhelmed by how big the task is, I'm scared of failing..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            disabled={isLoading}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-sans resize-none"
          />
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-600 font-sans font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-sans font-semibold text-sm py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md shadow-indigo-100 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing & Crafting Blueprint...</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              <span>Generate Consistency Blueprint</span>
            </>
          )}
        </button>
      </form>

      {!isLoading && (
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-400 font-sans">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Need an example? Click to load:</span>
          </div>
          <div className="space-y-2">
            {examples.map((ex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickSelect(ex.name, ex.context)}
                className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all text-xs font-sans group"
              >
                <div className="font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                  {ex.name}
                </div>
                <div className="text-slate-400 mt-1 font-normal line-clamp-1">{ex.context}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
