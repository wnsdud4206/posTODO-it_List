import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { PostContext } from "../context/PostContextProvider";
// import testJson from "../json/test.json";
import testJson from "../json/test.json";
import arrayJson from "../json/arrayJson.json";

const TestStyle = styled.button`
  border: none;
  padding: 2px 6px;

  position: fixed;
  top: 0;
  right: 0;

  cursor: pointer;

  transition: background-color 1.7s;

  span {
    -webkit-filter: invert(100%);

    transition: color 1.7s;
  }
`;

const Test = () => {
  const [changeColors, setChangeColors] = useState([
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
  ]);
  const changeColorsRef = useRef(changeColors);

  useEffect(() => {
    setInterval(() => {
      const newColors = [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
      ];
      // console.log("currentColor", newColors);
      changeColorsRef.current = newColors;
      setChangeColors(newColors);
    }, 1700);
  }, []);

  // test
  // 참고 - https://velog.io/@jeong3320/React%EC%9D%B4%EB%B2%A4%ED%8A%B8%EB%A6%AC%EC%8A%A4%EB%84%88-%EC%B5%9C%EC%8B%A0-state%EA%B0%92-%EB%B0%9B%EC%95%84%EC%98%A4%EA%B8%B0
  // const [test, setTest] = useState(0);
  // 아니면 함수 안에 함수를 넣으면? - 안됨
  // 무조건 useRef로 해야하는듯
  // const onTest = () => {
  //   console.log("changeColors", changeColorsRef.current);
  // };
  // useEffect(() => {
  //   // addEventListener가 아니라 window.onclick = function 형태로 한다면?
  //   window.addEventListener("click", onTest);
  //   // window.onclick = onTest;
  // }, []);

  const { postState, setPostState } = useContext(PostContext);
  // useEffect(() => console.log(postState), [postState]);
  const onTest = () => {
    // setPostState("auto render?"); // yes

    // testJson.test = "hello";
    // console.log(testJson);
    console.log(require("../json/test.json"));
  };

  useEffect(() => {
    onTest();
    // testJson.setItem({hi: "hello"});
  }, [testJson]);
  useEffect(() => console.log(arrayJson), [arrayJson]);

  return (
    <TestStyle
      style={{
        backgroundColor: `rgb(${changeColors.join(", ")})`,
      }}
      onClick={onTest}
    >
      <span
        style={{
          color: `rgb(${changeColors.join(", ")})`,
        }}
      >
        test enable
      </span>
    </TestStyle>
  );
};

export default Test;
