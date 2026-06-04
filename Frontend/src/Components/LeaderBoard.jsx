import React, { useEffect, useState, useRef } from "react";
import api from "../lib/axios"; // ✅ replaced axios
import { useChat } from "../hooks/useChat";
import ChatDrawer from "./chat/ChatDrawer";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Wireframe, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function AwardsGeometry() {
  const meshRef = useRef(null);
  const meshRef2 = useRef(null);

  useFrame(({ clock }) => {
    if (meshRef.current && meshRef2.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
      meshRef2.current.rotation.x = clock.getElapsedTime() * -0.05;
      meshRef2.current.rotation.y = clock.getElapsedTime() * -0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
      <group position={[0, 0, -5]}>
        <mesh ref={meshRef} scale={1.5}>
          <torusGeometry args={[3, 0.4, 32, 100]} />
          <MeshTransmissionMaterial
            background={new THREE.Color("#050505")}
            color="#ffffff"
            transmission={1}
            thickness={0.1}
            roughness={0.05}
            ior={1.2}
            transparent={true}
            opacity={0.3}
          />
          <Wireframe simplify={true} stroke={"#ffffff"} thickness={0.005} dash={false} opacity={0.1} transparent />
        </mesh>

        <mesh ref={meshRef2} scale={1.2}>
          <torusGeometry args={[1.5, 0.2, 16, 100]} />
          <MeshTransmissionMaterial
            background={new THREE.Color("#050505")}
            color="#9DFF13"
            transmission={1}
            thickness={0.05}
            roughness={0.1}
            ior={1.5}
            transparent={true}
            opacity={0.8}
          />
          <Wireframe simplify={true} stroke={"#9DFF13"} thickness={0.01} dash={false} opacity={0.2} transparent />
        </mesh>
      </group>
    </Float>
  );
}

const LeaderBoard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState(null);

  const {
    messages, activeConversation, typingUsers, currentUser,
    openConversation, sendMessage, startTyping, stopTyping,
  } = useChat();

  const handleOpenChat = (candidate) => {
    const chatCandidate = {
      _id: candidate.userId,
      username: candidate.username,
      email: candidate.email,
    };
    setChatTarget(chatCandidate);
    openConversation(chatCandidate);
    setDrawerOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const toastId = toast.loading("Compiling leaderboard...");
      try {
        const res = await api.get("/api/recruiter/showData"); // ✅ no more hardcoded localhost
        const sortedData = (res.data.data || []).sort(
          (a, b) => b.matchPercentage - a.matchPercentage
        );
        setData(sortedData);
        toast.success("Leaderboard loaded", { id: toastId });
      } catch (err) {
        if (err.response?.status === 403) {
          toast.error("Candidates are not allowed to see Recruiter LeaderBoard", { id: toastId });
        } else {
          toast.error("Failed to fetch leaderboard data", { id: toastId });
        }
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-white/10 border-t-[#9DFF13] rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(157,255,19,0.5)]"></div>
        <div className="font-medium text-sm text-white/60 tracking-widest uppercase">Compiling Rankings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased relative overflow-x-hidden selection:bg-[#9DFF13]/30">

      <div className="fixed inset-0 z-0 opacity-70 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} color="#9DFF13" />
          <directionalLight position={[-10, -10, -5]} intensity={1} color="#ffffff" />
          <AwardsGeometry />
        </Canvas>
      </div>

      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_120%)] opacity-90"></div>
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#9DFF13] rounded-full filter blur-[200px] opacity-[0.03] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="max-w-[1000px] w-full mx-auto px-6 md:px-12 pt-32 pb-20 relative z-10">

          <div className="mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <div className="w-2 h-2 rounded-full bg-[#9DFF13] animate-pulse"></div>
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Live Updates</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                Talent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9DFF13] to-white">Leaderboard</span>
              </h1>
              <p className="text-sm text-white/50 font-medium max-w-lg">
                Top matched candidates ranked by AI compatibility scoring across system parameters.
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Total Candidates</p>
              <p className="text-3xl font-black text-white">{data.length < 10 ? `0${data.length}` : data.length}</p>
            </div>
          </div>

          <div className="space-y-4">
            {data.length === 0 ? (
              <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] p-12 rounded-[2rem] text-center">
                <p className="text-white/40 font-medium">No candidate data synchronized yet.</p>
              </div>
            ) : (
              data.map((item, index) => {
                const isTopThree = index < 3;
                const rankNumber = index + 1 < 10 ? `0${index + 1}` : index + 1;

                return (
                  <div
                    key={item._id}
                    className={`relative group overflow-hidden bg-white/[0.02] backdrop-blur-3xl border rounded-[1.5rem] p-5 md:p-6 transition-all duration-500 hover:-translate-y-1 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8
                      ${isTopThree
                        ? "border-[#9DFF13]/20 hover:border-[#9DFF13]/50 hover:shadow-[0_8px_32px_rgba(157,255,19,0.1)]"
                        : "border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                  >
                    {isTopThree && (
                      <div className="absolute -left-20 -top-20 w-40 h-40 bg-[#9DFF13] rounded-full filter blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    )}

                    <div className="flex-shrink-0 w-12 md:w-16">
                      <span className={`text-4xl md:text-5xl font-black italic tracking-tighter transition-colors duration-500
                        ${isTopThree ? "text-transparent [-webkit-text-stroke:1px_#9DFF13] group-hover:text-[#9DFF13]/20" : "text-white/10 group-hover:text-white/30"}`}>
                        {rankNumber}
                      </span>
                    </div>

                    <div className="flex-1 flex items-center gap-4 w-full">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-center flex-shrink-0">
                        <img
                          src={`https://ui-avatars.com/api/?name=${item.username}&background=050505&color=9DFF13&bold=true`}
                          alt={item.username}
                          className="w-full h-full rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white tracking-tight truncate flex items-center gap-2">
                          {item.username}
                          {index === 0 && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#9DFF13" stroke="#9DFF13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                          )}
                        </h3>
                        <a href={`mailto:${item.email}`}
                          className="inline-flex items-center gap-1.5 mt-1 text-xs font-medium text-white/40 hover:text-[#9DFF13] transition-colors truncate w-full"
                          title={`Send email to ${item.email}`}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                          {item.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex-1 w-full md:w-auto">
                      <p className="text-xs uppercase tracking-widest text-white/30 mb-1 font-bold">Role Match</p>
                      <p className="text-sm text-white/70 font-medium line-clamp-2 md:line-clamp-1">{item.jobTitle}</p>
                    </div>

                    <div className="flex items-center gap-6 md:gap-8 w-full md:w-auto justify-between md:justify-end border-t border-white/10 md:border-none pt-4 md:pt-0 mt-2 md:mt-0">
                      <button
                        onClick={() => handleOpenChat(item)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#9DFF13]/10 hover:bg-[#9DFF13]/20 border border-[#9DFF13]/30 hover:border-[#9DFF13]/60 rounded-full text-xs font-bold text-[#9DFF13] transition-all duration-300"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Message
                      </button>

                      {item.resumeUrl && (
                        <a href={item.resumeUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-xs font-bold text-white transition-all duration-300 group/btn">
                          View CV
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform">
                            <path d="M7 17l9.2-9.2M17 17V7H7" />
                          </svg>
                        </a>
                      )}

                      <div className="flex flex-col items-end text-right">
                        <span className={`text-2xl md:text-3xl font-black ${isTopThree ? "text-[#9DFF13]" : "text-white"}`}>
                          {item.matchPercentage}<span className="text-lg opacity-50">%</span>
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 mt-0.5">Compatibility</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <ChatDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        target={chatTarget}
        messages={messages}
        currentUser={currentUser}
        onSend={sendMessage}
        onTypingStart={startTyping}
        onTypingStop={stopTyping}
        typingUsers={typingUsers}
      />
    </div>
  );
};

export default LeaderBoard;