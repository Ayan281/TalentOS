import React, { useEffect, useState, useContext } from "react";
import { ProfileContext } from "./Pages/ProfileContext";

const ChatGpt = () => {
  const [data, setData] = useState("");
  const {
    name,
    setName,
    jobRole,
    setJobRole,
    experience,
    setExperience,
    techSkillsList,
    setTechSkillsList,
    softSkillsList,
    setSoftSkillsList,
  } = useContext(ProfileContext);
  console.log("jobRole:", jobRole);

  //AI Recoomendation
  useEffect(() => {
    const fetchChatbot = async () => {
      const url = "https://chatgpt-vision1.p.rapidapi.com/matagvision2";

      const prompt = `
        You are an expert technical recruiter.
        
        JOB TITLE:
        React Developer
        
        JOB DESCRIPTION:
        We are looking for a React Developer with experience in React.js, 
        Redux, REST APIs, Git, and basic knowledge of Docker. 
        The candidate should have good communication skills 
        and the ability to work in a team.
        
        CANDIDATE TECHNICAL SKILLS:
        React, JavaScript, Node.js, Git
        
        CANDIDATE SOFT SKILLS:
        Teamwork, Problem Solving
        
        Return ONLY valid JSON in this format:
        
        {
          "match_percentage": number,
          "technical_gap": [],
          "soft_skill_gap": [],
          "strengths": [],
          "improvement_suggestions": [],
          "summary": ""
        }
        
        Do not write anything outside JSON.
        `;

      const options = {
        method: "POST",
        headers: {
          "x-rapidapi-key":
            "2e99a92ae6mshf0edee9465b5e4dp186f8ajsnd46c8397d86b",
          "x-rapidapi-host": "chatgpt-vision1.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt,
                },
              ],
            },
          ],
          web_access: false,
        }),
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();

        console.log("Full API Response:", result);

        // Adjust depending on API response structure
        const aiText = result?.choices?.[0]?.message?.content || "No response";
        console.log(aiText);
        

        setData(aiText);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChatbot();
  }, []);

  return (
    <div>
      <h1 className="text-4xl">AI Insight - {jobRole}</h1>
      <pre className="mt-4 text-white whitespace-pre-wrap">{data}</pre>
    </div>
  );
};

export default ChatGpt;
