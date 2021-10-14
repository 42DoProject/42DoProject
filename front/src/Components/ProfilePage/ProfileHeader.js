import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
import "../../SCSS/ProfilePage/ProfileHeader.scss";
import Follow from "./Follow";
import relativeTime from "../../relativeTime";
import { useHistory } from "react-router";
import { status } from "../../userData";
import { Icon } from "@iconify/react";
// import { Link } from "react-router-dom";
import axios from "axios";

export default function ProfileHeader(props) {
  // let userState = useSelector((state) => state.userReducer);
  // let loginState = useSelector((state) => state.loginReducer);
  const [followerFlag, setFollowerFlag] = useState(0);
  const [followingFlag, setFollowingFlag] = useState(0);
  const [followButton, setFollowButton] = useState();
  const [unfollowAlert, setUnfollowAlert] = useState(0);

  const history = useHistory();

  useEffect(() => {
    props.myFollowings.includes(Number(props.userId))
      ? setFollowButton("unfollow")
      : setFollowButton("follow");
  }, [props.myFollowings]);

  return (
    <div className="profileHeader">
      <div className="header__left">
        <img
          className="profileImage"
          alt="profileImage"
          src={props.user.profileImage}
        />

        <div className="profile__bubble">{props.user.statusMessage || "-"}</div>
        <div className="profile__last-access">
          {props.user.lastAccess === "online" ? (
            <span className="profile__online">접속중</span>
          ) : (
            `마지막 접속: ${relativeTime(Date.parse(props.user.lastAccess))}`
          )}
        </div>
      </div>
      <div className="header__right">
        <div className="right__row1">
          <div className="row1__name">{props.user.username}</div>
          {props.location.pathname !== "/profile" ? (
            <>
              <button className="row1__send-message">메시지 보내기</button>
              {followButton === "follow" ? (
                <button
                  className="row1__follow"
                  onClick={async () => {
                    await axios.get(
                      `http://localhost:5000/user/follow/${props.userId}`,
                      {
                        headers: {
                          Authorization: `Bearer ${props.ACCESS_TOKEN}`,
                        },
                      }
                    );
                    props.setGetDataFlag(1);
                    setFollowButton("unfollow");
                  }}>
                  팔로우
                </button>
              ) : (
                <>
                  <button
                    className="row1__unfollow"
                    onClick={() => {
                      unfollowAlert === 0
                        ? setUnfollowAlert(1)
                        : setUnfollowAlert(0);
                    }}>
                    <Icon
                      className="unfollow__icon"
                      icon="bx:bxs-user-check"
                      height="30"
                    />
                  </button>
                  {unfollowAlert === 1 ? (
                    <div className="unfollow__alert">
                      <div>
                        <img
                          className="unfollow__img"
                          src={props.user.profileImage}
                        />
                        <div className="unfollow__desc">
                          팔로우를 취소하면{" "}
                          <span className="unfollow__user">
                            {props.user.username}
                          </span>
                          님의 소식을 더이상 받을 수 없게 됩니다.
                        </div>
                      </div>
                      <hr />
                      <div
                        className="unfollow__unfollow"
                        onClick={async () => {
                          await axios.get(
                            `http://localhost:5000/user/unfollow/${props.userId}`,
                            {
                              headers: {
                                Authorization: `Bearer ${props.ACCESS_TOKEN}`,
                              },
                            }
                          );
                          props.setGetDataFlag(1);
                          setFollowButton("follow");
                          setUnfollowAlert(0);
                        }}>
                        팔로우 취소
                      </div>
                      <hr />
                      <div
                        className="unfollow__cancel"
                        onClick={() => {
                          setUnfollowAlert(0);
                        }}>
                        취소
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </>
          ) : (
            <button
              className="row1__edit-profile"
              onClick={() => {
                history.push("/profile/edit");
              }}>
              프로필 수정
            </button>
          )}
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
              <Follow
                setFollowFlag={setFollowerFlag}
                subject="팔로워"
                userId={props.userId}
                ACCESS_TOKEN={props.ACCESS_TOKEN}
              />
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
              <Follow
                setFollowFlag={setFollowingFlag}
                subject="팔로우"
                userId={props.userId}
                ACCESS_TOKEN={props.ACCESS_TOKEN}
                myFollowings={props.myFollowings}
              />
            ) : null}
          </div>
        </div>
        <pre className="right__introduction">
          {props.user.introduction || "-"}
        </pre>
      </div>
    </div>
  );
}
