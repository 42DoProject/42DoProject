import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import "../../../SCSS/Common/Chat/InChat.scss";
import { useSelector } from "react-redux";
import axios from "axios";
import ChatCard from "./ChatCard";
import socket from "../../../socket";
import { Example as Popup } from "./PopUp";

function InChat({
  chatRoom,
  clickFlag,
  setInFlag,
  chatOutFlag,
  setChatOutFlag,
}) {
  let loginState = useSelector((state) => state.loginReducer);
  const [chat, setChat] = useState();
  const userList = chatRoom.users.filter((e) => e.id !== loginState.id);
  const getChat = async (uuid) => {
    try {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/chat/${uuid}`,
        {
          headers: {
            Authorization: `Bearer ${loginState.accessToken}`,
          },
        }
      );
      setChat(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getChat(chatRoom.uuid);
    socket.on("chat:leave", () => getChat(chatRoom.uuid));
    socket.on(
      "chat:receive",
      (payload) => chatRoom.uuid === payload.uuid && getChat(chatRoom.uuid)
    );
    return () => {
      socket.off("chat:receive");
      socket.off("chat:leave");
    };
  }, [loginState]);

  return (
    <>
      <div className="inChat">
        <div className="inChat__header">
          <div className="back" onClick={() => setInFlag(-1)}>
            <Icon icon="dashicons:arrow-left-alt2" height="2rem" />
          </div>
          <div className="name">
            {clickFlag
              ? userList.map((e, idx) => <span key={idx}>{e.username}</span>)
              : userList.map((e, idx) => {
                  if (userList.length <= 2)
                    return <span key={idx}>{e.username}</span>;
                  else {
                    if (idx === 0)
                      return (
                        <span key={idx}>{`${e.username} - 외 ${
                          userList.length - 1
                        }`}</span>
                      );
                    return "";
                  }
                })}
          </div>
          <Popup
            uuid={chatRoom.uuid}
            chatOutFlag={chatOutFlag}
            setChatOutFlag={setChatOutFlag}
            setInFlag={setInFlag}
          />
          <div
            className="close"
            onClick={() => {
              let chatEl = document.querySelector(".chat");
              let chatLogEl = document.querySelector(".chatLog");
              chatEl.style.visibility = "visible";
              chatLogEl.style.visibility = "hidden";
              setInFlag(-1);
            }}
          >
            <Icon icon="bx:bx-x" height="2rem" />
          </div>
        </div>
        <div className="inChat__body">
          {chat &&
            chat.map((e, idx) => {
              let imgFlag = 1;
              if (idx && chat[idx - 1].userId === chat[idx].userId) imgFlag = 0;
              if (e.userId === -1) imgFlag = 0;
              return <ChatCard key={e.date} chatInfo={e} imgFlag={imgFlag} />;
            })}
        </div>

        <div className="inChat__input-small">
          <input
            placeholder="메세지 입력..."
            spellCheck="false"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                if (e.target.value.length) {
                  socket.emit("chat:send", {
                    uuid: chatRoom.uuid,
                    message: e.target.value,
                  });
                  e.target.value = "";
                }
              }
            }}
          ></input>
          <div
            className="input__send"
            onClick={() => {
              const input = document.querySelector(
                ".inChat .inChat__input-small input"
              );
              if (input.value.length) {
                socket.emit("chat:send", {
                  uuid: chatRoom.uuid,
                  message: input.value,
                });
                input.value = "";
              }
            }}
          >
            보내기
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(InChat);
