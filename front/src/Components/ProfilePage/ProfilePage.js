import React, { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileBody from "./ProfileBody";
import "../../SCSS/ProfilePage/ProfilePage.scss";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { useHistory, useLocation, useParams } from "react-router";

export default function ProfilePage() {
  const [userData, setUserData] = useState([]);
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
  let loginState = useSelector((state) => state.loginReducer);
  const userId = useParams()["id"];
  const history = useHistory();
  const location = useLocation();

  const getData = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/user/profile/${userId}`
      );
      setUserData(data);
    } catch (err) {
      console.log(err);
      history.push("/");
    }
  };
  const getMyData = async () => {
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
    if (location.pathname !== "/profile") getData();
    else getMyData();
  }, []);

  if (location.pathname === "/profile" && loginState === null) {
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
