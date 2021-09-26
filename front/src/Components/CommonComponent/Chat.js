import React, { useState } from "react";
import { Icon } from "@iconify/react";
import "../../SCSS/Chat.scss";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";

export default function Chat() {
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
          <div className="nav__chat-title">대화</div>
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
    </>
  );
}
