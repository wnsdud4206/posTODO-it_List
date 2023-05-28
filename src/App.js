import React from "react";
import Container from "./components/Container";
import Test from "./components/Test";
import CombineContext from "./context/CombineContext";

// 다크모드를 css가 아닌 javascript로 적용
// 유저가 최초 접속시 유저의 컴퓨터 야간모드 여부를 javascript로(window.matchMedia) 확인하여 적용하고 바로 localStorage에 저장
// 로직은 야간모드 여부를 보기 전에 사용자의 localStorage에 야간모드가 저장되어 있는지 확인 한 후에 없다면 야간모드 여부 활용하는 쪽으로
// 스위치는 context API 활용 혹은 props로 넘겨주기

function App() {
  return (
    <CombineContext>
      <Container />
      <Test />
    </CombineContext>
  );
}

export default App;
