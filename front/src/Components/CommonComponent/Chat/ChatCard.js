import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../../SCSS/Common/Chat/ChatCard.scss";
import axios from "axios";
import relativeTime from "../../../relativeTime";
import blankImg from "../../../blankImg.png";

export default function ChatCard({ chatInfo, imgFlag }) {
  const loginState = useSelector((state) => state.loginReducer);
  const [profile, setProfile] = useState();
  const [userName, setUserName] = useState();
  const [profileUrl, setProfileUrl] = useState();
  let chatType = "";

  loginState.id === chatInfo?.userId ? (chatType = "me") : (chatType = "other");
  if (chatInfo.userId === -1) chatType = "noti";

  useEffect(() => {
    const getProfile = async (userId) => {
      try {
        const {
          data: { profileImage, username },
        } = await axios.get(
          `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/user/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${loginState?.accessToken}`,
            },
          }
        );
        setProfile(profileImage);
        setUserName(username);
      } catch (err) {
        console.log(err);
      }
    };
    imgFlag && getProfile(chatInfo.userId);
  }, [imgFlag]);

  useEffect(() => {
    const resizedImage = async (key, size) => {
      // 정상적으로 가져와지면 resized url반환, 아니면 원본이미지 url반환
      const url = key.split("/");
      url[url.length - 3] = size;
      const resized = url.join("/");
      try {
        await axios({
          method: "head",
          url: `${resized}?timestamp=${Date.now()}`,
        });
        setProfileUrl(resized);
      } catch (err) {
        console.log(err);
      }
    };
    if (profile) resizedImage(profile, "100");
  }, [profile]);

  return (
    <div className={`chatCard-${chatType}`}>
      <div className="chatCard__column1">
        {imgFlag ? (
          <img src={profileUrl || blankImg} alt="img"></img>
        ) : (
          <div className="empty"></div>
        )}
      </div>
      {chatInfo.userId === -1 ? (
        <div className="chat-noti">{chatInfo.message}</div>
      ) : (
        <div className="chatCard__column2">
          <div className="column1-small__name">
            {imgFlag === 1 && chatType === "me" && (
              <span className="chat-time">{relativeTime(chatInfo.date)}</span>
            )}
            <span>{imgFlag === 1 && userName}</span>
            {imgFlag === 1 && chatType === "other" && (
              <span className="chat-time">{relativeTime(chatInfo.date)}</span>
            )}
          </div>
          <div className="chat-message-small">{chatInfo.message}</div>
        </div>
      )}
    </div>
  );
}
