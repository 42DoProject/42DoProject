import React from "react";
import axios from "axios";
import "../../SCSS/ProfilePage/UnfollowAlert.scss";

export default function UnfollowAlert(props) {
  return (
    <div className="unfollow__alert">
      <div>
        <img className="unfollow__img" src={props.user.profileImage} />
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
          console.log(props.user);
          console.log("userID", props.user.userId);
          await axios.get(
            `http://localhost:5000/user/unfollow/${props.user.userId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          props.setGetDataFlag(1);
          props.setFollowButton("follow");
          props.setRefreshFlag(1);
          props.setUnfollowAlert(0);
        }}>
        팔로우 취소
      </div>
      <hr />
      <div
        className="unfollow__cancel"
        onClick={() => {
          props.setUnfollowAlert(0);
        }}>
        취소
      </div>
    </div>
  );
}
