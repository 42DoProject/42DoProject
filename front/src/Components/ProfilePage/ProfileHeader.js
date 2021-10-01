import React, { useState } from "react";
import { useSelector } from "react-redux";
import "../../SCSS/ProfilePage/ProfileHeader.scss";
import Follow from "./Follow";

export default function ProfileHeader() {
  // let userState = useSelector((state) => state.userReducer);
  let loginState = useSelector((state) => state.loginReducer);
  let [followerFlag, setFollowerFlag] = useState(0);
  let [followingFlag, setFollowingFlag] = useState(0);

  return (
    <div className="profileHeader">
      <div className="header__left">
        <img
          className="profileImage"
          alt="profileImage"
          src={loginState.profileImage}
        />

        <div className="profile__bubble">
          리액트를 이용한 웹 프론트엔드 개발을 해보고 싶습니다!
        </div>
        <div className="profile__last-access">마지막 접속: 3일 전</div>
      </div>
      <div className="header__right">
        <div className="right__row1">
          <div className="row1__name">{loginState.name}</div>
          <button className="row1__send-message">메시지 보내기</button>
          <button className="row1__follow">팔로우</button>
        </div>
        <div className="right__row2">
          <div className="row2__status">프로젝트 찾는 중</div>
          <div className="row2__follower-wrapper">
            <div
              className="row2__follower"
              onClick={(e) => {
                followerFlag === 0 ? setFollowerFlag(1) : setFollowerFlag(0);
              }}>
              팔로워 10명
            </div>
            {followerFlag === 1 ? (
              <Follow setFollowFlag={setFollowerFlag} subject="팔로워" />
            ) : null}
          </div>
          <div className="row2__following-wrapper">
            <div
              className="row2__following"
              onClick={(e) => {
                followingFlag === 0 ? setFollowingFlag(1) : setFollowingFlag(0);
              }}>
              팔로우 15명
            </div>
            {followingFlag === 1 ? (
              <Follow setFollowFlag={setFollowingFlag} subject="팔로우" />
            ) : null}
          </div>
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
