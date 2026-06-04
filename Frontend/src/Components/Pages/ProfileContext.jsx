import { createContext, useState } from "react";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {

  const [name, setName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [experience, setExperience] = useState("Entry Level (0-1 years)");

  const [techSkillsList, setTechSkillsList] = useState([]);
  const [softSkillsList, setSoftSkillsList] = useState([]);

  const [jobDescription, setJobDescription] = useState("");

  return (
    <ProfileContext.Provider
      value={{
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
        jobDescription,
        setJobDescription,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};