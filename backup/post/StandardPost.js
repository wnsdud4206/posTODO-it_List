import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { PostContext } from "../../../context/PostContextProvider";
import { StandardPostContext } from "../../../context/StandardPostContextProvider";
import PostStyle, {
  PostBackgroundStyle,
} from "../../../style/board/post/PostStyle";
import Post from "./Post";

const StandardPost = React.memo(
  ({ at, color, size, title, text, standardPosition }) => {
    const { standardPostArr, postAreaArr, onReposition } =
      useContext(StandardPostContext);
    const { postDetail, setPostDetail } = useContext(PostContext);
    const work = useRef();

    const firstPositionRef = useRef({
      positionX: null,
      positionY: null,
      firstX: null,
      firstY: null,
      scroll: null,
    });
    const [postPositionChanging, setPostPositionChanging] = useState(false);
    const [postPosition, setPostPosition] = useState({
      lastX: null,
      lastY: null,
    });
    const [delayZIndex, setDelayZIndex] = useState(false);

    // post의 size(height)값을 어떻게 알아내야 하지..?
    // useEffect(() => {
    //   console.log(PostStyle);
    // }, []);

    const onDragStart = ({ target: { parentElement }, pageX, pageY }) => {
      const { x, y } = standardPosition;
      const { scrollTop } = parentElement.parentElement;
      firstPositionRef.current = {
        positionX: x,
        positionY: y,
        firstX: pageX,
        firstY: pageY,
        scroll: scrollTop,
      };
      setDelayZIndex(true);
    };

    // useCallback
    const onDrag = useCallback(
      ({ target: { parentElement }, pageX, pageY }) => {
        if (pageX === 0 && pageY === 0) return; // good
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

        if (postPositionChanging) {
          if (postPositionChanging !== changePostAt) {
            clearTimeout(work.current);
            setPostPositionChanging(false);
            return;
          }
          return;
        }
        if (changePostAt === at || !changePostAt) return;
        if (!postPositionChanging) {
          // 다른 post에 진입하면 이벤트를 잠시 중단했다가 또 다시 다른 post에 진입히면 event가 실행되게끔, post가 다른 post의 위치로 가서 위치가 바뀌었을 때 마우스에 겹쳐지 다른 새로운 post 때문에 위치변경게 무한으로 실행됨... 해보면알것
          const newPostArr = standardPostArr.filter((post) => post.at !== at);
          const currentPost = standardPostArr.find((post) => post.at === at);
          const postIndex = standardPostArr.findIndex(
            (post) => post.at === changePostAt,
          );
          newPostArr.splice(postIndex, 0, currentPost);
          work.current = setTimeout(() => onReposition(newPostArr), 200);
          setPostPositionChanging(changePostAt);
        }
      },
      [
        at,
        postPositionChanging,
        onReposition,
        postAreaArr,
        standardPosition,
        standardPostArr,
      ],
    );

    const onDragOver = (e) => {
      e.preventDefault();
    };

    const onDragEnd = () => {
      const newStandardPostArr = standardPostArr.map(({ at, x, y }) => {
        return { at, x, y };
      });
      // standardPostArr에서 at, x, y만 남기고 다른 property는 지우고 localStorage에 넣기, 그리고 순서를 바꿀 때의 로직도 변경해줘야할듯(잘되나?)
      window.localStorage.setItem(
        "standardMode",
        JSON.stringify(newStandardPostArr),
      );
      clearTimeout(work.current);
      setPostPositionChanging(false);
      setPostPosition({
        lastX: null,
        lastY: null,
      });
      setTimeout(() => setDelayZIndex(false), 200);
    };

    // 이런방식 또는 현재 활성화된 post가 있고 다른 post들은 자신의 at과 state에 저장된 활성화된 at을 비교하여 다르고 state가 false가 아니라면 onClick을 방지하게 끔 하는 방식중 선택(첫 번째는 바로바로 다른 post 활성화, 두 번째는 활성화된 post를 제외하고 클릭했을 때 현재 post를 비활성화하고 그제서야 다른 post를 클릭했을 때 활성화 해주는 방식)
    // 첫 번째 방식은 서로 겹쳐질 때 z-index 변환이 부자연스러움
    // 문제: input 요소에서 마우스로 드래그하고 post 밖에서 mouseup을 했을 때 detail이 비활성화 되는 문제, 배경을 만들어 그 배경을 클릭하면 비활성화 되게끔 해야될듯
    // mouseDown, mouseUp으로 나눠야하나?
    // freePost에도 적용하기
    const selectedRef = useRef();
    const isPostElRef = useRef(false);
    const [showPostBackground, setShowPostBackground] = useState(false);
    const closePostDown = ({ target }) => {
      const postEl = target.closest(".postStandard");
      isPostElRef.current = postEl === selectedRef.current;
    };
    const closePostUp = ({ target }) => {
      if (isPostElRef.current) return;
      const postEl = target.closest(".postStandard");
      if (selectedRef.current !== postEl) {
        setPostDetail(false);

        window.removeEventListener("mousedown", closePostDown);
        window.removeEventListener("mouseup", closePostUp);
        setTimeout(() => {
          setDelayZIndex(false);
          setShowPostBackground(false);
        }, 200); // good
      }
    };
    const onClick = (e) => {
      // detail이 false 이 경우에만 한 번 활성화 되게끔
      setPostDetail(at);
      setDelayZIndex(true);
      setShowPostBackground(true);
      window.addEventListener("mousedown", closePostDown);
      window.addEventListener("mouseup", closePostUp);
    };

    /* 뭔가 FraaBoard와 StandardBoard에 따로 이렇게 줘야된다는게 비효율적인 것 같은데 다른 방법은 없나? */
    return (
      <>
        {showPostBackground && (
          <PostBackgroundStyle className={!postDetail ? "hide" : "show"} />
        )}
        <PostStyle
          className={`postStandard ${delayZIndex ? "selected" : ""}`}
          color={color}
          size={size}
          delayZIndex={delayZIndex}
          ref={selectedRef}
          style={{
            left:
              postDetail === at
                ? "calc(50% - 120px)"
                : `${postPosition.lastX || standardPosition.x}px`,
            top:
              postDetail === at
                ? `calc(50% - ${size / 2}px)`
                : `${postPosition.lastY || standardPosition.y}px`,
            // zIndex: delayZIndex ? 9999 : "auto",
          }}
          draggable={!postDetail}
          onDragStart={!postDetail ? onDragStart : null}
          onDrag={!postDetail ? onDrag : null}
          onDragEnd={!postDetail ? onDragEnd : null}
          onDragOver={!postDetail ? onDragOver : null}
          onClick={!postDetail ? onClick : null}
        >
          <Post at={at} color={color} title={title} text={text} />
        </PostStyle>
      </>
    );
  },
);

export default StandardPost;
