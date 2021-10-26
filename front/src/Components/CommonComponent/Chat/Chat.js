import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import "../../../SCSS/Common/Chat/Chat.scss";
import ChatRoom from "./ChatRoom";
import axios from "axios";
import InChat from "./InChat";
import { useSelector } from "react-redux";
import socket from "../../../socket";
import Conv from "./AddConv";
export default function Chat() {
  let loginState = useSelector((state) => state.loginReducer);
  const [clickFlag, setClickFlag] = useState(0);
  const [convFlag, setConvFlag] = useState(0);
  const [chatRoom, setChatRoom] = useState();
  const [inFlag, setInFlag] = useState(-1);
  const [chatOutFlag, setChatOutFlag] = useState(0);

  const getChatRoom = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/chat", {
        headers: {
          Authorization: `Bearer ${loginState.accessToken}`,
        },
      });
      setChatRoom(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    socket.off("chat:newRoom");

    socket.on("chat:newRoom", () => {
      getChatRoom();
    });
  }, [loginState]);

  useEffect(() => {
    getChatRoom();
  }, [loginState, chatOutFlag]);

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
        {inFlag !== -1 ? (
          <InChat
            chatRoom={inFlag}
            setInFlag={setInFlag}
            clickFlag={clickFlag}
            chatOutFlag={chatOutFlag}
            setChatOutFlag={setChatOutFlag}
          />
        ) : (
          <>
            <div className="chatLog__nav">
              <div className="nav__left-icons">
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
                <div className="nav__empty-div"></div>
              </div>
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
            {convFlag === 1 && (
              <Conv
                chatOutFlag={chatOutFlag}
                setChatOutFlag={setChatOutFlag}
                setConvFlag={setConvFlag}
                clickFlag={clickFlag}
              />
            )}
            <div className="chatLog__body">
              {chatRoom?.length ? (
                chatRoom?.map((room) => (
                  <ChatRoom
                    key={room.uuid}
                    uuid={room.uuid}
                    chatRoom={room}
                    clickFlag={clickFlag}
                    setInFlag={setInFlag}
                    setConvFlag={setConvFlag}
                  />
                ))
              ) : (
                <div className="chatLog__body-empty">
                  <div>대화를 시작해 보세요</div>
                  <div className="chatLog__body-empty-info">
                    상대방의 프로필에서 메시지를 보내거나 우측 상단에서 새로운
                    대화 상대를 추가할 수 있어요
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
