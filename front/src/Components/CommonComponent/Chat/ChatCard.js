import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../../SCSS/Common/Chat/ChatCard.scss";
import axios from "axios";

export default function ChatCard({ chatInfo, imgFlag }) {
  const loginState = useSelector((state) => state.loginReducer);
  const [userName, setUserName] = useState();
  const [profileUrl, setProfileUrl] = useState();
  let chatType = "";
  loginState.id === chatInfo?.userId ? (chatType = "me") : (chatType = "other");
  if (chatInfo.userId === -1) chatType = "noti";

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

  useEffect(() => {
    const getProfile = async (userId) => {
      try {
        const {
          data: { profileImage, username },
        } = await axios.get(
          `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/user/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${loginState?.accessToken}`,
            },
          }
        );
        await resizedImage(profileImage, "100");
        setUserName(username);
      } catch (err) {
        console.log(err);
      }
    };
    imgFlag && getProfile(chatInfo.userId);
  }, [imgFlag]);

  return (
    <div className={`chatCard-${chatType}`}>
      <div className="chatCard__column1">
        {imgFlag ? (
          <img src={profileUrl || ""} alt="img"></img>
        ) : (
          <div className="empty"></div>
        )}
      </div>
      {chatInfo.userId === -1 ? (
        <div className="chat-noti">{chatInfo.message}</div>
      ) : (
        <div className="chatCard__column2">
          <div className="column1-small__name">{imgFlag === 1 && userName}</div>
          <div className="chat-message-small">{chatInfo.message}</div>
        </div>
      )}
    </div>
  );
}
