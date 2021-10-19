import React from "react";
import { useSelector } from "react-redux";
import "../../../SCSS/Common/Chat/ChatCard.scss";
export default function ChatCard({ chatInfo, userInfo, imgFlag }) {
  let loginState = useSelector((state) => state.loginReducer);
  return (
    <>
      {loginState.id === userInfo?.id ? (
        <div className="chatCard-me">
          <div className="chatCard__column1">
            <div className="chatCard__column1-small">
              {imgFlag ? (
                <>
                  <img src={userInfo?.profileImage} alt="img"></img>
                  <div className="column1-small__name">
                    {userInfo?.username}
                  </div>
                </>
              ) : (
                <div className="empty"></div>
              )}
            </div>
          </div>
          <div className="chatCard__column2">
            <div className="chat-message-small">{chatInfo.message}</div>
          </div>
        </div>
      ) : (
        <div className="chatCard-other">
          <div className="chatCard__column1">
            <div className="chatCard__column1-small">
              {imgFlag ? (
                <>
                  <img src={userInfo?.profileImage} alt="img"></img>
                  <div className="column1-small__name">
                    {userInfo?.username}
                  </div>
                </>
              ) : (
                <div className="empty"></div>
              )}
            </div>
          </div>
          <div className="chatCard__column2">
            <div className="chat-message-small">{chatInfo.message}</div>
          </div>
        </div>
      )}
    </>
  );
}
