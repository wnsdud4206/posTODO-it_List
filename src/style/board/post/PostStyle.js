import styled, { css } from "styled-components";
import { PostContentStyle } from "../../../components/board/post/Post";
import { darken } from "polished";

export const PostBackgroundStyle = styled.div`
  & {
    width: 100%;
    height: 100%;
    // 배경 색상을 현재 post의 색상계열로?
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9998;

    user-select: none; // drag 방지?

    &.show {
      animation: show 0.2s;
    }
    &.hide {
      animation: hide 0.2s;
    }
    @keyframes show {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes hide {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  }
`;

const PostStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  /* background-color: #226633; */
  /* width: 240px; */
  /* min-height: 300px; */
  /* height: ${({ postHeight }) => postHeight}px; */
  /* height: fit-content; */

  background-color: ${({ color }) => color || "darkgray"};
  border: 2px solid ${({ color }) => (color ? darken(0.1, color) : "darkgray")};

  border-radius: 6px;
  padding: 8px;
  box-sizing: border-box;

  position: absolute;

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  opacity: ${({ isLoading }) => (isLoading ? 1 : 0)};

  &:hover {
    border-color: ${({ color }) => darken(0.3, color)};
  }

  &:active {
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  }

  /* transition: height 0.2s; */

  &:not(:active) {
    // transition height가 안먹네
    transition: opacity .2s, box-shadow 0.2s, border 0.2s, height 0.2s,
      width 0.2s, left 0.2s, top 0.2s;
  }

  &.postStandard {
    /* &:not(:active) {
      transition: left 0.2s, top 0.2s;
    } */
    &:active {
      pointer-events: ${({ eventNone }) => eventNone && "none"};
      /* pointer-events: none; */
    }
    /* &:not(:active) {
      transition: box-shadow 0.2s, left 0.2s, top 0.2s;
    } */
  }

  &.postFree {
    &:active {
      /* z-index: 9999; */
    }
    /* position: absolute; */
  }
  &:not(.selected) {
    // 임시
    /* max-height: 600px; */
    // transition height가 안되는 이유는 기본 height의 값이 지정되지 않고 있기 때문인듯?
  }
  &.selected {
    /* &:not(:active) {
      transition: width 0.2s, left 0.2s, top 0.2s;
    } */
    border-color: ${({ color }) => darken(0.3, color)};
    /* max-height: 90vh; */

    ${({ delayZIndex }) =>
      delayZIndex &&
      css`
        z-index: 9999;
      `}
  }

  ${PostContentStyle}
`;

export default PostStyle;
