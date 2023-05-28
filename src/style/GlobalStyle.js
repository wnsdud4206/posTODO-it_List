import { createGlobalStyle, css } from "styled-components";

const GlobalStyle = createGlobalStyle`
${({ isDark }) =>
  isDark
    ? css`
        :root {
          /* 임시 */
          --icon-color: #00acee;
          --font-color: white;
          --background-color: #222;
          --border-color: rgb(98, 98, 98);
        }
      `
    : css`
        :root {
          --icon-color: #00acee;
          --font-color: black;
          --background-color: white;
          --border-color: rgb(198, 198, 198);
        }
      `}

  html, body, div#root {
    /* min-height: 100%; */
    height: 100%;
    
    scroll-behavior: smooth;

    margin: 0;
    padding: 0;


  }

  body {
    /* color: var(--sub-color); */

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      /* background-color: var(--icon-color); */
      background-color: #444;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    div#root {
      /* display: flex;
      justify-content: center; */
      
      /* background-color: var(--background-color); */
      
      /* width: 100%; */

      /* position: relative; */

      /* overflow-x: hidden; */

      /* transition: background-color .2s; */
      
      /* @media screen and (max-width: 500px) {
        width: 100%;
        padding: 0 8px;
        box-sizing: border-box;
      } */
    }
  }
`;

export default GlobalStyle;
