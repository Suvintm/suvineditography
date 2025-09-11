import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(5);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [projects, setProjects] = useState([]);

  const [activeCategory, setActiveCategory] = useState("Images");
  const [activeSubCategoryImage, setActiveSubCategoryImage] = useState("");
  const [activesourceImage, setActiveSourceImage] = useState("All");

  const [activesourceVideo, setActiveSourceVideo] = useState("All");
  const [activeSubCategoryVideo, setActiveSubCategoryVideo] = useState("All");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const loadCreditData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/credit`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const creditInfo = res.data.data;
        setCredits(creditInfo.credit);
        setUser({ name: creditInfo.name, email: creditInfo.email });
      }
    } catch (error) {
      console.log("Credit fetch error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (token) {
      loadCreditData();
    }
  }, [token]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        credits,
        setCredits,
        backendUrl,
        token,
        setToken,
        projects, // <-- provide projects
        setProjects,
        activeCategory,
        setActiveCategory,
        activeSubCategoryImage,
        setActiveSubCategoryImage,
        activesourceImage,
        setActiveSourceImage,
        activesourceVideo,
        setActiveSourceVideo,
        activeSubCategoryVideo,
        setActiveSubCategoryVideo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
