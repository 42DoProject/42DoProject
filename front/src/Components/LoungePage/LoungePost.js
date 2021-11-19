import React from "react";
import "../../SCSS/LoungePage/LoungePost.scss";
import { Icon } from "@iconify/react";
import defaultImg from "../../default_intra.png";
import relativeTime from "../../relativeTime";

export default function LoungePost({ loungeData }) {
  return (
    <div className="lounge-post">
      <div className="lounge-post__row1">
        <div className="lounge-post__profile">
          <img
            className="profile__img"
            src={loungeData.profile.user.profileImage || defaultImg}
            alt="profile__img"
          ></img>
          <div className="profile__name">
            {loungeData.profile.user.username}
          </div>
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
          <Icon className="bottom__like-icon" icon="ant-design:like-outlined" />
          {loungeData.like}
        </div>
      </div>
    </div>
  );
}
