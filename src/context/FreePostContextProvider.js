import { createContext, useEffect, useState } from "react";

export const FreePostContext = createContext(null);

const FreePostContextProvider = ({ children }) => {
  const [freePostArr, setFreePostArr] = useState([]);

  useEffect(() => {
    const localFree = JSON.parse(window.localStorage.getItem("freeMode"));
    setFreePostArr(localFree);
  }, []);

  // 그냥 이거 자체를 onMouseDown으로? 아마 같은 click계열의 event라 이벤트가 겹쳐서 mouseDown이 실행되고 onClick을 무시하게 되는듯? 아니면 onMouseDown event function에 postIndex function을 따로 담아서 그런가?
  // mouseDown을 했을 때 freePostArr의 순서가 바뀌게 되어 FreeBoard에서 새롭게 map으로 재생성된다. 그과정에서 onClick event를 인식하지 못하고 반응하지 않은 것이라 추측, 때문에 mouseDown event가 없으면 잘 작동하는 것
  // const postIndex = (at) => {
  //   const localFree = JSON.parse(window.localStorage.getItem("freeMode"));
  //   console.log(at, localFree.at(-1).at, localFree);
  //   console.log("do");
  //   if (at === localFree.at(-1).at) return;
  //   console.log("it");
  //   const findPost = localFree.find((post) => post.at === at);
  //   const filterArr = localFree.filter((post) => post.at !== at);
  //   const newArr = [...filterArr, findPost];

  //   console.log("newArr", newArr[4]);
  //   // window.localStorage.setItem("freeMode", JSON.stringify(newArr));
  //   setFree(newArr);
  // };

  const saveIndexAndPosition = (at, postPosition) => {
    let newIndexArr = JSON.parse(window.localStorage.getItem("freeMode"));
    if (at !== newIndexArr.at(-1).at) {
      const findPost = newIndexArr.find((post) => post.at === at);
      const filterArr = newIndexArr.filter((post) => post.at !== at);
      newIndexArr = [...filterArr, findPost];
    }

    const newFreePostArr = newIndexArr.map((f) => {
      return f.at === at ? { at: f.at, ...postPosition } : f;
    });
    // console.log(newFreePostArr);
    setFreePostArr(newFreePostArr);
    window.localStorage.setItem("freeMode", JSON.stringify(newFreePostArr));
  };

  return (
    <FreePostContext.Provider
      value={{ freePostArr, setFreePostArr, saveIndexAndPosition }}
    >
      {children}
    </FreePostContext.Provider>
  );
};

export default FreePostContextProvider;
