import React, { useEffect, useState } from "react";
import "../../SCSS/ChatRoom.scss";
import axios from "axios";
import relativeTime from "../../relativeTime";
import socket from "../../socket";

export default function ChatRoom(props) {
  const { chatRoom, clickFlag } = props;
  const [chat, setChat] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(0);
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
    getChat(chatRoom.uuid);
  }, [refreshFlag]);

  socket.on("chat:receive", (payload) => {
    console.log("chat:receive");
    refreshFlag ? setRefreshFlag(0) : setRefreshFlag(1);
  });
  return (
    <>
      <div className="chatRoom">
        <div className="chatRoom__nav">
          <div className="chatRoom__profile">
            <img
              className="chatRoom__img"
              src={chatRoom.users[0].profileImage}
              alt="chatRoom__img"
            ></img>
            <div className="chatRoom__name">
              {clickFlag
                ? chatRoom.users.map((e, idx) => (
                    <span key={idx}>{e.username}</span>
                  ))
                : chatRoom.users.map((e, idx) => {
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
          {chat.length ? chat[chat.length - 1].message : <br />}
        </div>
      </div>
    </>
  );
}
