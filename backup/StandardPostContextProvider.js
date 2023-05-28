import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { PostContext } from "./PostContextProvider";

export const StandardPostContext = createContext(null);

const StandardPostContextProvider = ({ children }) => {
  // const { testArr } = useContext(PostContext);
  // gap 16px, post width 240px
  // 2줄일 때 496px;
  // 3줄일 때 752px;
  // null~ loading
  const [boardSize, setBoardSize] = useState(null);
  const [column, setColumn] = useState(
    window.innerWidth < 1100 ? 2 : Math.floor((window.innerWidth - 200) / 300),
  );
  const [standardPostArr, setStandardPostArr] = useState([]);
  const [postAreaArr, setPostAreaArr] = useState([]);

  const onResize = (resizeWidth = window.innerWidth) => {
    const newColumn =
      resizeWidth < 1100 ? 2 : Math.floor((resizeWidth - 200) / 300);
    const newSize = newColumn * 256 - 16;
    setBoardSize(newSize);
    setColumn(newColumn);
  };

  useEffect(() => {
    onResize();
    const onResizeHandler = ({ target: { innerWidth } }) => {
      onResize(innerWidth);
    };
    window.addEventListener("resize", onResizeHandler);
    return () => {
      window.removeEventListener("resize", onResizeHandler);
    };
  }, []);

  const onReposition = useCallback((testArr, postColumn = column) => {
    let newTestArr = [...testArr];
    // 맨처음 위치를 정의하는경우, 임의로 위치를 옮기는 경우
    newTestArr.reduce((acc, cur, index) => {
      const i = parseInt(index);
      let result;
      let position = {};
      if (postColumn > i) {
        const col = `col${i + 1}`;
        const x = (i % postColumn) * 256;
        result = { ...acc, [col]: [cur.size] };
        position = { x, y: 0 };
      } else {
        const [col, value] = Object.entries(acc).reduce(
          ([aKey, aArr], [cKey, cArr]) => {
            const a = aArr.at(-1);
            const c = cArr.at(-1);
            return a <= c ? [aKey, [a]] : [cKey, [c]];
          },
        );
        const x = Object.keys(acc).indexOf(col) * 256;
        const y = parseInt(value) + 16;
        result = { ...acc, [col]: [...acc[col], y + cur.size] };
        position = { x, y };
      }

      newTestArr[i].standardPosition = position;
      return result;
    }, {});

    const newPostAreaArr = newTestArr.map((arr) => {
      const {
        at,
        size,
        standardPosition: { x, y },
      } = arr;
      return {
        at,
        min: { minX: x, minY: y },
        max: { maxX: 240 + x, maxY: size + y },
      };
    });

    // window.localStorage.setItem("testPost", JSON.stringify(newTestArr));
    setStandardPostArr(newTestArr);
    setPostAreaArr(newPostAreaArr);
  }, [column]);

  useEffect(() => {
    const testArr = JSON.parse(window.localStorage.getItem("testPost"));
    onReposition(testArr, column);
  }, [column, onReposition]);

  // useEffect(() => console.log(standardPostArr), [standardPostArr]);

  return (
    <StandardPostContext.Provider
      value={{
        boardSize,
        standardPostArr,
        postAreaArr,
        onReposition,
      }}
    >
      {children}
    </StandardPostContext.Provider>
  );
};

export default StandardPostContextProvider;
