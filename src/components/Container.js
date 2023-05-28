import { useContext, useEffect } from "react";
import styled from "styled-components";
import SideMenu from "./sideMenu/SideMenu";
import StandardBoard from "./board/StandardBoard";
import FreeBoard from "./board/FreeBoard";
import { BoardModeContext } from "../context/BoardModeContextProvider";

const ContainerStyle = styled.div`
  display: flex;

  // 임시
  height: 100vh;

  /* width: 100%; */

  background-color: #222;

  position: relative;

  overflow: hidden;

  & > div {
    &.standardBoard {
    }

    &.freeBorad {
      width: 100%;
    }
  }
`;

const Container = () => {
  const { isBoardMode } = useContext(BoardModeContext);

  return (
    <ContainerStyle>
      <SideMenu />

      {isBoardMode ? <FreeBoard /> : <StandardBoard />}
    </ContainerStyle>
  );
};

export default Container;
