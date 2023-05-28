import {
  faPlus,
  faThumbtack,
  faCircleHalfStroke,
  faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DarkModeContext } from "../../context/DarkModeContextProvider";
import SideMenuStyle from "../../style/sideMenu/SideMenuStyle";
import { PostContext } from "../../context/PostContextProvider";
import { BoardModeContext } from "../../context/BoardModeContextProvider";

const SideMenu = () => {
  const [isMenu, setIsMenu] = useState(false);
  const { isBoardMode, setIsBoardMode } = useContext(BoardModeContext);
  const { isDark, setIsDark } = useContext(DarkModeContext);
  const { addPost } = useContext(PostContext);

  const sideMenuBackgroundClose = useCallback(({ target }) => {
    if (!target.closest("#sideMenu")) {
      setIsMenu(false);
      window.removeEventListener("click", sideMenuBackgroundClose);
    }
  }, []);
  useEffect(() => {
    isMenu && window.addEventListener("click", sideMenuBackgroundClose);
  }, [isMenu, sideMenuBackgroundClose]);

  const onBoardModeToggle = () => {
    setIsBoardMode(!isBoardMode);
    window.localStorage.setItem("boardMode", !isBoardMode);
  };

  const onDarkModeToggle = () => {
    setIsDark(!isDark);
    window.localStorage.setItem("darkMode", !isDark);
  };

  return (
    <SideMenuStyle id="sideMenu" style={{ width: isMenu ? "240px" : "0px" }}>
      <div id="menuContainer">
        <h1 id="logo">POST-DO</h1>

        <div id="sideBtnGroup">
          {/* button들을 component로 묶기?, React.memo로 최적화(버튼을 누르면 다른위치에 있는 같은 버튼들 까지 반응하는듯) */}
          <button className="addBtn" onClick={addPost}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button className="BoardModeBtn" onClick={onBoardModeToggle}>
            <FontAwesomeIcon
              className={isBoardMode ? "" : "opaquely"}
              icon={faThumbtack}
            />
          </button>
          <button className="DarkModeBtn" onClick={onDarkModeToggle}>
            <FontAwesomeIcon
              className={false ? "" : "opaquely"}
              icon={faCircleHalfStroke}
            />
          </button>
        </div>

        <div id="postGroupList">
          {/* 즐겨찾기 구간(임시) */}
          <ul id="favorite">
            FavoriteIcon
            <li>post1</li>
            <li>post2</li>
          </ul>
          <ul id="groupList">
            <li className="group">
              All Post
              <ul className="postList">
                <li className="post">post1</li>
                <li className="post">post2</li>
                <li className="post">post3</li>
                <li className="post">post4</li>
                <li className="post">post5</li>
              </ul>
            </li>
            <li className="group">
              [FavoriteIcon] Group1
              <ul className="postList">
                <li className="post">post1</li>
                <li className="post">post2</li>
                <li className="post">post3</li>
              </ul>
            </li>
            <li className="group">
              [FavoriteIcon] Group2
              <ul className="postList">
                <li className="post">post1</li>
                <li className="post">post3</li>
                <li className="post">post4</li>
              </ul>
            </li>
            <li className="group">
              [FavoriteIcon] Group3
              <ul className="postList">
                <li className="post">post2</li>
                <li className="post">post5</li>
              </ul>
            </li>
          </ul>
        </div>
        <div id="trash">Trash</div>
        <footer>copyright</footer>
      </div>

      {/* button을 hover했을 때 하단에 switch가 보이고 키고 꺼지는 애니메이션 구현 */}
      <nav id="menuBtnContainer" className={isMenu ? "" : "quickMenu"}>
        <div id="quickBtnGroup">
          <button id="menuBtn" onClick={() => setIsMenu(!isMenu)}>
            <div id="rotateLoading">
              {isMenu ? (
                <FontAwesomeIcon icon={faAngleLeft} />
              ) : (
                <div id="dotBox">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              )}
            </div>
          </button>
          {/* post 추가는 독립적으로 두는게 좋으려나? */}
          {!isMenu && (
            <>
              <button className="addBtn" onClick={() => addPost("white")}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <button className="BoardModeBtn" onClick={onBoardModeToggle}>
                <FontAwesomeIcon
                  className={isBoardMode ? "" : "opaquely"}
                  icon={faThumbtack}
                />
              </button>
              <button className="DarkModeBtn" onClick={onDarkModeToggle}>
                <FontAwesomeIcon
                  className={false ? "" : "opaquely"}
                  icon={faCircleHalfStroke}
                />
              </button>
            </>
          )}
        </div>
      </nav>
    </SideMenuStyle>
  );
};

export default SideMenu;
