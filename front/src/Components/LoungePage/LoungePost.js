import React, { useEffect } from "react";
import "../../SCSS/LoungePage/LoungePost.scss";
import { Icon } from "@iconify/react";
import defaultImg from "../../default_intra.png";
import relativeTime from "../../relativeTime";
import axios from "axios";
import { useSelector } from "react-redux";

export default function LoungePost({
  loungeData,
  refreshFlag,
  setRefreshFlag,
}) {
  const loginState = useSelector((state) => state.loginReducer);
  console.log("loungeData", loungeData);
  const likeLounge = async () => {
    try {
      await axios({
        method: "POST",
        url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/lounge/like/${loungeData.id}`,
        headers: {
          Authorization: `Bearer ${loginState?.accessToken}`,
        },
      });
      refreshFlag ? setRefreshFlag(0) : setRefreshFlag(1);
    } catch (err) {
      console.log(err);
    }
  };
  const unlikeLounge = async () => {
    try {
      await axios({
        method: "DELETE",
        url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/lounge/unlike/${loungeData.id}`,
        headers: {
          Authorization: `Bearer ${loginState?.accessToken}`,
        },
      });
      refreshFlag ? setRefreshFlag(0) : setRefreshFlag(1);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="lounge-post">
      <div className="lounge-post__row1">
        <div className="lounge-post__profile">
          <img
            className="profile__img"
            src={loungeData.image || defaultImg}
            alt="profile__img"
          ></img>
          <div className="profile__name">{loungeData.username}</div>
        </div>
        <div className="lounge-post__time">
          {relativeTime(new Date(loungeData.createdAt).getTime())}
        </div>
      </div>
      <div className="lounge-post__space">{loungeData.comment}</div>
      <div className="lounge-post__bottom">
        <button className="bottom__open-comments">
          {`댓글 ${loungeData.replyCount}개`}
          <Icon
            className="bottom__comment-icon"
            icon="dashicons:arrow-down-alt2"
          />
        </button>
        <div className="bottom__info">
          {loungeData.checkLike === "true" ? (
            <div onClick={() => unlikeLounge()}>
              <Icon
                className="bottom__like-icon-fill"
                icon="ant-design:like-fill"
              />
              {loungeData.like}
            </div>
          ) : (
            <div onClick={() => likeLounge()}>
              <Icon
                className="bottom__like-icon"
                icon="ant-design:like-outlined"
              />
              {loungeData.like}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
