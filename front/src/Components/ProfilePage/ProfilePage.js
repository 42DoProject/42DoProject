import React from "react";
import Navbar from "../CommonComponent/Navbar";
import ProfileHeader from "./ProfileHeader";
import ProfileBody from "./ProfileBody";
import ProfileRight from "./ProfileRight";
import Chat from "../CommonComponent/Chat";
import "../../SCSS/ProfilePage/ProfilePage.scss";

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <div className="profilePage-wrap">
        <div className="column-left">
          <ProfileHeader />
          <ProfileBody />
        </div>
        <div className="column-right">
          <ProfileRight />
        </div>
      </div>
      <Chat />
    </>
  );
}
