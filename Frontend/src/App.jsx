import React, { useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./Components/Navbar";
import Homepage from "./Components/Homepage";
import { ProfileProvider } from "./Components/Pages/ProfileContext";
import { ThemeProvider } from "./Components/Pages/themeContext";
import Profile from "./Components/Profile";
import Jobs from "./Components/Jobs";
import AnalyticsDashboard from "./Components/AnalyticsDashboard";
import ChatGpt from "./Components/ChatGpt";
import Recommend from "./Components/Recommend";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import LeaderBoard from "./Components/LeaderBoard";

const App = () => {
  const [themeMode, setThemeMode] = useState("dark");
  const [count, setCount] = useState(0);
  const lightTheme = () => {
    setThemeMode("light");
  };
  const darkTheme = () => {
    setThemeMode("dark");
  };
  const constant = "AyanAzmi17";

  return (
    <div className="min-h-screen w-full">
      <ProfileProvider>
        <ThemeProvider
          value={{
            darkTheme,
            lightTheme,
            themeMode,
            count,
            setCount,
            constant,
          }}
        >
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#111",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.08)",
              },
            }}
          />
          <Routes>
            <Route
              path="/"
              element={
                <div className="bg-gradient-to-r from-cyan-900 to-blue-500 min-h-screen w-full">
                  <Navbar />
                  <Homepage />
                </div>
              }
            />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route
              path="/jobs/analyze/:jobId"
              element={<AnalyticsDashboard />}
            />

            {/* <Route path="/chatgpt" element={<ChatGpt />} /> */}
            <Route path="/reco" element={<Recommend />} />
            <Route path="/leaderboard" element={<LeaderBoard />} />
          </Routes>
        </ThemeProvider>
      </ProfileProvider>
    </div>
  );
};

export default App;
