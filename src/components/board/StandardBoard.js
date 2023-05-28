import React, { useContext, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import BoardStyle from "../../style/board/BoardStyle";
import StandardPost from "./post/StandardPost";
import { StandardPostContext } from "../../context/StandardPostContextProvider";

/*
첫 번째 post의 width, height를 이용해서 다음 post들의 위치를 transform translate로 정해주고 반응형으로 브라우저가 커질 때 홀수번째 post마다(2n-1), 1, 4, 7,... 마다(3n-2) 이런식으로 줄을 나누는 기능도 해주어야 한다.
그리고 이 post들을 position absolute로 한다면 Board를 매 줄의 첫 번째 post들의 전체 높이 값을 구해서 적용시키면 될듯(post들을 position absolute로 할 필요가 없나?)
*/

const StandardBoardStyle = styled(BoardStyle)`
  display: flex;
  justify-content: center;

  div#responsiveBoard {
    /* margin-top: 48px; */
    /* 상단여백은 나중에 */

    /* height: 2000px; */

    transition: width 0.2s;

    position: relative;

    /* 임시 */
    ${({ boardSize }) => css`
      width: ${boardSize}px;
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
  // 여기에 바로 할당해주면 버벅임때문에 보기 좋지안음 -> useEffect 에서 불러와 연산 후 적용
  // const [standard, setStandard] = useState(
  //   JSON.parse(window.localStorage?.getItem("standardMode")) || [],
  // );
  // useEffect(() => console.log(standardPostArr), [standardPostArr]);
  const [standard, setStandard] = useState([]);

  useEffect(() => {
    if (standardPostArr.length === 0) return;
    const localPost = JSON.parse(window.localStorage.getItem("testPost"));
    // console.log(localPost);
    const newStandard = localPost.map((o) => {
      const findStandard = standardPostArr.find((n) => n.at === o.at);
      return { ...findStandard };
    });
    // console.log(newStandard);

    setStandard(newStandard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [standardPostArr]);

  return (
    <StandardBoardStyle className="standardBoard" boardSize={boardSize}>
      <div id="responsiveBoard">
        {standard !== 0 ? (
          standard.map(
            ({ at, color, postHeight, textareaHeight, title, text, x, y }) => (
              <StandardPost
                key={at}
                at={at}
                color={color}
                postHeight={postHeight}
                textareaHeight={textareaHeight}
                title={title}
                text={text}
                standardPosition={{ x, y }}
              />
            ),
          )
        ) : (
          <div>stadard nothing...</div>
        )}
      </div>
    </StandardBoardStyle>
  );
};

export default React.memo(StandardBoard);
