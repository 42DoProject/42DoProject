import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import "../../../SCSS/Common/Chat/InChat.scss";
import { useSelector } from "react-redux";
import axios from "axios";
import ChatCard from "./ChatCard";
import socket from "../../../socket";
export default function InChat(props) {
  let loginState = useSelector((state) => state.loginReducer);
  const { chatRoom, clickFlag, setInFlag } = props;
  const [chat, setChat] = useState();
  const userList = chatRoom.users.filter((e) => e.id !== loginState.id);
  const getChat = async (uuid) => {
    try {
      const ACCESS_TOKEN = localStorage.getItem("accessToken");
      const { data } = await axios.get(`http://localhost:5000/chat/${uuid}`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
      setChat(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    chatRoom && getChat(chatRoom.uuid);
  }, [chatRoom]);
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
              const user = chatRoom.users.filter((ee) => ee.id === e.userId);
              return (
                <ChatCard
                  key={idx}
                  chatInfo={e}
                  userInfo={user[0]}
                  imgFlag={imgFlag}
                />
              );
            })}
        </div>

        <div className="inChat__input-small">
          <input placeholder="메세지 입력..." spellCheck="false"></input>
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
