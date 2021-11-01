import React, { useEffect, useState } from "react";
import "../../../SCSS/Common/Chat/ChatRoom.scss";
import axios from "axios";
import relativeTime from "../../../relativeTime";
import { useSelector } from "react-redux";
import socket from "../../../socket";

function ChatRoom({
  chatInfo,
  clickFlag,
  setInFlag,
  setConvFlag,
  refreshFlag,
  setRefreshFlag,
}) {
  const loginState = useSelector((state) => state.loginReducer);
  const [outUserProfile, setOutUserProfile] = useState();
  const chatRoomCP = chatInfo.users.filter((e) => e.id !== loginState.id);
  useEffect(() => {
    socket.on("chat:receive", () => {
      refreshFlag ? setRefreshFlag(0) : setRefreshFlag(1);
    });
    return () => socket.off("chat:receive");
  }, [refreshFlag]);

  const getProfile = async (userName) => {
    try {
      const {
        data: { user },
      } = await axios.get(
        `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/search/${userName}`
      );
      setOutUserProfile(user[0].profileImage);
    } catch (err) {
      console.log(err);
    }
  };
  let outUserName = "";
  if (chatInfo.users.length === 1) {
    outUserName = chatInfo.last.split(" ")[0];
    outUserName = outUserName.slice(0, -2);
  }
  useEffect(() => {
    outUserName && getProfile(outUserName);
  }, []);

  return (
    <>
      <div
        className="chatRoom"
        onClick={() => {
          setInFlag(chatInfo);
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
            ) : (
              <img
                className="chatRoom__img"
                src={outUserProfile}
                alt="chatRoom__img"
              ></img>
            )}
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
              {<span>{outUserName}</span>}
            </div>
          </div>
          <div className="chatRoom__time-stamp">
            {relativeTime(chatInfo.date)}
          </div>
        </div>
        <div className="chatRoom__footer">
          <div className="chatRoom__bubble">
            {chatInfo.last ? chatInfo.last : <br />}
          </div>
          {chatInfo.unread != 0 && (
            <div className="chatRoom__unread">
              <span>{chatInfo.unread}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default React.memo(ChatRoom);
