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
  ({
    at,
    color,
    postHeight,
    textareaHeight,
    title,
    text,
    standardPosition,
  }) => {
    const {
      standardPostArr,
      // postAreaArr,
      newStandardPostArrRef,
      onReposition,
      postEnter,
      setPostEnter,
    } = useContext(StandardPostContext);
    // const copyPostAreaArrRef = useRef(postAreaArr);
    // useEffect(() => {
    //   copyPostAreaArrRef.current = postAreaArr;
    // }, [postAreaArr]);
    // const { postDetail, setPostDetail } = useContext(PostContext);
    const work = useRef();

    const firstPositionRef = useRef({
      positionX: null,
      positionY: null,
      firstX: null,
      firstY: null,
      scroll: null,
    });
    const postPositionChangingRef = useRef(false);
    // const [postPositionChanging, setPostPositionChanging] = useState(false);
    const [postPosition, setPostPosition] = useState({
      x: null,
      y: null,
    });

    const draggingRef = useRef(false);
    const [delayZIndex, setDelayZIndex] = useState(false);

    // post의 size(height)값을 어떻게 알아내야 하지..?
    // useEffect(() => {
    //   console.log(PostStyle);
    // }, []);

    const onMouseDown = ({ target: { parentElement }, pageX, pageY }) => {
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
      setPostEnter(at);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    };

    // useCallback
    const onMouseMove = ({ target: { parentElement }, pageX, pageY }) => {
      const { y } = standardPosition;
      // const { x } = parentElement.getBoundingClientRect();
      const { scrollTop } = parentElement.parentElement;
      const { positionX, positionY, firstX, firstY, scroll } =
        firstPositionRef.current;

      const newPostPosition = {
        lastX: positionX + pageX - firstX,
        lastY: y + pageY - firstY - (y - positionY) - (scroll - scrollTop),
      };

      setPostPosition(newPostPosition);

      if (!draggingRef.current) {
        if (
          (postPosition.x ?? 0) === newPostPosition.lastX &&
          (postPosition.y ?? 0) === newPostPosition.lastX
        )
          return;
        draggingRef.current = true;
      }

      // console.log(copyPostAreaArrRef.current);
      // const changePostAt = copyPostAreaArrRef.current.find(
      //   ({ min: { minX, minY }, max: { maxX, maxY } }) =>
      //     minX <= pageX - x &&
      //     pageX - x <= maxX &&
      //     minY <= pageY + scrollTop &&
      //     pageY + scrollTop <= maxY,
      // )?.at;
      // let time = Date.now();
      // if (time % 50 === 0) {
      // console.log("changePostAt", changePostAt, at);
      // console.log("postPositionChanging", postPositionChanging);
      // }
      // 여기가 문제인듯
      // console.log(changePostAt);
      // console.log(postPositionChangingRef.current);

      // onMouseEnter 혹은 onMouseOver로 따로 함수를 만들어!!

      // if (postPositionChangingRef.current) {
      //   if (postPositionChangingRef.current !== changePostAt) {
      //     clearTimeout(work.current);
      //     postPositionChangingRef.current = false;
      //     console.log("if work?");
      //     return;
      //   }
      //   console.log("if work2?");
      //   return;
      // }
      // if (changePostAt === at || !changePostAt) return;
      // if (!postPositionChangingRef.current) {
      //   // 다른 post에 진입하면 이벤트를 잠시 중단했다가 또 다시 다른 post에 진입히면 event가 실행되게끔, post가 다른 post의 위치로 가서 위치가 바뀌었을 때 마우스에 겹쳐지 다른 새로운 post 때문에 위치변경게 무한으로 실행됨... 해보면알것
      //   const newPostArr = standardPostArr.filter((post) => post.at !== at);
      //   const currentPost = standardPostArr.find((post) => post.at === at);
      //   const postIndex = standardPostArr.findIndex(
      //     (post) => post.at === changePostAt,
      //   );
      //   newPostArr.splice(postIndex, 0, currentPost);
      //   console.log(newPostArr);
      //   work.current = setTimeout(() => onReposition(newPostArr), 200);

      //   postPositionChangingRef.current = changePostAt;
      // }
    };

    // window.addEventListener()의 event 함수를 useCallback으로 해주고 디펜던시를 넣어주면 함수를 재생성해서 state의 바뀐 새로운 값도 가져올 수 있지 않을까?
    // 이게 되면 StandardPostContext의 postAreaArr은 필요 없을듯?
    // 이제 이걸 활용해야됨, 마우스 포인터 하나때문에 바꾼 로직이 너무 많다..
    const onMouseEnter = (e) => {
      if (postEnter === at || !postEnter) return;
      // console.log("mouseEnter", at, postEnter);
      // 다른 post에 진입하면 이벤트를 잠시 중단했다가 또 다시 다른 post에 진입히면 event가 실행되게끔, post가 다른 post의 위치로 가서 위치가 바뀌었을 때 마우스에 겹쳐지 다른 새로운 post 때문에 위치변경게 무한으로 실행됨... 해보면알것
      // mouseUp에서도 사용할 텐데 이걸 묶어서 사용하는 법을 찾아봐야할듯
      const newPostArr = standardPostArr.filter((post) => post.at !== at);
      const currentPost = standardPostArr.find((post) => post.at === at);
      const postIndex = standardPostArr.findIndex(
        (post) => post.at === postEnter,
      );
      newPostArr.splice(postIndex, 0, currentPost);
      newStandardPostArrRef.current = [...newPostArr];
      // console.log(newStandardPostArrRef.current);
      // onReposition의 로직을 바꿔야 겠는데.. google keep 참고해야겠다
      work.current = setTimeout(() => onReposition(newPostArr), 200);
    };

    const onMouseLeave = () => {
      clearTimeout(work.current);
    };

    // 이걸 useCallback으로 감싸서 addEventListener에 적용하면 state같은 값도 반영이 되려나?
    const onMouseUp = ({ target: { parentElement }, pageX, pageY }) => {
      // const { y } = standardPosition;
      // const { scrollTop } = parentElement.parentElement;
      // const { positionX, positionY, firstX, firstY, scroll } =
      //   firstPositionRef.current;

      // const newPostPosition = {
      //   lastX: positionX + pageX - firstX,
      //   lastY: y + pageY - firstY - (y - positionY) - (scroll - scrollTop),
      // };

      // 바뀐 standardPostArr가 반영이 되지 않는다... onMouseUp이 window에 적용된 evnet라서 그런듯(useRef도 그렇다는게 문제)
      // newStandardPostArrRef 를 standardPostContext에서 가져오니까 된다 ㅠㅠ, 이제 다시 post, textarea의 height값 관련해서 해야함
      const newStandardPostArr = newStandardPostArrRef.current.map(
        ({ at, x, y }) => {
          return { at, x, y };
        },
      );
      // standardPostArr에서 at, x, y만 남기고 다른 property는 지우고 localStorage에 넣기, 그리고 순서를 바꿀 때의 로직도 변경해줘야할듯(잘되나?)
      if (newStandardPostArr && newStandardPostArr !== 0) {
        window.localStorage.setItem(
          "standardMode",
          JSON.stringify(newStandardPostArr),
        );
      }
      clearTimeout(work.current);
      postPositionChangingRef.current = false;
      setPostPosition({
        x: null,
        y: null,
      });
      setPostEnter(false);
      setTimeout(() => {
        setDelayZIndex(false);
        draggingRef.current = false;
      }, 200);

      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };

    /* 뭔가 FraaBoard와 StandardBoard에 따로 이렇게 줘야된다는게 비효율적인 것 같은데 다른 방법은 없나? */

    return (
      <>
        <Post
          at={at}
          color={color}
          title={title}
          text={text}
          postPosition={postPosition}
          postHeight={postHeight}
          textareaHeight={textareaHeight} // 여기서 사용하지 않는 값들이 너무 많은데..
          standardPosition={standardPosition}
          draggingRef={draggingRef.current}
          delayZIndex={delayZIndex}
          onMouseDown={onMouseDown}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      </>
    );
  },
);

export default StandardPost;
