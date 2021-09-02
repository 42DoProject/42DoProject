import React from "react";
import "../../SCSS/ProfilePage/ProfileRight.scss";
// import { Icon } from "@iconify/react";

export default function ProfileRight() {
  return (
    <div>
      <div className="column-right__following">
        <span>jiylee님이 팔로우한 카뎃</span>
        <div></div>
      </div>
      <div className="column-right__follower">
        <span>jiylee님을 팔로우한 카뎃</span>
        <div></div>
      </div>
      <div className="column-right__other-cadets">
        <span>다른 카뎃들</span>
        <div></div>
      </div>
    </div>
  );
}
