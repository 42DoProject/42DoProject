import React, { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileBody from "./ProfileBody";
import "../../SCSS/ProfilePage/ProfilePage.scss";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";

export default function ProfilePage() {
  const [userData, setUserData] = useState([]);
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
  let loginState = useSelector((state) => state.loginReducer);
  const getData = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/user/me", {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
      setUserData(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  if (loginState === null) {
    return <Redirect to="/" />;
  }
  return (
    <>
      <div className="profilePage-wrap">
        <ProfileHeader user={userData} />
        <hr />
        <ProfileBody user={userData} />
      </div>
    </>
  );
}
