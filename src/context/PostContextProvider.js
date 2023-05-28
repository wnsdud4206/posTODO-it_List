import { createContext, useEffect, useState } from "react";

export const PostContext = createContext(null);

const PostContextProvider = ({ children }) => {
  // 수정된 storage(testPost, standardMode, freeMode)를 저장해서 업데이트 해주는 함수?
  const [postState, setPostState] = useState(
    JSON.parse(window.localStorage.getItem("testPost")) || [],
  );

  // useEffect(() => console.log(postState), []);

  const [postDetail, setPostDetail] = useState(false);

  const addPost = () => {
    const testPost = JSON.parse(window.localStorage.getItem("testPost"));
    const standardPost = JSON.parse(
      window.localStorage.getItem("standardMode"),
    );
    const freePost = JSON.parse(window.localStorage.getItem("freeMode"));
    // 글자색상(검은색)때문에 어두운 배경을 피하거나 다른 방법을 사용해야할듯
    const at = Date.now();
    // 더 연한 색상들로 변경?
    const color = [
      "#ffffff",
      "#f5f5dc", // 베이지색?
      "#fbceb1", // 연한 주황색?
      "#f9c8eb", // 분홍색
      "#fac264", // 진한 베이지색?
      "#dbfa7d", // 연두색
      "#b0ecff", // 하늘색
      "#dcc8f9", // 연보라색
    ][Math.floor(Math.random() * 8)];
    // newArr 임시
    // post default data
    const newPost = [
      ...testPost,
      { at, color, postHeight: 300, textareaHeight: 216, title: "", text: "" },
    ];
    const newStandard = [...standardPost, { at, x: null, y: null }];
    const newFree = [...freePost, { at, x: 0, y: 0 }];
    window.localStorage.setItem("testPost", JSON.stringify(newPost));
    window.localStorage.setItem("standardMode", JSON.stringify(newStandard));
    window.localStorage.setItem("freeMode", JSON.stringify(newFree));
    // 왜 생성하고 새로고침해야 보여지지
    // 하위에서 사용하는 모든 testPost localStorage를 여기 context에서 state에 담아서 사용해야하나? 리랜더링되도록?
  };

  // 현재 post와 textarea의 변경된 height값을 받아서 저장하는 로직을 구현해야함(참고로 textarea의 height의 최솟값은 222px이어야 한다)
  // const saveHeight = (at, postHeight, textareaHeight) => {};

  return (
    <PostContext.Provider
      value={{ postState, setPostState, addPost, postDetail, setPostDetail }}
    >
      {children}
    </PostContext.Provider>
  );
};

export default PostContextProvider;
