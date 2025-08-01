import { createContext } from "react";
import { useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(5); // Default credits
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  return (
    <AppContext.Provider
      value={{ user, setUser, credits, setCredits, backendUrl, token, setToken }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
