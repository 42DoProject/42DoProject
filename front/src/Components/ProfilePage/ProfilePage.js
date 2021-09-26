import React from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileBody from "./ProfileBody";
import "../../SCSS/ProfilePage/ProfilePage.scss";

export default function ProfilePage() {
  return (
    <>
      <div className="profilePage-wrap">
        <ProfileHeader />
        <hr />
        <ProfileBody />
      </div>
    </>
  );
}
