import React, { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileBody from "./ProfileBody";
import "../../SCSS/ProfilePage/ProfilePage.scss";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { useLocation, useParams } from "react-router";

export default function ProfilePage() {
  const [userData, setUserData] = useState([]);
  let loginState = useSelector((state) => state.loginReducer);
  const userId = useParams()["id"];
  const location = useLocation();
  const [myFollowings, setMyFollowings] = useState([]);
  const [getDataFlag, setGetDataFlag] = useState(0);

  const getData = async () => {
    try {
      if (userId) {
        const { data } = await axios.get(
          `http://localhost:5000/user/profile/${userId}`
        );
        setUserData(data);
      }
      const { data: myData } = await axios.get(
        "http://localhost:5000/user/me",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMyFollowings(myData.followings);
    } catch (err) {
      console.log(err);
      // history.push("/");
    }
  };
  const getMyData = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/user/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setUserData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (location.pathname !== "/profile" || getDataFlag === 1) {
      getData();
      setGetDataFlag(0);
    } else getMyData();
  }, [getDataFlag]);

  if (location.pathname === "/profile" && loginState === null) {
    return <Redirect to="/" />;
  } else if (loginState !== null && Number(userId) === loginState.id)
    return <Redirect to="/profile" />;
  else
    return (
      <div className="profilePage-wrap">
        <ProfileHeader
          user={userData}
          location={location}
          userId={userId}
          myFollowings={myFollowings}
          setGetDataFlag={setGetDataFlag}
        />
        <hr />
        <ProfileBody user={userData} location={location} />
      </div>
    );
}
