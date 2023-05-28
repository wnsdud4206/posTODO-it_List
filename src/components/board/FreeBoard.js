import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import BoardStyle from "../../style/board/BoardStyle";
import FreePost from "./post/FreePost";
import { FreePostContext } from "../../context/FreePostContextProvider";

const FreeBoardStyle = styled(BoardStyle)`
  position: absolute;
  top: 0;
  left: 0;
`;

const FreeBoard = () => {
  const { freePostArr } = useContext(FreePostContext);
  const [free, setFree] = useState([]);

  useEffect(() => {
    if (freePostArr.length === 0) return;
    // const localFree = JSON.parse(window.localStorage.getItem("freeMode"));
    const localFree = [...freePostArr];
    const localPost = JSON.parse(window.localStorage.getItem("testPost"));
    const newFree = localFree.map((f) => {
      const findArr = localPost.find((t) => t.at === f.at);
      return { ...f, ...findArr };
    });
    setFree(newFree);
  }, [freePostArr]);

  return (
    <FreeBoardStyle className="freeBoard">
      {free !== 0 ? (
        free.map(
          ({ at, color, postHeight, textareaHeight, title, text, x, y }) => (
            <FreePost
              key={at}
              at={at}
              color={color}
              postHeight={postHeight}
              textareaHeight={textareaHeight}
              title={title}
              text={text}
              x={x}
              y={y}
            />
          ),
        )
      ) : (
        <div>free nothing...</div>
      )}
    </FreeBoardStyle>
  );
};

export default React.memo(FreeBoard);
