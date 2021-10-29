import React from "react";
import "../../SCSS/MainPage/Lounge.scss";
import { Icon } from "@iconify/react";
import defaultImg from "../../default_intra.png";
import { Link } from "react-router-dom";

export default function Lounge() {
  return (
    <div className="lounge">
      <Link className="lounge__title" to="/lounge">
        라운지
      </Link>
      <div className="lounge__list">
        <div className="lounge__card">
          <div className="card__row1">
            <img className="row1__image" src={defaultImg} alt="profile_img" />
            <div className="row1__right">
              <div className="row1__name">seojeong</div>
              <div className="row1__time">오늘</div>
            </div>
          </div>
          <div className="card__row2">
            <div className="row2__chat">
              리액트 같이 공부하면서 프로젝트 하실 프론트엔드 분 구해용 저도
              처음이니 부담 안가지셔도 됩니다!!
            </div>
          </div>
          <div className="card__row3">
            <Icon className="row3-icon" icon="ant-design:like-outlined" />
            <span className="like">좋아요</span>
            <span className="like-num"> 3</span>
            <span className="comment">댓글</span>
            <span className="comment-num"> 3</span>
          </div>
        </div>
        <div className="lounge__card">
          <div className="card__row1">
            <img className="row1__image" src={defaultImg} alt="profile_img" />
            <div className="row1__right">
              <div className="row1__name">seojeong</div>
              <div className="row1__time">오늘</div>
            </div>
          </div>
          <div className="card__row2">
            <div className="row2__chat">
              리액트 같이 공부하면서 프로젝트 하실 프론트엔드 분 구해용 저도
              처음이니 부담 안가지셔도 됩니다!!
            </div>
          </div>
          <div className="card__row3">
            <Icon className="row3-icon" icon="ant-design:like-outlined" />
            <span className="like">좋아요</span>
            <span className="like-num"> 3</span>
            <span className="comment">댓글</span>
            <span className="comment-num"> 3</span>
          </div>
        </div>
        <div className="lounge__card">
          <div className="card__row1">
            <img className="row1__image" src={defaultImg} alt="profile_img" />
            <div className="row1__right">
              <div className="row1__name">seojeong</div>
              <div className="row1__time">오늘</div>
            </div>
          </div>
          <div className="card__row2">
            <div className="row2__chat">
              리액트 같이 공부하면서 프로젝트 하실 프론트엔드 분 구해용 저도
              처음이니 부담 안가지셔도 됩니다!!
            </div>
          </div>
          <div className="card__row3">
            <Icon className="row3-icon" icon="ant-design:like-outlined" />
            <span className="like">좋아요</span>
            <span className="like-num"> 3</span>
            <span className="comment">댓글</span>
            <span className="comment-num"> 3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
