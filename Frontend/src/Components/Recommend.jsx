import React, { useEffect, useState, useContext } from "react";
import { ProfileContext } from "./Pages/ProfileContext";

// --- Frosted Glass Data Card (Matches TechPanel from Dashboard) ---
const AiPanel = ({ children, className = "" }) => (
  <div className={`bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/[0.04] transition-colors duration-500 ${className}`}>
    {children}
  </div>
);

const Recommend = () => {
  const [data, setData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { jobRole, techSkillsList, jobDescription } = useContext(ProfileContext);

  useEffect(() => {
    if (!jobRole || techSkillsList.length === 0 || !jobDescription?.trim()) return;

    const fetchAI = async () => {
      setIsGenerating(true);
      const url = "https://copilot5.p.rapidapi.com/copilot";

      const prompt = `
You are an AI career intelligence engine used in a SaaS platform for students.

Generate concise and structured insights for a student who wants to become a ${jobRole}.
student has the following tech skills: ${techSkillsList.join(", ")}
Job Description:
${jobDescription}.

Provide the output in this JSON format:

Rules:
- Return ONLY valid JSON
- No explanations
- No markdown
- Use short bullet-point style phrases
- Each list should contain 3–6 items maximum
- Each item should be under 12 words

Return JSON in this exact format:

{
  "missingSkillsRecommendation": [],
  "learningRoadmap": [],
  "marketTrends": {
    "demandLevel": "",
    "industryInsight": "",
    "futureSkills": []
  },
  "careerAdvice": []
}
`;

      const options = {
        method: "POST",
        headers: {
          "x-rapidapi-key": "771602b102msh57211c4608703d4p1977d3jsne271b7db67a8",
          "x-rapidapi-host": "copilot5.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          conversation_id: null,
          mode: "CHAT",
          markdown: false,
        }),
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        const aiText = result.data.message;
        const jsonStart = aiText.indexOf("{");
        const jsonEnd = aiText.lastIndexOf("}") + 1;
        const cleanJson = aiText.slice(jsonStart, jsonEnd);
        const parsed = JSON.parse(cleanJson);

        setData(parsed);
      } catch (err) {
        console.error("Error fetching AI recommendations:", err);
      } finally {
        setIsGenerating(false);
      }
    };

    fetchAI();
  }, [jobRole, techSkillsList, jobDescription]);

  // --- UI STATE: Incomplete Profile ---
  if (!jobRole || techSkillsList.length === 0 || !jobDescription) {
    return (
      <AiPanel className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 text-white/40">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Profile Incomplete</h3>
        <p className="text-sm text-white/50 max-w-sm font-medium">
          Please complete your profile and add your skills to unlock personalized AI career intelligence.
        </p>
      </AiPanel>
    );
  }

  // --- UI STATE: Loading / Generating ---
  if (isGenerating || !data) {
    return (
      <AiPanel className="flex flex-col items-center justify-center py-20 text-center">
        <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#9DFF13] rounded-full border-t-transparent animate-spin shadow-[0_0_20px_rgba(157,255,19,0.2)]"></div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9DFF13" strokeWidth="2.5" className="relative z-10">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight animate-pulse mb-2">
          Nexus AI is analyzing your path...
        </h3>
        <p className="text-sm text-white/50 font-medium">
          Cross-referencing your skill tree against live market data.
        </p>
      </AiPanel>
    );
  }

  // --- MAIN UI: Results ---
  return (
    <div className="flex flex-col gap-6">
      
      {/* Refined Header */}
      <div className="flex items-center gap-5 border-b border-white/[0.08] pb-6 px-2">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(157,255,19,0.05)] text-[#9DFF13]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2l3 6 6 1-4.5 4.5L18 20l-6-3-6 3 1.5-6.5L3 9l6-1z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Career Intelligence</h2>
          <p className="text-sm text-white/50 mt-1 font-medium">Personalized strategic insights for {jobRole}</p>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Missing Skills */}
        <AiPanel className="flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#ffaa00] mb-6 flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Priority Skill Gaps
          </h3>
          <ul className="space-y-4">
            {data.missingSkillsRecommendation.map((skill, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/70 font-medium">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#ffaa00] flex-shrink-0 shadow-[0_0_8px_rgba(255,170,0,0.6)]"></span>
                <span className="leading-relaxed">{skill}</span>
              </li>
            ))}
          </ul>
        </AiPanel>

        {/* 2. Learning Roadmap */}
        <AiPanel className="flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#9DFF13] mb-6 flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Actionable Roadmap
          </h3>
          <div className="space-y-5">
            {data.learningRoadmap.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[#9DFF13]/10 border border-[#9DFF13]/30 flex items-center justify-center text-[11px] font-bold text-[#9DFF13] flex-shrink-0">
                    0{i + 1}
                  </div>
                  {i !== data.learningRoadmap.length - 1 && (
                    <div className="w-[2px] h-6 bg-white/[0.08] my-1 rounded-full"></div>
                  )}
                </div>
                <p className="text-sm text-white/70 pt-1 leading-relaxed font-medium">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </AiPanel>

        {/* 3. Market Trends */}
        <AiPanel className="flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/50">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            Market Pulse
          </h3>

          <div className="mb-6">
            <span className="text-[11px] text-white/40 uppercase font-bold tracking-wider">Current Demand</span>
            <div className="mt-2 flex items-center gap-2">
              <span className="px-3 py-1 bg-[#9DFF13]/10 border border-[#9DFF13]/20 text-[#9DFF13] text-xs font-bold rounded-full">
                {data.marketTrends.demandLevel}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-[11px] text-white/40 uppercase font-bold tracking-wider">Industry Insight</span>
            <p className="text-sm text-white/70 mt-2 leading-relaxed border-l-2 border-white/20 pl-4 font-medium italic">
              "{data.marketTrends.industryInsight}"
            </p>
          </div>

          <div>
            <span className="text-[11px] text-white/40 uppercase font-bold tracking-wider mb-3 block">Future-Proof Skills</span>
            <div className="flex flex-wrap gap-2">
              {data.marketTrends.futureSkills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/80 text-xs font-semibold rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </AiPanel>

        {/* 4. Career Advice */}
        <AiPanel className="flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/50">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Expert Advice
          </h3>
          <ul className="space-y-4">
            {data.careerAdvice.map((tip, i) => (
              <li key={i} className="flex items-start gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/[0.04] hover:border-white/10 transition-colors">
                <div className="mt-0.5 text-[#9DFF13] flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-sm text-white/70 leading-relaxed font-medium">
                  {tip}
                </span>
              </li>
            ))}
          </ul>
        </AiPanel>

      </div>
    </div>
  );
};

export default Recommend;