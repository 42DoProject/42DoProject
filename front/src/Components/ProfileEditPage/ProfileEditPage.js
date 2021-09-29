import React from "react";
import ProfileEditHeader from "./ProfileEditHeader";
import ProfileEditBody from "./ProfileEditBody";
import "../../SCSS/ProfileEditPage/ProfileEditPage.scss";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

export default function ProfileEditPage() {
  let loginState = useSelector((state) => state.loginReducer);
  if (loginState === null) {
    return <Redirect to="/" />;
  }
  return (
    <>
      <div className="profileEditPage-wrap">
        <ProfileEditHeader />
        <hr />
        <ProfileEditBody />
      </div>
    </>
  );
}
