
import styled, { css } from "styled-components";

const BtnGroupStyle = css`
  display: flex;

  width: 152px;

  background-color: var(--background-color);

  button {
    display: flex;
    align-items: center;
    justify-content: center;

    outline: none;
    border: none;
    background: none;
    padding: 0;

    /* 임시 */
    /* background-color: white; */

    /* width: 38px; */
    flex-basis: 38px;
    height: 38px;

    border-radius: 50%;

    transition: background-color 0.2s;

    cursor: pointer;

    /* outline: 1px solid red; */

    svg {
      width: 24px;
      height: 24px;

      color: var(--font-color);

      transition: transform 0.2s;

      &.opaquely {
        opacity: 0.7;
      }
    }

    &:hover {
      background-color: rgba(150, 150, 150, .3);

      svg {
        transform: scale(1.1, 1.1);
      }
    }
  }
`;

const SideMenuStyle = styled.aside`
  display: flex;
  justify-content: flex-end;

  height: 100vh;
  outline: 1px solid red;

  background-color: #888;

  position: relative;

  z-index: 9999;

  transition: width 0.2s;

  div#menuContainer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 32px;

    width: 240px;

    box-sizing: border-box;

    background-color: var(--background-color);

    // sideMenu를 닫았을 때 즐겨찾기 목록이 보여야하는데 이 hidden을 지우거나 따로 만들어 연결된 것처럼 이어 붙이거나 해야할듯
    overflow-x: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      /* background-color: var(--icon-color); */
      background-color: black;
    }

    &::-webkit-scrollbar-track {
      background-color: white;
    }

    h1#logo {
      width: 100%;
      outline: 1px solid black;
      text-align: center;
      white-space: nowrap;

      color: var(--font-color);

      font-size: 2.4rem;

      margin: 0;
    }

    div#sideBtnGroup {
      ${BtnGroupStyle}

      justify-content: center;
      gap: 32px;
      width: 100%;
      outline: 1px solid red;

      button {
        outline: 1px solid black;
      }
    }

    div#postGroupList {
      width: 100%;
      /* outline: 1px solid red; */

      /* #groupList, #favorite */
      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        color: var(--font-color);

        outline: 1px solid red;

        li {
          white-space: nowrap;

          padding: 16px 12px;

          outline: 1px solid blue;
        }

        &#favorite {
          /* ul태그에 직접적으로 넣은 text는 padding이 할당되지 않음, 뭔가 묶어줘야 하거나 다른 방법을 알아봐야할듯 */
          padding: 16px 12px;

          li {
            text-align: right;
          }
        }

        &#groupList {
          li.group {
            ul.postList {
              li.post {
              }
            }
          }
        }
      }
    }

    div#trash {
      width: 100%;
      outline: 1px solid red;
    }

    footer {
      width: 100%;
      outline: 1px solid red;
    }
  }

  nav#menuBtnContainer {
    width: 38px;

    /* border-top-right-radius: 19px;
    border-bottom-right-radius: 19px; */
    /* border-top-right-radius: 4px; */
    border-bottom-right-radius: 4px;

    position: absolute;
    right: -40px;
    /* right: -116px; */
    /* left: 0; */

    /* transform: translateX(0); */

    transition: width 0.2s, right 0.2s;

    overflow: hidden;

    outline: 1px solid blue;

    div#quickBtnGroup {
      ${BtnGroupStyle}

      /* menu button */
      button#menuBtn {
        /* background-color: white; */

        div#rotateLoading {
          div#dotBox {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;

            width: 100%;
            height: 100%;

            pointer-events: none;

            div.dot {
              background-color: var(--font-color);

              width: 4px;
              height: 4px;

              border-radius: 2px;

              transition: width 0.2s;
            }
          }
        }

        &:hover > div#rotateLoading > div#dotBox > div.dot {
          width: 22px;
        }
      }

      /* add button */
      button.addBtn {
      }

      /* board mode button */
      button.BoardModeBtn {
      }

      /* dark mode button */
      button.DarkModeBtn {
      }
    }

    &.quickMenu:hover {
      width: 152px;
      right: -154px;
      transition: width 0.2s 0.5s, right 0.2s 0.5s;
    }
  }
`;

export default SideMenuStyle;