import { useCallback, useContext, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import BoardStyle from "./BoardStyle";
import { StandardPost } from "./Post";
import { StandardPostContext } from "./context/StandardPostContextProvider";

/*
첫 번째 post의 width, height를 이용해서 다음 post들의 위치를 transform translate로 정해주고 반응형으로 브라우저가 커질 때 홀수번째 post마다(2n-1), 1, 4, 7,... 마다(3n-2) 이런식으로 줄을 나누는 기능도 해주어야 한다.
그리고 이 post들을 position absolute로 한다면 Board를 매 줄의 첫 번째 post들의 전체 높이 값을 구해서 적용시키면 될듯(post들을 position absolute로 할 필요가 없나?)
*/

const StandardBoardStyle = styled(BoardStyle)`
  display: flex;
  justify-content: center;

  div#responsiveBoard {
    transition: width 0.2s;

    position: relative;

    outline: 1px solid white;

    /* 임시 */
    ${({ size }) => css`
      width: ${size}px;
      /* @media (max-width: ${size - 100}px) {
      background-color: powderblue;
    } */
    `}
  }

  /* 788px */
  @media (max-width: 800px) {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

// component를 따로 만들 필요가 없나?, 그냥 StandardBoardStyle(+ FreeBoardStyle)을 바로 container에 넣고 사용해 될거 같은데

const StandardBoard = () => {
  const { boardSize, standardPostArr } = useContext(StandardPostContext);
  const [testPost, setTestPost] = useState(
    JSON.parse(window.localStorage?.getItem("testPost")) || [],
  );

  useEffect(() => {
    if (standardPostArr.length === 0) return;
    const newTestPost = testPost.map((t) => {
      const { standardPosition } = standardPostArr.find((s) => s.at === t.at);
      return { ...t, standardPosition };
    });
    setTestPost(newTestPost);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [standardPostArr]);

  return (
    <StandardBoardStyle className="standardBoard" size={boardSize}>
      <div id="responsiveBoard">
        {testPost !== 0 ? (
          testPost.map(({ at, color, size, standardPosition }) => (
            <StandardPost
              key={at}
              at={at}
              color={color}
              size={size}
              standardPosition={standardPosition}
            />
          ))
        ) : (
          <div>nothing...</div>
        )}
      </div>
    </StandardBoardStyle>
  );
};

export default StandardBoard;
