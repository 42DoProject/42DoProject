import React, { useState } from "react";
import { useSelector } from "react-redux";
import "../../SCSS/ProfilePage/ProfileHeader.scss";
import Follow from "./Follow";
import relativeTime from "../../relativeTime";
import { useHistory } from "react-router";
import { status } from "../../userData";

export default function ProfileHeader(props) {
  // let userState = useSelector((state) => state.userReducer);
  let loginState = useSelector((state) => state.loginReducer);
  let [followerFlag, setFollowerFlag] = useState(0);
  let [followingFlag, setFollowingFlag] = useState(0);
  let history = useHistory();

  return (
    <div className="profileHeader">
      <div className="header__left">
        <img
          className="profileImage"
          alt="profileImage"
          src={loginState.profileImage}
        />

        <div className="profile__bubble">{props.user.statusMessage}</div>
        <div className="profile__last-access">
          마지막 접속: {relativeTime(Date.parse(props.user.lastAccess))}
        </div>
      </div>
      <div className="header__right">
        <div className="right__row1">
          <div className="row1__name">{props.user.username}</div>
          {/* <button className="row1__send-message">메시지 보내기</button>
          <button className="row1__follow">팔로우</button> */}
          {/* <Link className="icon__link" to="/profile/edit">
                  <Icon icon="akar-icons:edit" />
                </Link> */}
          <button
            className="row1__edit-profile"
            onClick={() => {
              history.push("/profile/edit");
            }}>
            프로필 수정
          </button>
        </div>
        <div className="right__row2">
          {props.user.status ? (
            <div className="row2__status">{status[props.user.status]}</div>
          ) : (
            <div
              className="row2__status"
              style={{ backgroundColor: "#C4C4C4" }}>
              {status[props.user.status]}
            </div>
          )}
          <div className="row2__follower-wrapper">
            <div
              className="row2__follower"
              onClick={(e) => {
                followerFlag === 0 ? setFollowerFlag(1) : setFollowerFlag(0);
              }}>
              {`팔로워 ${props.user.follower}명`}
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
              {`팔로우 ${props.user.following}명`}
            </div>
            {followingFlag === 1 ? (
              <Follow setFollowFlag={setFollowingFlag} subject="팔로우" />
            ) : null}
          </div>
        </div>
        <pre className="right__introduction">{props.user.introduction}</pre>
      </div>
    </div>
  );
}
