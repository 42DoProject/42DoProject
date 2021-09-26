import React from "react";
import "../../SCSS/ProfilePage/ProfileHeader.scss";
import { Icon } from "@iconify/react";

export default function ProfileHeader() {
  return (
    <div className="profileHeader">
      <div className="header__left">
        <img className="profileImage" alt="profileImage1" />

        <div className="profile__bubble">
          리액트를 이용한 웹 프론트엔드 개발을 해보고 싶습니다!
        </div>
        <div className="profile__last-access">마지막 접속: 3일 전</div>
      </div>
      <div className="header__right">
        <div className="right__row1">
          <div className="row1__name">jiylee</div>
          <button className="row1__send-message">메시지 보내기</button>
          <button className="row1__follow">팔로우</button>
        </div>
        <div className="right__row2">
          <div className="row2__status">프로젝트 찾는 중</div>
          <div className="row2__follower">팔로워 10명</div>
          <div className="row2__following">팔로워 15명</div>
        </div>
        <div className="right__introduction">
          풀스택 개발자 지망생 jiylee입니다! <br />
          <br />
          포트폴리오 겸 프론트엔드 쪽으로 프로젝트 구하고 있습니다. <br />
          <br />
          채팅 주세요~
        </div>
      </div>
    </div>
  );
}
