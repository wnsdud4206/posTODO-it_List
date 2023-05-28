import DarkModeContextProvider from "./DarkModeContextProvider";
import BoardModeContextProvider from "./BoardModeContextProvider";
import FreePostContextProvider from "./FreePostContextProvider";
import PostContextProvider from "./PostContextProvider";
import StandardPostContextProvider from "./StandardPostContextProvider";

const CombineContext = ({ children }) => {
  return (
    <DarkModeContextProvider>
      <BoardModeContextProvider>
        <PostContextProvider>
          <StandardPostContextProvider>
            <FreePostContextProvider>{children}</FreePostContextProvider>
          </StandardPostContextProvider>
        </PostContextProvider>
      </BoardModeContextProvider>
    </DarkModeContextProvider>
  );
};

export default CombineContext;
