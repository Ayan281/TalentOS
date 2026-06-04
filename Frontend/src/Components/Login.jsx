import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import api from "../lib/axios"; // ✅ replaced axios with global instance

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [nameoremail, setNameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  function submitHandler(e) {
    e.preventDefault();

    const toastId = toast.loading("Logging in...");

    api
      .post("/api/auth/login", {  // ✅ no more hardcoded localhost
        username: nameoremail,
        email: nameoremail,
        password,
      })
      .then((res) => {
        login(res.data.user);

        toast.success("Logged in successfully", { id: toastId });

        const user = res.data.user.role;

        if (user === "admin") {
          navigate("/leaderboard");
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Login failed",
          { id: toastId }
        );
        console.log(err);
      });
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased relative overflow-hidden selection:bg-[#9DFF13]/30">
      <Navbar />

      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#9DFF13] rounded-full filter blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ffffff] rounded-full filter blur-[150px] opacity-5 pointer-events-none"></div>

      {/* Smooth Vignette Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_100%)] opacity-80"></div>

      {/* Main Content Area */}
      <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-24 mt-4">

        {/* Premium Glassmorphic Card */}
        <div className="w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative rounded-[2rem] group">

          {/* Header */}
          <div className="mb-8 text-center relative z-20">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 mb-6 shadow-lg">
              <span className="font-black text-2xl text-[#9DFF13]">C</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">
              Welcome back
            </h1>
            <p className="text-white/50 text-sm font-medium leading-relaxed">
              Log in to access your CampusOS dashboard and continue your journey.
            </p>
          </div>

          {/* OAuth Controls */}
          <div className="space-y-3 mb-8 relative z-20">
            <button className="w-full flex items-center justify-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 text-sm font-semibold text-white/80 hover:bg-white/[0.06] hover:text-white hover:border-white/20 transition-all duration-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 text-sm font-semibold text-white/80 hover:bg-white/[0.06] hover:text-white hover:border-white/20 transition-all duration-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8 relative z-20">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="text-xs text-white/40 font-medium px-2">or log in with email</span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          {/* Manual Auth Form */}
          <form onSubmit={submitHandler} className="space-y-5 relative z-20">

            <div className="group relative">
              <label className="text-xs font-semibold text-white/60 mb-2 block group-focus-within:text-[#9DFF13] transition-colors">
                Username or Email
              </label>
              <input
                type="text"
                onChange={(e) => setNameOrEmail(e.target.value)}
                placeholder="Enter your username or email"
                required
                className="w-full bg-[#000000]/40 border border-white/[0.08] px-4 py-3.5 focus:outline-none focus:border-[#9DFF13]/50 focus:ring-1 focus:ring-[#9DFF13]/50 transition-all text-sm text-white rounded-xl placeholder-white/20"
              />
            </div>

            <div className="group relative">
              <div className="flex justify-between items-end mb-2">
                <label className="text-xs font-semibold text-white/60 block group-focus-within:text-[#9DFF13] transition-colors">
                  Password
                </label>
                <Link to="#" className="text-xs font-medium text-white/40 hover:text-[#9DFF13] transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#000000]/40 border border-white/[0.08] px-4 py-3.5 focus:outline-none focus:border-[#9DFF13]/50 focus:ring-1 focus:ring-[#9DFF13]/50 transition-all text-sm text-white rounded-xl placeholder-white/20"
              />
            </div>

            <button
              type="submit"
              className="group relative w-full px-8 py-4 bg-[#9DFF13] text-[#050505] font-bold text-sm hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 rounded-xl mt-8 shadow-[0_0_20px_rgba(157,255,19,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:-translate-y-0.5"
            >
              <span>Log In</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </form>

          {/* Footer Routing */}
          <div className="text-center mt-8 relative z-20">
            <p className="text-sm font-medium text-white/50 flex flex-col sm:flex-row items-center justify-center gap-1.5">
              <span>Don't have an account?</span>
              <Link
                to="/signup"
                className="text-[#9DFF13] hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;