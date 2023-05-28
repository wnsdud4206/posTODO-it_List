import { createContext, useState } from "react";
import GlobalStyle from "../style/GlobalStyle";

export const DarkModeContext = createContext(null);

const DarkModeContextProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(
    JSON.parse(window.localStorage?.getItem("darkMode")) || false,
  );

  return (
    <DarkModeContext.Provider value={{ isDark, setIsDark }}>
      <GlobalStyle isDark={isDark} />
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeContextProvider;
