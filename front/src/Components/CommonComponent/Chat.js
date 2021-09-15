import React, { useState } from "react";
import { Icon } from "@iconify/react";
import "../../SCSS/Chat.scss";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";

export default function Chat() {
  let [clickFlag, setClickFlag] = useState(false);

  return (
    <>
      <div
        className="chat"
        onClick={() => {
          let chatEl = document.querySelector(".chat");
          let chatLogEl = document.querySelector(".chatLog");
          if (clickFlag === false) {
            setClickFlag(true);
            chatEl.style.visibility = "hidden";
            chatLogEl.style.visibility = "visible";
          } else {
            setClickFlag(false);
            chatEl.style.color = "#2c2c34";
          }
        }}>
        <Icon
          className="chat__icon"
          icon="ion:chatbox-ellipses"
          height="3.6rem"
          hFlip={true}
        />
        <div className="chatLog">
          <div className="chatLog__nav">
            <div className="nav__chat-title">채팅</div>
            <div className="nav__icons">
              <div className="nav__plus">
                <Icon icon="bx:bx-message-rounded-add" height="2rem" />
              </div>
              <div
                className="nav__x"
                onClick={() => {
                  let chatEl = document.querySelector(".chat");
                  let chatLogEl = document.querySelector(".chatLog");
                  chatEl.style.visibility = "visible";
                  chatLogEl.style.visibility = "hidden";
                }}>
                <Icon icon="bx:bx-x" height="2rem" />
              </div>
            </div>
          </div>
        </div>
        <div className="chat__noti">
          <span>9</span>
        </div>
      </div>
    </>
  );
}
