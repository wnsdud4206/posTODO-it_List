import React, { useContext, useRef, useState } from "react";
import { FreePostContext } from "../../../context/FreePostContextProvider";
import PostStyle from "../../../style/board/post/PostStyle";
import Post from "./Post";

const FreePost = React.memo(({ at, color, size, title, text, x, y }) => {
  const { freePostArr, postIndex, savePosition } = useContext(FreePostContext);
  // scrollX는?, scrollX는 필요없고 top, left, right 쪽에 너무 넘어가지 않도록 해주기
  const postPositionRef = useRef({ firstX: null, firstY: null, scrollY: null });
  const [postPosition, setPostPosition] = useState({
    x,
    y,
  });

  // z-index
  const onMouseDown = () => postIndex(at);

  const onDragStart = ({ target: { parentElement }, pageX, pageY }) => {
    const scrollY = parentElement.scrollTop;
    const newPostPosition = { firstX: pageX, firstY: pageY, scrollY };
    postPositionRef.current = newPostPosition;
  };

  const onDrag = ({ target: { parentElement }, pageX, pageY }) => {
    if (pageX === 0 && pageY === 0) return; // good
    const { firstX, firstY, scrollY } = postPositionRef.current;
    const { scrollTop } = parentElement;

    const newPostPosition = {
      x: x + (pageX - firstX),
      y: y + (pageY - firstY) - (scrollY - scrollTop),
    };

    setPostPosition(newPostPosition);
  };
  // onDragOver?로 그룹묶기 같은 기능 추가

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDragEnd = () => {
    const newFreePostArr = freePostArr.map((f) => {
      return f.at === at ? { at: f.at, ...postPosition } : f;
    });

    savePosition(newFreePostArr);
  };

  return (
    <PostStyle
      className="postFree"
      color={color}
      size={size}
      style={{
        backgroundColor: color,
        height: `${size}px`,
        left: `${postPosition.x}px`,
        top: `${postPosition.y}px`,
      }}
      draggable="true"
      onMouseDown={onMouseDown}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <Post at={at} color={color} title={title} text={text} />
    </PostStyle>
  );
});

export default FreePost;
