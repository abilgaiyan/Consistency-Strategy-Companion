# Consistency Strategy Companion 🎯

A high-fidelity, psychology-backed web application designed to help you build bulletproof discipline and maintain daily consistency. Inspired by the performance psychology frameworks of **Darius Foroux** and the habit formation principles of **James Clear (Atomic Habits)**, this tool leverages Gemini 3.5 Flash to construct custom, friction-reducing consistency blueprints.

---

## 🌟 What This App Is For

Most people fail to stick to their habits because they rely on fleeting motivation or set their starting bars too high. 

The **Consistency Strategy Companion** replaces raw willpower with **engineered systems**. Instead of just listing what you want to do, the app uses AI to analyze why you find a specific task hard, and then generates an actionable, psychological plan to make starting automatic.

---

## 🚀 How It Is Useful & Core Features

### 1. Psychology-Backed AI Blueprints 🧠
When you enter a task you struggle with, our AI agent generates a structured five-part strategy:
*   **The Big Why**: A deep, emotionally resonant purpose behind the task to keep you anchored.
*   **The Identity Statement**: Shifting your mindset from *what you do* to *who you are* (e.g., *"I am a writer who writes daily"* instead of *"I want to write"*).
*   **The Automation Rule**: A clear, situational "If-Then" trigger (e.g., *"If it is 9:00 AM, then I will open my editor"*).
*   **Friction Reducers**: Actionable steps to clear physical and digital clutter before you begin.
*   **The Smallest Step**: An ridiculously simple micro-habit to bypass mental friction (e.g., *"Write one sentence"*).
*   **A Hard-Hitting Coach Message**: Blunt, direct motivation to stop self-negotiation.

### 2. Live Habit Tracking & Streaks ⚡
*   **Streak Heatmap**: A visual contribution grid showing exactly which days you showed up.
*   **Active Streaks**: Real-time counter of consecutive active days and your all-time high score.
*   **Quick Toggle**: Instantly mark tasks as completed for today directly from your dashboard.

### 3. Secured Cross-Device Syncing ☁️
Built with a full-stack architecture powered by **Firebase Authentication** and **Cloud Firestore**, your progress is synced in real-time across your phone, tablet, and computer. Choose to explore instantly as a Guest or create a secure email account.

### 4. Custom API Key Configuration 🔑
To ensure unlimited blueprint generations, you can optionally supply your own **Gemini API Key** in the settings panel. Your key is stored securely in Firestore and never exposed to other clients.

---

## 🛠️ Setting Up Firebase

If you see an error saying `auth/admin-restricted-operation` when trying to sign in or register:
1. Go to your [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **Authentication** under the Build menu.
3. Click on the **Sign-in method** tab.
4. Enable **Email/Password** and **Anonymous** providers.
5. Save changes and return to the application!

---

*“Amateurs wait for motivation. Professionals build systems. Show up. Every single day.”*
