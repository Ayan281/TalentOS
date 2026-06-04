import React, { useMemo, useEffect, useState, useContext, useRef } from "react";
import api from "../lib/axios"; // ✅ replaced axios
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { ProfileContext } from "./Pages/ProfileContext";
import Recommend from "./Recommend";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Wireframe, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function DataNodeGeometry() {
  const meshRef = useRef(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.02;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={[4, 0, -8]} scale={3}>
        <icosahedronGeometry args={[2, 1]} />
        <MeshTransmissionMaterial
          background={new THREE.Color("#050505")}
          color="#9DFF13"
          transmission={1}
          thickness={0.05}
          roughness={0.05}
          ior={1.2}
          transparent={true}
          opacity={0.6}
        />
        <Wireframe simplify={true} stroke={"#9DFF13"} thickness={0.01} dash={false} opacity={0.15} transparent />
      </mesh>
    </Float>
  );
}

const techKeywords = [
  "javascript", "react", "tailwind", "tailwind css", "node", "python", "java", "spring", "springboot", "angular", "microservices", "sql", "mongodb", "html", "css", "git", "docker", "aws", "rest", "api", "react js", "express js", "django", "flask", "ruby on rails", "c#", ".net", "kubernetes", "graphql", "typescript", "vue", "next js", "redis", "postgresql", "mysql", "firebase", "azure",
];

const formatDate = (dateString) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const calculateAnalytics = (jobDescription, userSkills) => {
  if (!jobDescription) return null;
  const jobDesc = jobDescription.toLowerCase();
  const jobTechSkills = techKeywords.filter((skill) => jobDesc.includes(skill.toLowerCase()));
  const normalizedUserSkills = (userSkills || []).map((skill) => skill.toLowerCase().replace(/\s/g, "").trim());
  const matchedTech = normalizedUserSkills.filter((userSkill) => jobTechSkills.some((jobSkill) => jobSkill.includes(userSkill) || userSkill.includes(jobSkill)));
  const missingTech = jobTechSkills.filter((jobSkill) => !normalizedUserSkills.some((userSkill) => jobSkill.includes(userSkill) || userSkill.includes(jobSkill)));
  const techScore = jobTechSkills.length > 0 ? matchedTech.length / jobTechSkills.length : 0;
  const matchPercentage = Math.min(100, Math.round(techScore * 100));
  let strengthCategory = "WEAK_LINK";
  if (matchPercentage >= 70) strengthCategory = "PRIME_TARGET";
  else if (matchPercentage >= 45) strengthCategory = "VIABLE";
  return {
    matchPercentage, strengthCategory, matchedTech, missingTech,
    matchedSoft: [], missingSoft: [],
    techScore: Math.round(techScore * 100), softScore: 0, daysSincePosted: 0,
  };
};

const CircularProgress = ({ value, color }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="-rotate-90 w-full h-full drop-shadow-xl">
        <circle cx="100" cy="100" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
        <circle cx="100" cy="100" r={radius} stroke={color} strokeWidth="6" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
        <circle cx="100" cy="100" r={radius - 15} stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white tracking-tight">{value}%</span>
        <span className="text-xs font-medium text-white/50 mt-1 uppercase tracking-wider">Match Score</span>
      </div>
    </div>
  );
};

const TechPanel = ({ children, className = "" }) => (
  <div className={`bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/[0.04] transition-colors duration-500 ${className}`}>
    {children}
  </div>
);

const SkillTag = ({ name, type }) => {
  const styles = type === "match"
    ? "bg-[#9DFF13]/10 border-[#9DFF13]/20 text-[#9DFF13]"
    : "bg-white/5 border-white/10 text-white/50";
  return (
    <span className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize border ${styles} inline-flex items-center gap-2`}>
      {type === "match" && <div className="w-1.5 h-1.5 rounded-full bg-[#9DFF13]"></div>}
      {name}
    </span>
  );
};

const AnalyticsDashboard = () => {
  const { techSkillsList, setTechSkillsList, setJobRole, setJobDescription } = useContext(ProfileContext);
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!techSkillsList || techSkillsList.length === 0) {
      api.get("/api/upload/getinput") // ✅ no more hardcoded localhost
        .then((res) => {
          if (res.data && res.data.data && res.data.data.techSkills) {
            const skills = res.data.data.techSkills.map((item) => item.name);
            setTechSkillsList(skills);
          }
          if (res.data.data.jobRole) {
            setJobRole(res.data.data.jobRole);
          }
        })
        .catch((err) => {
          console.error("Error fetching user profile data on refresh:", err);
        });
    }
  }, [techSkillsList, setTechSkillsList, setJobRole]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`https://jsearch.p.rapidapi.com/job-details?job_id=${jobId}`, {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": "2e99a92ae6mshf0edee9465b5e4dp186f8ajsnd46c8397d86b",
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
          },
        });
        const data = await response.json();
        if (data && data.data && data.data.length > 0) {
          const jobData = data.data[0];
          setJob(jobData);
          setJobDescription(jobData.job_description);
        } else {
          console.error("Job not found or API rate limit reached.");
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId, setJobDescription]);

  const analytics = useMemo(() => {
    if (!job) return null;
    return calculateAnalytics(job.job_description, techSkillsList);
  }, [job, techSkillsList]);

  useEffect(() => {
    const sendDataToRecruiter = async () => {
      if (!job || !analytics) return;
      try {
        await api.post("/api/recruiter/sendData", { // ✅ no more hardcoded localhost
          matchPercentage: analytics.matchPercentage,
          jobTitle: job.job_title,
        });
      } catch (error) {
        console.error("Error sending data to recruiter:", error);
      }
    };
    sendDataToRecruiter();
  }, [job, analytics]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
      <div className="w-10 h-10 border-4 border-white/10 border-t-[#9DFF13] rounded-full animate-spin mb-4"></div>
      <div className="font-medium text-sm text-white/60">Analyzing profile match...</div>
    </div>
  );

  if (!job || !analytics) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
      <div className="text-white/50 text-sm font-medium">Unable to load job details or limit reached.</div>
      <button onClick={() => navigate(-1)} className="mt-4 text-[#9DFF13] hover:text-white transition-colors text-sm">Go back</button>
    </div>
  );

  const uiStrengthMapping = { "PRIME_TARGET": "Strong Match", "VIABLE": "Good Match", "WEAK_LINK": "Needs Alignment" };
  const statusText = uiStrengthMapping[analytics.strengthCategory];
  const scoreColor = analytics.strengthCategory === "PRIME_TARGET" ? "#9DFF13" : analytics.strengthCategory === "VIABLE" ? "#ffffff" : "#555555";

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased relative overflow-x-hidden selection:bg-[#9DFF13]/30">

      <div className="absolute inset-0 z-0 opacity-80">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={3} color="#9DFF13" />
          <DataNodeGeometry />
        </Canvas>
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_120%)] opacity-80"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="max-w-[1200px] w-full mx-auto px-6 md:px-12 pt-32 pb-20 relative z-10">

          <button onClick={() => navigate(-1)} className="mb-8 font-semibold text-sm text-white/50 hover:text-white flex items-center gap-2 transition-colors group">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-1 transition-transform">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Opportunities
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <TechPanel className="lg:col-span-3 flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="w-24 h-24 rounded-2xl bg-white/[0.03] border border-white/10 p-4 flex-shrink-0 flex items-center justify-center">
                <img src={job.employer_logo || `https://ui-avatars.com/api/?name=${job.employer_name}&background=050505&color=9DFF13`} alt={job.employer_name} className="w-full h-full object-contain rounded-xl" />
              </div>

              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-white">{job.job_title}</h1>
                <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
                  <span>{job.employer_name}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20"></span>
                  <span>{job.job_city ? `${job.job_city}, ${job.job_state}` : "Location Flexible"}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="bg-white/5 border border-white/10 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full">
                    {job.job_employment_type?.replace(/_/g, " ") || "Full Time"}
                  </span>
                  {job.job_is_remote && (
                    <span className="bg-[#9DFF13]/10 border border-[#9DFF13]/20 text-[#9DFF13] text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#9DFF13]"></div> Remote
                    </span>
                  )}
                </div>
              </div>

              <div className="md:text-right flex flex-col items-start md:items-end gap-3 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 mt-4 md:mt-0 w-full md:w-auto">
                <div className="text-xl font-bold text-white">
                  {job.job_min_salary && job.job_max_salary ? `$${job.job_min_salary} - $${job.job_max_salary}` : "Salary Undisclosed"}
                </div>
                <p className="text-xs text-white/40 font-medium">Posted: {formatDate(job.job_posted_at_datetime_utc || job.job_posted_at)}</p>
                <a href={job.job_apply_link} target="_blank" rel="noopener noreferrer"
                  className="group mt-3 px-8 py-3.5 bg-[#9DFF13] text-[#050505] font-bold text-sm hover:bg-white transition-all duration-300 rounded-full w-full md:w-auto text-center shadow-[0_0_20px_rgba(157,255,19,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:-translate-y-0.5 flex justify-center items-center gap-2">
                  Apply Now
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </TechPanel>

            <TechPanel className="lg:col-span-1 flex flex-col items-center justify-center min-h-[350px]">
              <div className="text-center mb-6 w-full flex justify-between items-center px-2 border-b border-white/[0.08] pb-4">
                <h3 className="text-white text-sm font-semibold tracking-tight">Analysis Overview</h3>
                <h2 className="text-[#9DFF13] text-xs font-bold uppercase tracking-wider px-3 py-1 bg-[#9DFF13]/10 rounded-full">{statusText}</h2>
              </div>
              <div className="py-4">
                <CircularProgress value={analytics.matchPercentage} color={scoreColor} />
              </div>
              <div className="mt-4 w-full">
                <div className="flex justify-between text-xs font-semibold text-white/50 mb-3">
                  <span>Listing Age</span>
                  <span>{analytics.daysSincePosted} days ago</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#9DFF13] h-full rounded-full" style={{ width: `${Math.max(0, 100 - analytics.daysSincePosted * 2)}%` }}></div>
                </div>
              </div>
            </TechPanel>

            <TechPanel className="lg:col-span-1 flex flex-col">
              <div className="flex justify-between items-end mb-6 border-b border-white/[0.08] pb-4">
                <h3 className="text-sm font-semibold text-white tracking-tight">Technical Skills</h3>
                <span className="text-xs font-bold bg-[#9DFF13]/10 text-[#9DFF13] px-2 py-1 rounded-md">{analytics.techScore}%</span>
              </div>
              <div className="flex-1 space-y-8">
                <div>
                  <p className="text-xs font-medium text-white/50 mb-3">Matched Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {analytics.matchedTech.length > 0 ? analytics.matchedTech.map((skill) => <SkillTag key={skill} name={skill} type="match" />) : <span className="text-white/30 text-sm font-medium">None found</span>}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-white/50 mb-3">Skills to Acquire</p>
                  <div className="flex flex-wrap gap-2">
                    {analytics.missingTech.length > 0 ? analytics.missingTech.map((skill) => <SkillTag key={skill} name={skill} type="missing" />) : <span className="text-white/30 text-sm font-medium">None required</span>}
                  </div>
                </div>
              </div>
            </TechPanel>

            <TechPanel className="lg:col-span-1 flex flex-col">
              <div className="flex justify-between items-end mb-6 border-b border-white/[0.08] pb-4">
                <h3 className="text-sm font-semibold text-white tracking-tight">Soft Metrics (Coming Soon)</h3>
                <span className="text-xs font-bold bg-white/5 text-white/50 px-2 py-1 rounded-md">{analytics.softScore}%</span>
              </div>
              <div className="flex-1 space-y-8">
                <div>
                  <p className="text-xs font-medium text-white/50 mb-3">Matched Traits</p>
                  <div className="flex flex-wrap gap-2">
                    {analytics.matchedSoft.length > 0 ? analytics.matchedSoft.map((skill) => <SkillTag key={skill} name={skill} type="match" />) : <span className="text-white/30 text-sm font-medium">Analysis pending</span>}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-white/50 mb-3">Traits to Highlight</p>
                  <div className="flex flex-wrap gap-2">
                    {analytics.missingSoft.length > 0 ? analytics.missingSoft.map((skill) => <SkillTag key={skill} name={skill} type="missing" />) : <span className="text-white/30 text-sm font-medium">Analysis pending</span>}
                  </div>
                </div>
              </div>
            </TechPanel>

            <div className="lg:col-span-3 mt-6">
              <div className="inline-flex items-center gap-2 mb-6 pointer-events-auto bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-[#9DFF13] animate-pulse"></div>
                <span className="text-xs font-medium text-white/80 uppercase tracking-wide">Step 04 / AI Intelligence</span>
              </div>
              <Recommend />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;