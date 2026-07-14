import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import {
  X,
  Key,
  Eye,
  EyeOff,
  LogOut,
  Save,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  User,
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  userProfile: any;
  onProfileUpdate: (updatedProfile: any) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  currentUser,
  userProfile,
  onProfileUpdate,
}: SettingsModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (userProfile?.customGeminiApiKey) {
      setApiKey(userProfile.customGeminiApiKey);
    } else {
      setApiKey("");
    }
    setSaveStatus("idle");
    setErrorMessage("");
  }, [userProfile, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus("idle");
    setErrorMessage("");

    try {
      if (!currentUser?.uid) throw new Error("No authenticated user session found.");

      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        customGeminiApiKey: apiKey.trim(),
        updatedAt: new Date().toISOString(),
      });

      onProfileUpdate({
        ...userProfile,
        customGeminiApiKey: apiKey.trim(),
      });
      setSaveStatus("success");
    } catch (err: any) {
      console.error("Failed to save settings:", err);
      setSaveStatus("error");
      setErrorMessage(err.message || "Failed to save settings. Please verify Firestore rules.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl max-w-lg w-full overflow-hidden relative">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-slate-900 text-lg">
                Companion Settings
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Configure custom AI preferences and manage your session.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* User Account Info */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-white border border-slate-100 text-slate-500 rounded-xl shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                  Active Account
                </div>
                <div className="text-sm font-bold text-slate-700 truncate mt-0.5">
                  {currentUser?.isAnonymous ? "Guest Session" : currentUser?.email}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 border border-rose-100 hover:bg-rose-50/50 rounded-xl px-3.5 py-2 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Custom API Key Section */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Custom Gemini API Key
            </label>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Provide your personal Gemini API key. If left blank, the system will use the default server key. Your key is stored securely in Firestore and never shared.
            </p>

            <div className="relative rounded-xl shadow-xs">
              <input
                type={showKey ? "text" : "password"}
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isSaving}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-4 pr-11 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-start gap-2 bg-indigo-50/60 border border-indigo-100/50 rounded-xl p-3">
              <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-[10px] text-indigo-900 leading-relaxed font-sans">
                You can get a free Gemini API key from the Google AI Studio console at{" "}
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold underline text-indigo-700 hover:text-indigo-800"
                >
                  aistudio.google.com
                </a>
                .
              </div>
            </div>
          </div>

          {/* Feedback states */}
          {saveStatus === "success" && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2.5 text-xs text-emerald-700 font-medium font-sans">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Settings saved successfully! Future blueprints will use your key.</span>
            </div>
          )}

          {saveStatus === "error" && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2.5 text-xs text-rose-600 font-medium font-sans">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="truncate">{errorMessage}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-sans font-semibold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-100"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
