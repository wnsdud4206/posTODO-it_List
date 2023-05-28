import { createContext, useState } from "react";

export const BoardModeContext = createContext(null);

const BoardModeContextProvider = ({ children }) => {
  const [isBoardMode, setIsBoardMode] = useState(
    JSON.parse(window.localStorage?.getItem("boardMode")) || false,
  );

  return (
    <BoardModeContext.Provider value={{ isBoardMode, setIsBoardMode }}>
      {children}
    </BoardModeContext.Provider>
  );
};

export default BoardModeContextProvider;
