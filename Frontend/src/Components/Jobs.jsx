import React, { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar";
import api from "../lib/axios"; // ✅ replaced axios
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Wireframe, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function DataNodeGeometry() {
  const meshRef = useRef(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.04;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
      <mesh ref={meshRef} position={[5, 0, -5]} scale={2}>
        <icosahedronGeometry args={[2, 1]} />
        <MeshTransmissionMaterial
          background={new THREE.Color("#050505")}
          color="#9DFF13"
          transmission={1}
          thickness={0.05}
          roughness={0.05}
          ior={1.2}
          transparent={true}
          opacity={0.7}
        />
        <Wireframe simplify={true} stroke={"#9DFF13"} thickness={0.01} dash={false} opacity={0.15} transparent />
      </mesh>
    </Float>
  );
}

const Jobs = () => {
  const navigate = useNavigate();
  const [jobRole, setjobRole] = useState("");
  const [techSkillsList, setTechSkillsList] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/upload/getinput") // ✅ no more hardcoded localhost
      .then((res) => {
        setjobRole(res.data.data.jobRole);
        const skills = res.data.data.techSkills.map((item) => item.name);
        setTechSkillsList(skills);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    const searchJob = async () => {
      if (!jobRole || techSkillsList.length === 0) return;
      const roleQuery = jobRole?.trim() || "software developer";
      const importantSkills = techSkillsList.slice(0, 2).join(" ");
      const finalQuery = `${roleQuery} ${importantSkills}`;

      const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(finalQuery)}%20jobs%20in%20india&page=1&num_pages=1&country=in&date_posted=all`;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": "2e99a92ae6mshf0edee9465b5e4dp186f8ajsnd46c8397d86b",
          "x-rapidapi-host": "jsearch.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    searchJob();
  }, [jobRole, techSkillsList]);

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-sans antialiased selection:bg-[#9DFF13]/30">

      <div className="absolute inset-0 z-0 opacity-80">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={3} color="#9DFF13" />
          <pointLight position={[-10, -5, -5]} intensity={1} color="#ffffff" />
          <DataNodeGeometry />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_110%)] opacity-80"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="max-w-[1200px] w-full mx-auto px-6 md:px-12 pt-32 pb-20 flex flex-col gap-12 items-start">

          <div className="w-full lg:w-2/3 pt-8 pointer-events-none">
            <div className="inline-flex items-center gap-2 mb-6 pointer-events-auto bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-[#9DFF13] animate-pulse"></div>
              <span className="text-xs font-medium text-white/80 uppercase tracking-wide">Step 03 / Opportunities</span>
            </div>

            <h1 className="text-5xl md:text-[4.5rem] font-bold tracking-tight leading-[1.05] text-white drop-shadow-sm">
              Curated <br/>
              <span className="text-[#9DFF13] drop-shadow-[0_0_25px_rgba(157,255,19,0.2)]">Job Matches.</span>
            </h1>

            <p className="text-lg text-white/50 max-w-lg font-light mt-6 leading-relaxed pointer-events-auto">
              Live feed of optimal career opportunities, precisely calibrated to your synthesized profile and technical skillset.
            </p>
          </div>

          <div className="w-full flex flex-col gap-5 pointer-events-auto mt-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-3xl">
                <div className="w-10 h-10 border-4 border-white/10 border-t-[#9DFF13] rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-medium text-white/60">Analyzing network data...</p>
              </div>
            ) : (
              data?.data?.map((item) => (
                <div
                  key={item.job_id}
                  onClick={() => navigate(`/jobs/analyze/${item.job_id}`, {})}
                  className="bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center group hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 relative cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(157,255,19,0.1)]"
                >
                  <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/10 p-3 flex-shrink-0 flex items-center justify-center relative z-10 group-hover:border-[#9DFF13]/50 transition-colors">
                    <img
                      src={item.employer_logo || `https://ui-avatars.com/api/?name=${item.employer_name}&background=0A0A0A&color=9DFF13&font-size=0.4`}
                      alt={item.employer_name}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>

                  <div className="flex-1 relative z-10 w-full">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white group-hover:text-[#9DFF13] transition-colors tracking-tight">{item.job_title}</h2>
                        <div className="flex items-center gap-2 text-white/60 text-sm mt-2 font-medium">
                          <span>{item.employer_name}</span>
                          <span className="w-1 h-1 rounded-full bg-white/20"></span>
                          <span>{item.job_city ? `${item.job_city}, ${item.job_state}` : "Location Flexible"}</span>
                        </div>
                      </div>
                      <div className="text-left md:text-right flex flex-col md:items-end">
                        <p className="text-base font-semibold text-white/90">
                          {item.job_min_salary && item.job_max_salary ? `$${item.job_min_salary} - $${item.job_max_salary}` : "Salary Undisclosed"}
                        </p>
                        <p className="text-xs text-white/40 mt-1 font-medium">Posted: {formatDate(item.job_posted_at_datetime_utc || item.job_posted_at)}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-6">
                      <span className="bg-white/5 border border-white/10 text-white/70 text-xs font-semibold px-4 py-1.5 rounded-full">
                        {item.job_employment_type?.replace(/_/g, " ") || "Full Time"}
                      </span>
                      {item.job_is_remote && (
                        <span className="bg-[#9DFF13]/10 border border-[#9DFF13]/20 text-[#9DFF13] text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#9DFF13]"></div>
                          Remote
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-auto mt-4 md:mt-0 relative z-10">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 text-white/60 group-hover:bg-[#9DFF13] group-hover:border-[#9DFF13] group-hover:text-[#050505] transition-all duration-300">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-0.5 transition-transform">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;