import React, { useEffect, useState } from "react";
import "../../../SCSS/Common/Chat/ChatRoom.scss";
import axios from "axios";
import relativeTime from "../../../relativeTime";
import { useSelector } from "react-redux";
import socket from "../../../socket";

function ChatRoom({ uuid, chatRoom, clickFlag, setInFlag, setConvFlag }) {
  const [chat, setChat] = useState([]);
  let loginState = useSelector((state) => state.loginReducer);

  const chatRoomCP = chatRoom.users.filter((e) => {
    return e.id !== loginState.id;
  });

  const getChat = async (uuid) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/chat/${uuid}`, {
        headers: {
          Authorization: `Bearer ${loginState.accessToken}`,
        },
      });
      setChat(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getChat(uuid);
    socket.on(
      "chat:receive",
      (payload) => uuid === payload.uuid && getChat(uuid)
    );
    socket.on("chat:leave", () => getChat(uuid));
    return () => {
      socket.off("chat:receive");
      socket.off("chat:leave");
    };
  }, [loginState]);

  return (
    <>
      <div
        className="chatRoom"
        onClick={() => {
          setInFlag(chatRoom);
          setConvFlag(0);
        }}
      >
        <div className="chatRoom__nav">
          <div className="chatRoom__profile">
            {chatRoomCP.length ? (
              <img
                className="chatRoom__img"
                src={chatRoomCP[0]?.profileImage}
                alt="chatRoom__img"
              ></img>
            ) : null}
            <div className="chatRoom__name">
              {clickFlag
                ? chatRoomCP.map((e, idx) => (
                    <span key={idx}>{e.username}</span>
                  ))
                : chatRoomCP.map((e, idx) => {
                    if (idx < 3) return <span key={idx}>{e.username}</span>;
                    else if (idx === 3) return <span key={idx}>...</span>;
                    else return <></>;
                  })}
            </div>
          </div>
          <div className="chatRoom__time-stamp">
            {relativeTime(chat.length && chat[chat.length - 1].date)}
          </div>
        </div>
        <div className="chatRoom__bubble">
          {chat ? chat[chat.length - 1]?.message : <br />}
        </div>
      </div>
    </>
  );
}

export default React.memo(ChatRoom);
