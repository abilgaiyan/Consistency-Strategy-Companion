import React, { useState } from "react";
import { BookOpen, Sparkles, CheckCircle, ShieldAlert, ArrowRight, Lightbulb, User, RefreshCw, Zap } from "lucide-react";

export default function StrategyGuide() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const strategies = [
    {
      id: 1,
      num: "01",
      title: "Focus on the Bigger Picture",
      subtitle: "Tricks focus on the how, but discipline requires a why.",
      description: "When your motivation is at zero, your brain will easily talk you out of small, unanchored actions. Consistency requires turning your 'shoulds' into 'musts'. You need to know exactly what you are fighting for, keeping visceral visual cues of your Big Why in your physical and digital environment.",
      example: "Instead of 'I should work out today because it is good for me', connect it to a deeper reality: 'I must work out to ensure I remain healthy, vital, and strong for my family over the next 20 years.'",
      action: "Identify your core 'Must' and place a physical cue (a photo, sticky note, or desktop widget) where you cannot ignore it.",
      icon: Lightbulb,
    },
    {
      id: 2,
      num: "02",
      title: "Use Identity Instead of Motivation",
      subtitle: "Focus on the kind of person you want to become.",
      description: "Motivation is transient, but identity is permanent. Every action you take is a vote for the type of person you wish to be. Stop relying on feeling 'inspired' to start. Act in alignment with your future identity and let the feelings follow the action.",
      example: "Instead of focusing on writing 1,000 words ('I want to write'), adopt the identity: 'I am a professional writer who shows up daily.' A writer writes.",
      action: "Formulate an identity statement: 'I am a person who...' and repeat it to yourself before starting the hard task.",
      icon: User,
    },
    {
      id: 3,
      num: "03",
      title: "Automate Your Choices",
      subtitle: "Pre-decide when, where, and how you will act.",
      description: "Decision fatigue is the silent killer of consistency. If you have to negotiate with yourself every day about whether, when, or how you will work, you will eventually lose. Automate your decisions by establishing clear conditional rules (Implementation Intentions).",
      example: "Set a firm situational trigger: 'If it is Monday at 7:00 AM, then I will immediately open my notebook at the kitchen counter.'",
      action: "Define a fixed condition for your selected habit so that starting requires zero conscious calculation.",
      icon: RefreshCw,
    },
    {
      id: 4,
      num: "04",
      title: "Reduce Friction to Zero",
      subtitle: "Make it easy to show up, and hard to fail.",
      description: "Design your environment for success. We are inherently prone to the path of least resistance. If you want to do something hard, prepare your environment the night before to make starting require absolute minimum effort. Conversely, add friction to your distractions.",
      example: "If you need to code in the morning, open your IDE and close all social tabs before sleeping. Place your laptop directly on your desk with the charger plugged in.",
      action: "List three small adjustments you can make to your physical space right now to remove start-up friction.",
      icon: Zap,
    },
    {
      id: 5,
      num: "05",
      title: "Measure Consistency, Not Intensity",
      subtitle: "Doing a small amount consistently beats massive, erratic bursts.",
      description: "When you have zero motivation, the mountain looks too steep. The secret to showing up is lowering the bar. Do the absolute smallest possible version of your habit. It keeps the neurological feedback loop intact, ensuring you do not break the chain.",
      example: "Instead of planning a grueling 2-hour workout, commit only to: 'Put on my gym shoes and step outside.' Or write just one sentence in your journal.",
      action: "Identify the absolute micro-step for your hard task—something so ridiculously small it takes under 2 minutes and is impossible to talk yourself out of.",
      icon: CheckCircle,
    },
  ];

  return (
    <div id="strategy-guide" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-semibold text-slate-900 text-lg">
              The Consistency Framework
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Five strategies from Darius Foroux to build bulletproof consistency without relying on fleeting motivation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 bg-slate-50/50 border-r border-slate-100 p-4 flex flex-col gap-1.5">
          {strategies.map((strategy, idx) => {
            const Icon = strategy.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={strategy.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-3 w-full text-left p-3 rounded-xl transition-all duration-200 font-sans group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className={`text-xs font-mono font-bold ${isActive ? "text-indigo-200" : "text-indigo-600/60"}`}>
                  {strategy.num}
                </span>
                <span className="text-sm font-medium flex-1 truncate">{strategy.title}</span>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isActive ? "translate-x-0 opacity-100" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                }`} />
              </button>
            );
          })}

          <div className="mt-auto pt-6 border-t border-slate-100/80 px-2">
            <div className="flex items-start gap-2 bg-amber-50/60 border border-amber-100/50 rounded-lg p-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[10px] text-amber-800 leading-normal font-sans">
                <strong>Rule of Thumb:</strong> Tricks create short-term novelty, but identity and structural environment adjustments create long-term consistency.
              </div>
            </div>
          </div>
        </div>

        {/* Content Panel */}
        <div className="md:col-span-8 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-4xl font-mono font-black text-indigo-50 px-2 py-0.5 bg-indigo-50/30 rounded-lg">
                {strategies[activeTab].num}
              </span>
              <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-medium font-sans">
                <Sparkles className="w-3.5 h-3.5" />
                Darius Foroux Strategy
              </div>
            </div>

            <h4 className="font-sans font-bold text-xl text-slate-900 tracking-tight">
              {strategies[activeTab].title}
            </h4>
            <p className="text-sm text-indigo-600 font-medium font-sans mt-1">
              {strategies[activeTab].subtitle}
            </p>

            <p className="text-sm text-slate-600 font-sans mt-4 leading-relaxed">
              {strategies[activeTab].description}
            </p>

            <div className="mt-5 space-y-3">
              <div className="bg-slate-50 border-l-2 border-indigo-500 rounded-r-lg p-3">
                <div className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-1">
                  Mental Shift
                </div>
                <div className="text-xs text-slate-700 font-sans italic leading-relaxed">
                  &ldquo;{strategies[activeTab].example}&rdquo;
                </div>
              </div>

              <div className="bg-emerald-50/60 border-l-2 border-emerald-500 rounded-r-lg p-3">
                <div className="text-xs font-bold text-emerald-700 font-mono uppercase tracking-wider mb-1">
                  Practical Application
                </div>
                <div className="text-xs text-emerald-950 font-sans leading-relaxed">
                  {strategies[activeTab].action}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-sans">
            <span>Consistent efforts accumulate exponentially</span>
            <span>Strategy {strategies[activeTab].id} of 5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
