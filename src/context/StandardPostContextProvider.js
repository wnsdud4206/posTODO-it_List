import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import { PostContext } from "./PostContextProvider";

export const StandardPostContext = createContext(null);

const StandardPostContextProvider = ({ children }) => {
  const { postState } = useContext(PostContext);
  // useEffect(() => console.log(postState), [postState]);
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
  // 조잡하지만 아래처럼 해도 될 것같은데? -> 근데 생성되는게 늦어서 위치 잡는 모션이 보인다..., 첫 랜더링 때만 transition을 opacity만 냅두고 지우기?
  // const [standardPostArr, setStandardPostArr] = useState(
  //   JSON.parse(window.localStorage.getItem("standardMode")).map((s) => ({
  //     ...postState.find((p) => p.at === s.at),
  //     ...s,
  //   })) || [],
  // );
  // useState(() => console.log(standardPostArr), [standardPostArr]);
  // const [postAreaArr, setPostAreaArr] = useState([]);

  const newStandardPostArrRef = useRef([]);
  const [postEnter, setPostEnter] = useState(false);

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

  const onReposition = useCallback(
    (testArr, postColumn = column) => {
      // testArr는 standardMode의 데이터
      let newTestArr = [...testArr];
      // 맨처음 위치를 정의하는경우, 임의로 위치를 옮기는 경우
      newTestArr.reduce((acc, cur, index) => {
        const i = parseInt(index);
        let postHeight = cur.postHeight > 600 ? 600 : cur.postHeight;
        let nextAcc;
        let position = {};
        if (postColumn > i) {
          const col = `col${i + 1}`;
          const x = (i % postColumn) * 256;
          nextAcc = { ...acc, [col]: [postHeight] };
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
          // const y = parseInt(value > 600 ? 600 : value) + 16;
          const y = parseInt(value) + 16;
          nextAcc = { ...acc, [col]: [...acc[col], y + postHeight] };
          position = { x, y };
        }
        // console.log(position);

        newTestArr[i] = { ...newTestArr[i], ...position };
        return nextAcc;
      }, {});

      // console.log(newTestArr);

      // const newPostAreaArr = newTestArr.map((arr) => {
      //   const { at, postHeight, x, y } = arr;
      //   return {
      //     at,
      //     min: { minX: x, minY: y },
      //     max: { maxX: 240 + x, maxY: postHeight + y },
      //   };
      // });
      // console.log("newPostAreaArr", newPostAreaArr);

      newStandardPostArrRef.current = newTestArr;
      setStandardPostArr(newTestArr);
      // setPostAreaArr(newPostAreaArr);
    },
    [column],
  );

  useEffect(() => {
    // 이 로직을 standardPostArr state에 바로 적용하도록 해야하는데, 지금 상위에 testState처럼 바로 넣어주면 at, x, y 데이터만 전달되고 color, title, text 등 다른 데이터들은 전달되지 않기 때문에 에러가 난다. 그렇기 때문에 합쳐주어야함, 이것만 할줄 알고 freeMode에서도 적용해준다면 내가 생각하는 대로 잘 구현될듯? context에다가만 local data를 state에 담고 setState로 새롭게 랜더링해주는 방법, 여타 context들과 하위 component들에게 적용해야함
    // const postArr = JSON.parse(window.localStorage.testPost);
    const standardArr = JSON.parse(window.localStorage.standardMode);
    const newStandardArr = standardArr.map((s) => {
      const post = postState.find((p) => p.at === s.at);
      return { ...s, ...post };
    });
    onReposition(newStandardArr, column);
    // 이제 postState가 deps에도 선언해주면 업데이트 될 때마다 자동으로 새로운 position과 standardPostArr이 업데이트 될 듯, 근데 text나 title, color 같은 property들 빼고 위치가 바뀌었다는 건 인지하지 못할듯
  }, [column, onReposition, postState]);

  return (
    <StandardPostContext.Provider
      value={{
        boardSize,
        standardPostArr,
        // testState,
        newStandardPostArrRef,
        // postAreaArr,
        onReposition,
        postEnter,
        setPostEnter,
      }}
    >
      {children}
    </StandardPostContext.Provider>
  );
};

export default StandardPostContextProvider;
