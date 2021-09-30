import React from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileBody from "./ProfileBody";
import "../../SCSS/ProfilePage/ProfilePage.scss";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

export default function ProfilePage() {
  let loginState = useSelector((state) => state.loginReducer);
  if (loginState === null) {
    return <Redirect to="/" />;
  }
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
