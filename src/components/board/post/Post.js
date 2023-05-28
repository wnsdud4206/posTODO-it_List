import {
  faLayerGroup,
  faPalette,
  faStar,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as reFaStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import { css } from "styled-components";
import { PostContext } from "../../../context/PostContextProvider";
import { StandardPostContext } from "../../../context/StandardPostContextProvider";
import PostStyle, {
  PostBackgroundStyle,
} from "../../../style/board/post/PostStyle";
import { BoardModeContext } from "../../../context/BoardModeContextProvider";
import { FreePostContext } from "../../../context/FreePostContextProvider";

export const PostContentStyle = css`
  div.postHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;

    outline: 1px solid red;

    // title, text 폰트도 바꾸기
    input.postTitle {
      background: none;
      outline: none;
      border: none;

      width: 100%;

      padding: 6px 0;
    }
    span.postTitle {
    }
  }

  // scrollBox
  div.postContent {
    // 임시
    // max-height를 textarea에 줘야하는듯?
    /* max-height: 500px; */
    height: 100%;

    /* overflow-y: ${({ delayZIndex }) => (delayZIndex ? "auto" : "hidden")}; */
    overflow-y: ${({ scrollToggle }) => (scrollToggle ? "scroll" : "hidden")};

    outline: 1px solid blue;

    *.postText {
      width: 100%;
      /* 임시 */
      /* min-height: 250px; */
    }

    /* 내용의 크기에 맞춰 textarea의 height 크기도 맞춰지게끔 */
    textarea.postText {
      display: block; // inline이나 inline-block으로 하면 알 수 없는 하단 여백이 생김
      border: none;
      background: none;
      outline: none;
      resize: none;

      /* min-height: 216px; */
      height: ${({ textareaHeight }) => textareaHeight}px;
      /* min-height: ${({ textareaHeight }) => textareaHeight}px; */

      /* padding: 10px 0 0 0; */
      padding: 0;

      outline: 1px solid black;
    }
    p.postText {
      white-space: pre;
      margin: 0;
      padding: 16px 0;
      box-sizing: border-box;
    }
  }

  div.postFooter {
    display: flex;
    align-items: center;
    justify-content: space-between;

    span.postAt {
      white-space: nowrap;
      font-size: 0.9rem;
      color: #444;

      outline: 1px solid red;
    }
    nav.postMenu {
      outline: 1px solid black;

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: nowrap;

        li {
          button {
            outline: none;
            background: none;
            border: none;

            cursor: pointer;

            svg {
            }
          }
        }
      }
    }
  }
`;

// 최적화(꼭보기) - https://uzihoon.com/post/ef453fd0-ab14-11ea-98ac-61734eebc216

/*
title         color, delete

at

text

modify at?    groupTags..., groupOption

- 아직 jsx에 반영 안됨

post가 이동할 때 잡을 공간은 어떻게?
post를 한 번 클릭하면 해당 post가 중앙으로 커지면서 위치하고 수정할 수 있도록(그럼 modify 버튼은 굳이 없어도?)
post를 수정할 때는 onClick으로 할 때 post를 이동시키를 로직과 충돌하지는 않을까?

모든 내용 요소에 drag 반응함(문자열 drag 안됨)
*/

const Post = ({
  at,
  color,
  title,
  text,
  postPosition,
  postHeight,
  textareaHeight,
  standardPosition,
  draggingRef,
  delayZIndex,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { isBoardMode } = useContext(BoardModeContext);
  const { postDetail, setPostDetail } = useContext(PostContext);
  const { standardPostArr, onReposition } = useContext(StandardPostContext);
  const { freePostArr, setFreePostArr, saveIndexAndPosition } =
    useContext(FreePostContext);
  const [isLoading, setIsLoading] = useState(false);
  const [postFlexibleHeight, setPostFlexibleHeight] = useState(postHeight);
  const [content, setContent] = useState({
    title: title ?? "",
    text: text ?? "",
  });
  const [scrollToggle, setScrollToggle] = useState(
    textareaHeight + 84 > Math.floor(window.innerHeight * 0.9),
  );
  const autoSaveRef = useRef();
  const textareaRef = useRef();
  const selectedRef = useRef();
  const isPostElRef = useRef(false);
  const date = `${new Date(at).getFullYear()}년 ${
    new Date(at).getMonth() + 1
  }월 ${new Date(at).getDate()}일`;

  // useEffect(() => {
  //   console.group(at);
  //   console.log(draggingRef.current);
  //   console.groupEnd(at);
  // }, []);

  useEffect(() => {
    // 처음 랜더링할 때 600px보다 height가 긴 post가 번쩍 하면서 크기가 줄어들고 scroll도 있었다가 없어지는 현상이 생김..
    // 지금 이 로직이 느려서 그런거임, 결과에 상관없이 로직이 끝나면 isLoading state가 true가 되도록 해야한다.(한 번만?)
    // console.log(postHeight, textareaHeight);
    let isScrollToggle;
    let height;
    if (postDetail === at) {
      // console.log(
      //   textareaHeight,
      //   postHeight,
      //   Math.floor(window.innerHeight * 0.9),
      // );
      isScrollToggle =
        textareaHeight + 84 > Math.floor(window.innerHeight * 0.9);
      height = `${postHeight}px`;
    } else if (postDetail !== at) {
      isScrollToggle = false;
      const setHeight =
        selectedRef.current.style.height.replace("px", "") || postHeight;
      height = setHeight > 600 ? "600px" : `${setHeight}px`;
    }
    setScrollToggle(isScrollToggle);
    selectedRef.current.style.height = height;
    // console.log(postDetail);
    setIsLoading(true);
  }, [at, postDetail, postHeight, textareaHeight]);

  // 참고할 것: https://blogpack.tistory.com/866
  // 참고해볼 것: https://www.daleseo.com/css-width/
  const handleResizeHeight = () => {
    // post의 height와 textarea의 height가 저장되도록 하고 추가로 수정할 때 textarea 혹은 post가 늘어남에 따라 y포지션도 바뀌게끔 해야함
    // 아래와 같은 로직은 뭔가 안될 것 같은 느낌적인 느낌

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${
      textareaRef.current.scrollHeight > 216
        ? textareaRef.current.scrollHeight
        : 216
    }px`;
    let selectedHeight;
    if (
      (textareaRef.current.scrollHeight > 216
        ? textareaRef.current.scrollHeight
        : 216) +
        84 >
      Math.floor(window.innerHeight * 0.9)
    ) {
      selectedHeight = Math.floor(window.innerHeight * 0.9);
      setScrollToggle(true);
    } else {
      selectedHeight =
        (textareaRef.current.scrollHeight > 216
          ? textareaRef.current.scrollHeight
          : 216) + 84;
      setScrollToggle(false);
    }
    selectedRef.current.style.height = "auto";
    selectedRef.current.style.height = `${selectedHeight}px`;
    setPostFlexibleHeight(selectedHeight);
  };

  // 매번 text가 바뀌었다고 localStorage에 저장하는 것이 아니라 타이핑 후 일정 시간(1초정도?)동안 사용자의 입력이 없으면 localStorage에 저장하게끔
  // clearTimeout, setTimeout(useRef에 저장) -> clearTimeout 이후 바로 setTimeout 실행, 일정 시간 안에 다시 타이필을 하면
  // size도 추가로 저장하기
  const positionAndLocalStorageUpdateRef = useRef({});
  const onChange = ({ target: { name, value } }) => {
    clearTimeout(autoSaveRef.current);
    name === "text" && handleResizeHeight();
    const newContent = {
      ...content,
      [name]: value,
    };
    setContent(newContent);

    // console.log(
    //   "change",
    //   textareaRef.current.scrollHeight,
    //   heightObj.textareaHeight,   // ref보다 반응 느림
    // );
    // console.log("change", selectedRef.current.offsetHeight);
    const localPost = JSON.parse(window.localStorage.getItem("testPost"));
    const positionAndLocalStorageUpdate = {
      ...newContent,
      postHeight: textareaRef.current.scrollHeight + 84,
      textareaHeight: textareaRef.current.scrollHeight,
    };
    positionAndLocalStorageUpdateRef.current = {
      ...positionAndLocalStorageUpdate,
    };

    autoSaveRef.current = setTimeout(() => {
      const newPost = localPost.map((p) =>
        p.at === at ? { ...p, ...positionAndLocalStorageUpdate } : p,
      );
      window.localStorage.setItem("testPost", JSON.stringify(newPost));
    }, 1000);
  };

  // button test
  // 고정 기능도 만들기?, standard의 경우 고정된 post만을 제외하고 위치가 바뀜, free의 경우 고정을 풀지 않는 이상 움직여지지 않음
  const onColor = (e) => {
    e.stopPropagation(); // standardPost의 onClick 방지
    console.log("color");
  };
  const onFavorites = (e) => {
    e.stopPropagation(); // standardPost의 onClick 방지
    console.log("onFavorites");
  };
  const onGroup = (e) => {
    e.stopPropagation(); // standardPost의 onClick 방지
    console.log("group");
  };
  const onDelete = (e) => {
    // window mouseUp event처럼 postDetail 등 비활성화
    e.stopPropagation(); // standardPost의 onClick 방지
    console.log("delete", at);
    const localPost = JSON.parse(window.localStorage.getItem("testPost"));
    const localStandard = JSON.parse(
      window.localStorage.getItem("standardMode"),
    );
    const localFree = JSON.parse(window.localStorage.getItem("freeMode"));
    const postFilter = localPost.filter((p) => p.at !== at);
    const standardFilter = localStandard.filter((s) => s.at !== at);
    const freeFilter = localFree.filter((f) => f.at !== at);

    // console.log("postFilter", postFilter);
    // console.log("standardFilter", standardFilter);
    // console.log("freeFilter", freeFilter);

    // window.localStorage.setItem("testPost", JSON.stringify(postFilter));
    // window.localStorage.setItem("standardMode", JSON.stringify(standardFilter));
    const newStandardPostArr = standardFilter.map((s) => {
      const findPost = postFilter.find((p) => p.at === s.at);
      return { ...findPost, ...s };
    });
    console.log("newStandardPostArr", newStandardPostArr);
    // ***에러남...........
    onReposition(newStandardPostArr);
    // window.localStorage.setItem("freeMode", JSON.stringify(freeFilter));
    // setFreePostArr(freeFilter);
    console.log("doit?");
    // 리랜더링도 해야되려나? 아니면 자동으로 지워진게 적용되려나?
  };

  const [showPostBackground, setShowPostBackground] = useState(false);
  const closePostDown = ({ target }) => {
    // console.log("window mouseDown");
    const postEl = target.closest(".postStandard");
    isPostElRef.current = postEl === selectedRef.current;
  };
  const closePostUp = ({ target }) => {
    // console.log("window mouseUp");
    if (isPostElRef.current) return;
    const postEl = target.closest(".postStandard");
    if (selectedRef.current !== postEl) {
      // console.log("window mouseUP doit");
      setPostDetail(false);

      const localPost = JSON.parse(window.localStorage.getItem("testPost"));
      if (!isBoardMode) {
        const newStandardPost = standardPostArr.map((s) => {
          const findPost = localPost.find((l) => s.at === l.at);
          return findPost.at === at
            ? { ...findPost, ...s, ...positionAndLocalStorageUpdateRef.current }
            : { ...findPost, ...s };
        });
        onReposition(newStandardPost);
      }

      window.removeEventListener("mousedown", closePostDown);
      window.removeEventListener("mouseup", closePostUp);
      setTimeout(() => {
        isBoardMode && saveIndexAndPosition(at, postPosition);
        setShowPostBackground(false);
      }, 200); // good
    }
  };
  // freePost에서 z-index? 혹은 객체에서의 index가 맨 뒤에 있지 않은 post를 detail 활성화 할 때 가운대로 이동하는 게 순간이동이 되어버림
  const onClick = (e) => {
    // jsx의 property에서 사용할 수 없음, 최신화가 안되기 때문
    if (draggingRef) return;
    // console.log("onClick");
    // detail이 false 이 경우에만 한 번 활성화 되게끔
    setPostDetail(at);
    setShowPostBackground(true);
    // console.log(textareaRef.current);
    window.addEventListener("mousedown", closePostDown);
    window.addEventListener("mouseup", closePostUp);
  };

  // 드래그 잔상 방지? 드래그 효과 - https://developer.mozilla.org/ko/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations
  // drop event? - https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect
  // drop 되는 쪽에(배경?) 방지를 해줘야하나?
  // dragOver 때문에? dragOver는 drop될 대상에게 줘야하는 event인데 post에 직접 주어서 그런가? 그렇다기엔 dragOver event에 e.preventDefault();를 했을 때 마우스 포인터가 달라짐 - https://inpa.tistory.com/entry/%EB%93%9C%EB%9E%98%EA%B7%B8-%EC%95%A4-%EB%93%9C%EB%A1%AD-Drag-Drop-%EA%B8%B0%EB%8A%A5
  // 여기참고!!! - https://codepen.io/benkalsky/pen/ByJawa

  return (
    <>
      {showPostBackground && (
        <PostBackgroundStyle className={!postDetail ? "hide" : "show"} />
      )}
      <PostStyle
        className={`postStandard ${isBoardMode ? "postFree" : "postStandard"} ${
          delayZIndex || showPostBackground ? "selected" : ""
        }`}
        isLoading={isLoading}
        color={color}
        postHeight={postHeight}
        textareaHeight={textareaHeight}
        eventNone={draggingRef}
        delayZIndex={delayZIndex || showPostBackground}
        scrollToggle={scrollToggle}
        ref={selectedRef}
        style={{
          left:
            postDetail === at
              ? `calc(50% - 300px)`
              : isBoardMode
              ? `${postPosition.x}px`
              : `${postPosition.lastX || standardPosition.x}px`,
          top:
            postDetail === at
              ? // post의 height보다 커질 때 크기는 그대로인데 점점 위로 올라감
                `calc(50% - ${postFlexibleHeight / 2}px)`
              : isBoardMode
              ? `${postPosition.y}px`
              : `${postPosition.lastY || standardPosition.y}px`,
          width: postDetail === at ? "600px" : "240px",
          // height:
          //   postDetail === at
          //     ? `${postHeight}px`
          //     : `${postHeight > 600 ? 600 : postHeight}px`,
        }}
        onMouseDown={!postDetail ? onMouseDown : null}
        onMouseEnter={!isBoardMode && !postDetail ? onMouseEnter : null}
        onMouseLeave={!isBoardMode && !postDetail ? onMouseLeave : null}
        onClick={!postDetail ? onClick : null}
      >
        {/* {at} */}
        {/* 제목이 없으면 비활성화 상태에서는 그냥 안보이게?, 그럼 title 유무에 따라서 textarea의 height 값이 바뀌도록 해야함 */}
        {/* onClick ndefined는 왜있지? */}
        <div className="postHeader" onClick={undefined}>
          <input
            className="postTitle"
            name="title"
            type="text"
            value={content.title}
            onChange={onChange}
            placeholder="title..."
            readOnly={postDetail !== at}
          />
          {/* {postDetail === at ? (
            <input
              className="postTitle"
              name="title"
              type="text"
              value={content.title}
              onChange={onChange}
              placeholder="title"
            />
          ) : (
            <span className="postTitle">{content.title || "제목 없음"}</span>
          )} */}
        </div>

        <div className="postContent">
          <textarea
            name="text"
            className="postText"
            ref={textareaRef}
            value={content.text}
            onChange={onChange}
            placeholder="text..."
            readOnly={postDetail !== at}
          />
          {/* {postDetail === at ? (
            <textarea
              name="text"
              className="postText"
              ref={textareaRef}
              value={content.text}
              onChange={onChange}
              placeholder="text..."
            />
          ) : (
            <p className="postText">
              {(content?.text ?? "loading...") || "내용 없음"}
            </p>
          )} */}
        </div>

        <div className="postFooter">
          <span className="postAt">{date}</span>
          <nav className="postMenu">
            <ul>
              <li>
                <button onClick={onColor}>
                  <FontAwesomeIcon icon={faPalette} />
                </button>
              </li>
              <li>
                <button onClick={onFavorites}>
                  <FontAwesomeIcon icon={reFaStar} />
                  {/* <FontAwesomeIcon icon={faStar} /> */}
                </button>
              </li>
              <li>
                <button onClick={onGroup}>
                  <FontAwesomeIcon icon={faLayerGroup} />
                </button>
              </li>
              <li>
                <button onClick={onDelete}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </PostStyle>
    </>
  );
};

export default React.memo(Post);
