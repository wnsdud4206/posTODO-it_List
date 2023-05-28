import React, { useContext, useRef, useState } from "react";
import { FreePostContext } from "../../../context/FreePostContextProvider";
import Post from "./Post";

const FreePost = React.memo(
  ({ at, color, postHeight, textareaHeight, title, text, x, y }) => {
    const { saveIndexAndPosition } = useContext(FreePostContext);
    // scrollX는?, scrollX는 필요없고 top, left, right 쪽에 너무 넘어가지 않도록 해주기
    const postPositionRef = useRef({
      firstX: null,
      firstY: null,
      scrollY: null,
    });
    const [postPosition, setPostPosition] = useState({
      x,
      y,
    });

    const draggingRef = useRef(false);

    const [delayZIndex, setDelayZIndex] = useState(false);

    // freeMode에서 왜케 버벅이지?

    const onMouseDown = ({ target: { parentElement }, pageX, pageY }) => {
      const scrollY = parentElement.scrollTop;
      const newPostPosition = { firstX: pageX, firstY: pageY, scrollY };
      postPositionRef.current = newPostPosition;
      setDelayZIndex(true);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    };

    // onMouseDown에서 onMouseMove를 post가 아닌 window에 주고 onMouseUp에서 window의 onMouseMove의 event remove해주면 될듯(왜냐면 이동중에 마우스를 빠르게 움직이게 돼서 요소를 벗어나게 되면 onMouseMove event가 작동하지 않음)
    const onMouseMove = ({ target, pageX, pageY }) => {
      // if (pageX === 0 && pageY === 0) return; // good
      const { firstX, firstY, scrollY } = postPositionRef.current;
      const { scrollTop } = target.parentElement;

      const newPostPosition = {
        x: x + (pageX - firstX),
        y: y + (pageY - firstY) - (scrollY - scrollTop),
      };

      setPostPosition(newPostPosition);

      if (!draggingRef.current) {
        if (
          postPosition.x === newPostPosition.x &&
          postPosition.y === newPostPosition.y
        )
          return;
        draggingRef.current = true;
      }
    };

    const onMouseUp = ({ target, pageX, pageY }) => {
      const { firstX, firstY, scrollY } = postPositionRef.current;
      const { scrollTop } = target.parentElement;
      const newPostPosition = {
        x: x + (pageX - firstX),
        y: y + (pageY - firstY) - (scrollY - scrollTop),
      };
      // setPostPosition(newPostPosition);
      draggingRef.current && saveIndexAndPosition(at, newPostPosition);
      setTimeout(() => {
        draggingRef.current = false;
      }, 200);
      setTimeout(() => {
        setDelayZIndex(false);
        // !draggingRef.current && saveIndexAndPosition(at, newPostPosition);
      }, 200);
      // }, 750);
      // window.localStorage.setItem("freeMode", JSON.stringify(freePostArr));
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };

    return (
      <Post
        at={at}
        color={color}
        title={title}
        text={text}
        postPosition={postPosition}
        postHeight={postHeight}
        textareaHeight={textareaHeight} // 여기서 사용하지 않는 값들이 너무 많은데..
        draggingRef={draggingRef.current}
        delayZIndex={delayZIndex}
        onMouseDown={onMouseDown}
      />
    );
  },
);

export default FreePost;
