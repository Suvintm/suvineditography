import { createContext } from "react";
import { useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(5);

  return (
    <AppContext.Provider value={{ user, setUser, credits, setCredits }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
