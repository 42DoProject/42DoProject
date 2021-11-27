import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../SCSS/ProfilePage/ProfileHeader.scss";
import Follow from "./Follow";
import relativeTime from "../../relativeTime";
import { useHistory } from "react-router";
import { status } from "../../userData";
import { Icon } from "@iconify/react";
import UnfollowAlert from "./UnfollowAlert";
// import { Link } from "react-router-dom";
import axios from "axios";

export default function ProfileHeader(props) {
  // let userState = useSelector((state) => state.userReducer);
  const loginState = useSelector((state) => state.loginReducer);
  const [followerFlag, setFollowerFlag] = useState(0);
  const [followingFlag, setFollowingFlag] = useState(0);
  const [followButton, setFollowButton] = useState(); // "unfollow" / "follow" 버튼
  const [unfollowAlert, setUnfollowAlert] = useState(0);
  const [refreshFlag, setRefreshFlag] = useState(0); // 팔로워/팔로우 리스트 flag==1일 때 다시 가져온다.
  let dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    props.myFollowings.includes(Number(props.userId))
      ? setFollowButton("unfollow")
      : setFollowButton("follow");
  }, [props.myFollowings]);

  const inviteUser = async (userId) => {
    try {
      await axios({
        method: "POST",
        url: `https://${process.env.REACT_APP_BACKEND_DOMAIN}/chat`,
        headers: {
          Authorization: `Bearer ${loginState.accessToken}`,
        },
        data: {
          users: userId,
        },
      });
      dispatch({ type: "DM", payload: userId });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="profileHeader">
      <div className="header__left">
        <img
          className="profileImage"
          alt={props.user.username}
          src={props.user.profileImage}
        />
        {props.user.statusMessage ? (
          <div className="profile__bubble">{props.user.statusMessage}</div>
        ) : (
          <div className="profile__bubble-none">작성된 한마디가 없습니다</div>
        )}
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
          {loginState &&
            (props.location.pathname !== "/profile" ? (
              <>
                <button
                  className="row1__send-message"
                  onClick={() => {
                    inviteUser(props.userId);

                    let chatEl = document.querySelector(".chat");
                    let chatLogEl = document.querySelector(".chatLog");
                    chatEl.style.visibility = "hidden";
                    chatLogEl.style.visibility = "visible";
                  }}
                >
                  메시지 보내기
                </button>
                {followButton === "follow" ? (
                  <button
                    className="row1__follow"
                    onClick={async () => {
                      await axios.get(
                        `https://${process.env.REACT_APP_BACKEND_DOMAIN}/user/follow/${props.userId}`,
                        {
                          headers: {
                            Authorization: `Bearer ${loginState.accessToken}`,
                          },
                        }
                      );
                      props.setGetDataFlag(1);
                      setFollowButton("unfollow");
                      setRefreshFlag(1);
                    }}
                  >
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
                      }}
                    >
                      <Icon
                        className="unfollow__icon"
                        icon="bx:bxs-user-check"
                        style={{ fontSize: "1.7rem" }}
                      />
                    </button>
                    {unfollowAlert === 1 ? (
                      <UnfollowAlert
                        user={props.user}
                        userId={props.userId}
                        setUnfollowAlert={setUnfollowAlert}
                        setFollowButton={setFollowButton}
                        setGetDataFlag={props.setGetDataFlag}
                        setRefreshFlag={setRefreshFlag}
                      />
                    ) : null}
                  </>
                )}
              </>
            ) : (
              <button
                className="row1__edit-profile"
                onClick={() => {
                  history.push("/profile/edit");
                }}
              >
                프로필 수정
              </button>
            ))}
        </div>
        <div className="right__row2">
          {props.user.status ? (
            <div className="row2__status">{status[props.user.status]}</div>
          ) : (
            <div
              className="row2__status"
              style={{ backgroundColor: "#C4C4C4" }}
            >
              {status[props.user.status]}
            </div>
          )}
          <div className="row2__follower-wrapper">
            <div
              className="row2__follower"
              onClick={(e) => {
                followerFlag === 0 ? setFollowerFlag(1) : setFollowerFlag(0);
              }}
            >
              {`팔로워 ${props.user.follower}명`}
            </div>
            {followerFlag === 1 ? (
              <Follow
                setFollowFlag={setFollowerFlag}
                subject="팔로워"
                userId={props.userId}
                user={props.user}
                myFollowings={props.myFollowings}
                setGetDataFlag={props.setGetDataFlag}
                setRefreshFlag={setRefreshFlag}
                refreshFlag={refreshFlag}
              />
            ) : null}
          </div>
          <div className="row2__following-wrapper">
            <div
              className="row2__following"
              onClick={(e) => {
                followingFlag === 0 ? setFollowingFlag(1) : setFollowingFlag(0);
              }}
            >
              {`팔로잉 ${props.user.following}명`}
            </div>
            {followingFlag === 1 ? (
              <Follow
                setFollowFlag={setFollowingFlag}
                subject="팔로잉"
                userId={props.userId}
                user={props.user}
                myFollowings={props.myFollowings}
                setGetDataFlag={props.setGetDataFlag}
                setRefreshFlag={setRefreshFlag}
                refreshFlag={refreshFlag}
              />
            ) : null}
          </div>
        </div>
        {props.user.introduction ? (
          <pre className="right__introduction">{props.user.introduction}</pre>
        ) : (
          <div className="right__introduction-none">
            자기소개를 작성하지 않았습니다
          </div>
        )}
      </div>
    </div>
  );
}
