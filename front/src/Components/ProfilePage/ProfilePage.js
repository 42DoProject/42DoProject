import React from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileBody from "./ProfileBody";
import ProfileRight from "./ProfileRight";
import "../../SCSS/ProfilePage/ProfilePage.scss";

export default function ProfilePage() {
  return (
    <>
      <div className="profilePage-wrap">
        <div className="column-left">
          <ProfileHeader />
          <ProfileBody />
        </div>
        <div className="column-right">
          <ProfileRight />
        </div>
      </div>
    </>
  );
}
