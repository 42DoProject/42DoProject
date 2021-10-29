import React from "react";
import axios from "axios";
import "../../SCSS/ProfilePage/UnfollowAlert.scss";
import { useSelector } from "react-redux";

export default function UnfollowAlert(props) {
  const loginState = useSelector((state) => state.loginReducer);

  return (
    <div className="unfollow__alert">
      <div>
        <img
          className="unfollow__img"
          src={props.user.profileImage}
          alt={props.user.username}
        />
        <div className="unfollow__desc">
          팔로우를 취소하면{" "}
          <span className="unfollow__user">{props.user.username}</span>
          님의 소식을 더이상 받을 수 없게 됩니다.
        </div>
      </div>
      <hr />
      <div
        className="unfollow__unfollow"
        onClick={async (e) => {
          try {
            await axios.get(
              `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/user/unfollow/${props.userId}`,
              {
                headers: {
                  Authorization: `Bearer ${loginState.accessToken}`,
                },
              }
            );
            console.log("Successfully unfollowed userId:", props.userId);
            props.setGetDataFlag(1);
            props.setFollowButton("follow");
            props.setRefreshFlag(1);
            props.setUnfollowAlert(0);
          } catch (err) {
            console.log(err);
          }
        }}
      >
        팔로우 취소
      </div>
      <hr />
      <div
        className="unfollow__cancel"
        onClick={() => {
          props.setUnfollowAlert(0);
        }}
      >
        취소
      </div>
    </div>
  );
}
