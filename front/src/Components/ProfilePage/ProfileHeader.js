import React from "react";
import "../../SCSS/ProfilePage/ProfileHeader.scss";
import { Icon } from "@iconify/react";
import ProfileBody from "./ProfileBody";
import ProfileRight from "./ProfileRight";

export default function ProfileHeader() {
  return (
    <div className="profileHeader">
      <div className="profileImage">
        <img alt="profileImage1" />
        <div className="profileImage__icons">
          <Icon className="profile__icon1" icon="ion:chatbox-ellipses" />
          <Icon
            className="profile__icon2"
            icon="ant-design:user-add-outlined"
          />
        </div>
        <div className="profile__name">
          jiylee
          <span className="profile__level">lv.4</span>
        </div>
        <div className="profile__bubble">
          리액트를 이용한 웹 프론트엔드 개발을 해보고 싶습니다!
        </div>
        <div className="profile__last-access">마지막 접속: 3일 전</div>
      </div>
    </div>
  );
}
