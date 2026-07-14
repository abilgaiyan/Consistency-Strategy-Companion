import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { auth, db, firebaseConfig } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Shield, Sparkles, Loader2, KeyRound, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Initialize user profile document
        await setDoc(doc(db, "users", user.uid), {
          userId: user.uid,
          email: user.email || email,
          customGeminiApiKey: "",
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Sign in
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === "auth/admin-restricted-operation" || err.message?.includes("admin-restricted-operation")) {
        setError("admin-restricted-operation");
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email address is already in use.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address format.");
      } else {
        setError(err.message || "Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      // Check if profile exists, if not initialize it
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          userId: user.uid,
          email: "Anonymous Explorer",
          customGeminiApiKey: "",
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.error("Anonymous auth error:", err);
      if (err.code === "auth/admin-restricted-operation" || err.message?.includes("admin-restricted-operation")) {
        setError("admin-restricted-operation");
      } else {
        setError(err.message || "Failed to start anonymous session.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Consistency Strategy Companion
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Build bulletproof discipline. Sync your habit blueprints across all your devices.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-slate-100 shadow-sm sm:rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                Email Address
              </label>
              <div className="mt-2.5 relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 text-sm text-slate-800 placeholder-slate-400 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                Password
              </label>
              <div className="mt-2.5 relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <KeyRound className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 text-sm text-slate-800 placeholder-slate-400 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex flex-col gap-2.5 text-xs text-rose-600 font-medium leading-normal">
                {error === "admin-restricted-operation" ? (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-rose-700">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span className="font-bold">Authentication Providers Disabled</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-sans">
                      The sign-in methods are disabled in your Firebase project. To enable them, please:
                    </p>
                    <ol className="list-decimal pl-5 space-y-1 text-slate-600 font-sans leading-relaxed">
                      <li>Go to your <a href={`https://console.firebase.google.com/project/${firebaseConfig?.projectId || "gen-lang-client-0249032212"}/authentication/providers`} target="_blank" rel="noreferrer" className="underline font-bold text-indigo-600 hover:text-indigo-700">Firebase Console</a>.</li>
                      <li>Go to the <span className="font-bold">Sign-in method</span> tab under Authentication.</li>
                      <li>Enable <span className="font-bold">Email/Password</span> and <span className="font-bold">Anonymous</span>.</li>
                      <li>Save the changes and try signing in again.</li>
                    </ol>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-indigo-50 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                )}
              </button>

              <button
                type="button"
                onClick={handleAnonymousSignIn}
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 focus:outline-hidden disabled:bg-slate-50 transition-all cursor-pointer"
              >
                <span>Try as Guest</span>
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Create one"}
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
          <span>Equipped with Gemini 3.5 Flash & Darius Foroux Framework</span>
        </div>
      </div>
    </div>
  );
}
