import React from "react";
import "../../SCSS/LoungePage/LoungePost.scss";
import { Icon } from "@iconify/react";
import defaultImg from "../../default_intra.png";
// import { Link } from "react-router-dom";

export default function LoungePost() {
  return (
    <div className="lounge-post">
      <div className="lounge-post__row1">
        <div className="lounge-post__profile">
          <img
            className="profile__img"
            src={defaultImg}
            alt="profile__img"></img>
          <div className="profile__name">seojeong</div>
        </div>
        <div className="lounge-post__time">1시간 전</div>
      </div>
      <div className="lounge-post__space">
        리액트 같이 공부하면서 프로젝트 하실 프론트엔드 분 구해용
        <br />
        저도 처음이니 부담 안가지셔도 됩니다!!
      </div>
      <div className="lounge-post__bottom">
        <button className="bottom__open-comments">
          댓글 열기
          <Icon
            className="bottom__comment-icon"
            icon="dashicons:arrow-down-alt2"
          />
        </button>
        <div className="bottom__info">
          <Icon className="bottom__like-icon" icon="ant-design:like-outlined" />
          좋아요 2 ∙ 댓글 2
        </div>
      </div>
    </div>
  );
}
