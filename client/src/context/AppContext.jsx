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

  const [loadingUser, setLoadingUser] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const loadCreditData = async () => {
    setLoadingUser(true);
    try {
      const res = await axios.get(`${backendUrl}/api/user/credit`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const creditInfo = res.data.data;

        setCredits(creditInfo.credit);

        // ✅ include all relevant fields: id, name, email, isAdmin
        setUser({
          id: creditInfo.id || creditInfo._id,
          name: creditInfo.name,
          email: creditInfo.email,
          isAdmin: !!creditInfo.isAdmin, // make sure backend returns this
        });
        console.log("User after setting:", {
          id: creditInfo.id || creditInfo._id,
          name: creditInfo.name,
          email: creditInfo.email,
          isAdmin: creditInfo.isAdmin || false,
        });
      }
    } catch (error) {
      console.log("Credit fetch error:", error.response?.data || error.message);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadCreditData();
    } else {
      setLoadingUser(false);
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
        projects,
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
        loadingUser, // <-- add this
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
