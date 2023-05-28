import styled from "styled-components";

const BoardStyle = styled.div`
  width: 100%;
  min-height: 100vh;

  background-color: #444;

  position: relative;

  overflow-x: hidden;
  /* overflow-y: scroll; */
  overflow-y: auto;

  outline: 1px solid white;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    /* background-color: var(--icon-color); */
    background-color: black;
  }

  &::-webkit-scrollbar-track {
    /* background-color: transparent; */
    background-color: #888;
  }
`;

export default BoardStyle;
