import React, { useState } from "react";
import { Icon } from "@iconify/react";
import "../../SCSS/Chat.scss";
import ChatRoom from "./ChatRoom";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";

export default function Chat() {
  let [clickFlag, setClickFlag] = useState(0);
  let [convFlag, setConvFlag] = useState(0);

  return (
    <>
      <div
        className="chat"
        onClick={() => {
          let chatEl = document.querySelector(".chat");
          let chatLogEl = document.querySelector(".chatLog");

          chatEl.style.visibility = "hidden";
          chatLogEl.style.visibility = "visible";
        }}>
        <Icon
          className="chat__icon"
          icon="ion:chatbox-ellipses"
          height="3.6rem"
          hFlip={true}
        />

        <div className="chat__noti">
          <span>9</span>
        </div>
      </div>
      <div className="chatLog">
        <div className="chatLog__nav">
          {clickFlag === 0 ? (
            <Icon
              className="nav__resize-up"
              icon="si-glyph:resize-out-frame"
              hFlip="true"
              height="1.5rem"
              onClick={() => {
                let chatLogEl = document.querySelector(".chatLog");
                chatLogEl.style.width = "80vw";
                chatLogEl.style.height = "90vh";
                setClickFlag(1);
              }}
            />
          ) : (
            <Icon
              className="nav__resize-down"
              icon="si-glyph:resize-in-frame"
              height="1.5rem"
              hFlip="true"
              onClick={() => {
                let chatLogEl = document.querySelector(".chatLog");
                chatLogEl.style.width = "22rem";
                chatLogEl.style.height = "40rem";
                setClickFlag(0);
              }}
            />
          )}

          <div className="nav__chat-title">대화</div>
          <div className="nav__icons">
            <div className="nav__plus">
              <Icon
                icon="bx:bx-message-rounded-add"
                height="2rem"
                onClick={() => {
                  convFlag === 0 ? setConvFlag(1) : setConvFlag(0);
                }}
              />
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
        {convFlag === 1 ? (
          <div className="chatLog__addConv">
            <span className="addConv__placeholder">대화상대 추가 : </span>
            <input type="text" className="addConv__input" />
          </div>
        ) : null}

        <div className="chatLog__body">
          <ChatRoom />
          <ChatRoom />
          <ChatRoom />
          <ChatRoom />
          <ChatRoom />
          <ChatRoom />
          <ChatRoom />
        </div>
      </div>
    </>
  );
}
