import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { PostContext } from "./context/PostContextProvider";
import { StandardPostContext } from "./context/StandardPostContextProvider";

const PostStyle = styled.div`
  /* background-color: #226633; */
  width: 240px;
  /* height: 300px; */

  // 임시
  border: 2px solid blue;
  box-sizing: border-box;

  position: absolute;

  &:active {
    z-index: 999;
  }

  &.postStandard {
    &:not(:active) {
      transition: border-color 0.2s, left 0.2s, top 0.2s;
    }
  }

  &.postFree {
    /* position: absolute; */
  }
`;

const StandardPost = ({ at, color, size, standardPosition }) => {
  const { standardPostArr, postAreaArr, onReposition } =
    useContext(StandardPostContext);
  const work = useRef();

  const firstPositionRef = useRef({
    positionX: null,
    positionY: null,
    firstX: null,
    firstY: null,
    scroll: null,
  });
  const [changing, setChanging] = useState(false);
  const [postPosition, setPostPosition] = useState({
    lastX: null,
    lastY: null,
  });

  const onDragStart = ({ target, pageX, pageY }) => {
    const { x, y } = standardPosition;
    const { scrollTop } = target.parentElement.parentElement;
    firstPositionRef.current = {
      positionX: x,
      positionY: y,
      firstX: pageX,
      firstY: pageY,
      scroll: scrollTop,
    };
  };

  const onDrag = useCallback(
    ({ target: { parentElement }, pageX, pageY }) => {
      if (pageX === 0 && pageY === 0) return; // good=
      const { y } = standardPosition;
      const { x } = parentElement.getBoundingClientRect();
      const { scrollTop } = parentElement.parentElement;
      const { positionX, positionY, firstX, firstY, scroll } =
        firstPositionRef.current;

      const newPostPosition = {
        lastX: positionX + pageX - firstX,
        lastY: y + pageY - firstY - (y - positionY) - (scroll - scrollTop),
      };
      setPostPosition(newPostPosition);

      const changePostAt = postAreaArr.find(
        ({ min: { minX, minY }, max: { maxX, maxY } }) =>
          minX <= pageX - x &&
          pageX - x <= maxX &&
          minY <= pageY + scrollTop &&
          pageY + scrollTop <= maxY,
      )?.at;

      if (changing) {
        if (changing !== changePostAt) {
          clearTimeout(work.current);
          setChanging(false);
          return;
        }
        return;
      }
      if (changePostAt === at || !changePostAt) return;
      if (!changing) {
        const newPostArr = standardPostArr.filter((post) => post.at !== at);
        const currentPost = standardPostArr.find((post) => post.at === at);
        const postIndex = standardPostArr.findIndex(
          (post) => post.at === changePostAt,
        );
        newPostArr.splice(postIndex, 0, currentPost);
        work.current = setTimeout(() => onReposition(newPostArr), 1000);
        setChanging(changePostAt);
      }
    },
    [
      at,
      changing,
      onReposition,
      postAreaArr,
      standardPosition,
      standardPostArr,
    ],
  );

  const onDragEnd = () => {
    window.localStorage.setItem("testPost", JSON.stringify(standardPostArr));
    clearTimeout(work.current);
    setChanging(false);
    setPostPosition({
      lastX: null,
      lastY: null,
    });
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <PostStyle
      className="postStandard"
      style={{
        backgroundColor: color,
        height: `${size}px`,
        left: `${postPosition.lastX || standardPosition.x}px`,
        top: `${postPosition.lastY || standardPosition.y}px`,
      }}
      draggable="true"
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      {color}, standard
    </PostStyle>
  );
};

// standard는 잡고 있을 때만 z-index가 높으면 되는데 free는 건드리자 마자 최상위 index가 되어야 하기 때문에 localStorage에서 따로 분류해야 할듯(그럼 standard 로직도 조금 달라질 듯), post 기본 정보 데이터, standard에 필요한 데이터, free에 필요한 데이터 이렇게 3개의 데이터로 나누어 줘야 할듯

const FreePost = ({ at, color, size }) => {
  const postRef = useRef();
  const postPositionRef = useRef({ firstX: null, firstY: null });
  const [postPosition, setPostPosition] = useState({
    lastX: 0,
    lastY: 0,
  });
  const { postIndex } = useContext(PostContext);

  // z-index
  const onMouseDown = () => {
    postIndex(at);
  };

  const onDragStart = (e) => {
    const { pageX, pageY } = e;
    postPositionRef.current = { firstX: pageX, firstY: pageY };

    // 선택한 post을 앞쪽에 두는 것을 z-index로 하지 말고, localStorage에서 불러와 배치를 바꾸고 다시 setItem으로 넣어주는 것이 좋을듯 - mouseDown?
  };

  // const onDrag = (e) => {};
  // onDragOver?로 그룹묶기 같은 기능 추가

  const onDragEnd = (e) => {
    const { target, pageX, pageY } = e;
    const { firstX, firstY } = postPositionRef.current;
    const { left, top } = target.getBoundingClientRect();
    const { scrollLeft, scrollTop } = target.parentElement;

    setPostPosition({
      lastX: left + scrollLeft + (pageX - firstX),
      lastY: top + scrollTop + (pageY - firstY),
    });
  };

  return (
    <PostStyle
      className="postFree"
      style={{
        backgroundColor: color,
        height: `${size}px`,
        left: `${postPosition.lastX}px`,
        top: `${postPosition.lastY}px`,
        // transform: `translate(${left}px, ${top}px)`,
        // zIndex: index,
      }}
      ref={postRef}
      draggable="true"
      onDragStart={onDragStart}
      // onDrag={onDrag}
      onDragEnd={onDragEnd}
      onMouseDown={onMouseDown}
    >
      {color}, free
      <button
        onClick={({ target }) => {
          // string
          console.log(target.closest(".postFree").style.transform);
          // console.log(target.closest(".postFree").style);
        }}
      >
        myTranslatePosition
      </button>
    </PostStyle>
  );
};

export { StandardPost, FreePost };
