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
    /* outline: 1px solid red; */

    *.postText {
      width: 100%;
      /* 임시 */
      /* min-height: 250px; */
    }

    /* 내용의 크기에 맞춰 textarea의 height 크기도 맞춰지게끔 */
    textarea.postText {
      border: none;
      background: none;
      outline: none;
      resize: none;

      padding: 10px 0 0 0;

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

const Post = ({ at, color, title, text }) => {
  const { postDetail } = useContext(PostContext);
  const [content, setContent] = useState(null);
  const autoSaveRef = useRef();
  const textareaRef = useRef();
  const date = `${new Date(at).getFullYear()}년 ${
    new Date(at).getMonth() + 1
  }월 ${new Date(at).getDate()}일`;

  useEffect(() => {
    setContent({ title, text });
  }, [title, text]);

  // 참고할 것: https://blogpack.tistory.com/866
  // 참고해볼 것: https://www.daleseo.com/css-width/
  const handleResizeHeight = () => {
    console.log("do it!");
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  // 매번 text가 바뀌었다고 localStorage에 저장하는 것이 아니라 타이핑 후 일정 시간(1초정도?)동안 사용자의 입력이 없으면 localStorage에 저장하게끔
  // clearTimeout, setTimeout(useRef에 저장) -> clearTimeout 이후 바로 setTimeout 실행, 일정 시간 안에 다시 타이필을 하면
  // size도 추가로 저장하기
  const onChange = ({ target: { name, value } }) => {
    clearTimeout(autoSaveRef.current);
    const newContent = { ...content, [name]: value };
    setContent(newContent);
    name === "text" && handleResizeHeight();
    autoSaveRef.current = setTimeout(() => {
      const newPost = JSON.parse(window.localStorage.getItem("testPost")).map(
        (p) => (p.at === at ? { ...p, ...newContent } : p),
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
    e.stopPropagation(); // standardPost의 onClick 방지
    console.log("delete");
  };

  return (
    <>
      <div className="postHeader" onClick={undefined}>
        {postDetail === at ? (
          <input
            className="postTitle"
            name="title"
            type="text"
            value={content.title}
            onChange={onChange}
            placeholder="title"
          />
        ) : (
          <span className="postTitle">
            {(content?.title ?? "loading...") || "제목 없음"}
          </span>
        )}
      </div>

      <div className="postContent">
        {postDetail === at ? (
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
        )}
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
    </>
  );
};

export default Post;
