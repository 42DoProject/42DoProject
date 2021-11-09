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
  const [unreadCnt, setUnreadCnt] = useState(0);
  const [refreshFlag, setRefreshFlag] = useState(0);

  const getUnreadCnt = (chatRoom) => {
    let cnt = 0;
    chatRoom?.forEach((e) => (cnt += e.unread));
    setUnreadCnt(cnt);
  };

  const getChatRoom = async () => {
    try {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/chat`,
        {
          headers: {
            Authorization: `Bearer ${loginState.accessToken}`,
          },
        }
      );
      getUnreadCnt(data);
      setChatRoom(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    socket.on("chat:newRoom", () => {
      getChatRoom();
    });
    socket.on("chat:leave", () => {
      getChatRoom();
    });
    return () => {
      socket.off("chat:newRoom");
      socket.off("chat:leave");
    };
  }, [loginState]);

  useEffect(() => {
    getChatRoom();
  }, [loginState, chatOutFlag, inFlag, refreshFlag]);

  return (
    <>
      <div
        className="chat"
        onClick={() => {
          let chatEl = document.querySelector(".chat");
          let chatLogEl = document.querySelector(".chatLog");
          chatEl.style.visibility = "hidden";
          chatLogEl.style.visibility = "visible";
        }}
      >
        <Icon
          className="chat__icon"
          icon="ion:chatbox-ellipses"
          height="3.6rem"
          hFlip={true}
        />
        <div className="chat__noti">
          {unreadCnt ? <span>{unreadCnt}</span> : null}
        </div>
      </div>
      <div className="chatLog">
        {inFlag !== -1 ? (
          <InChat
            chatRoom={inFlag}
            setInFlag={setInFlag}
            clickFlag={clickFlag}
            setClickFlag={setClickFlag}
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
                    setConvFlag(0);
                  }}
                >
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
                    chatInfo={room}
                    clickFlag={clickFlag}
                    setInFlag={setInFlag}
                    setConvFlag={setConvFlag}
                    refreshFlag={refreshFlag}
                    setRefreshFlag={setRefreshFlag}
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
