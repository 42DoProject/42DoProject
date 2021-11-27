import React, { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileBody from "./ProfileBody";
import "../../SCSS/ProfilePage/ProfilePage.scss";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { useHistory, useLocation, useParams } from "react-router";
import ReactLoading from "../CommonComponent/Loading";
import Modal from "../ProjectEditPage/Modal";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const loginState = useSelector((state) => state.loginReducer);
  const userId = useParams()["id"];
  const location = useLocation();
  const history = useHistory();
  const [myFollowings, setMyFollowings] = useState([]);
  const [getDataFlag, setGetDataFlag] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const getData = async () => {
    try {
      if (userId) {
        const { data } = await axios.get(
          `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/user/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${loginState?.accessToken}`,
            },
          }
        );
        setUserData(data);
      }
    } catch (err) {
      console.log(err);
      setOpenModal(true);
      // history.push("/");
    }
  };

  const getMyFollowings = async () => {
    try {
      const { data: myData } = await axios.get(
        `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/user/me`,
        {
          headers: {
            Authorization: `Bearer ${loginState.accessToken}`,
          },
        }
      );
      setMyFollowings(myData.followings);
    } catch (err) {
      console.log(err);
    }
  };

  const getMyData = async () => {
    try {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/user/me`,
        {
          headers: {
            Authorization: `Bearer ${loginState.accessToken}`,
          },
        }
      );
      setUserData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // console.log("loginState", loginState);
    if (loginState !== null) getMyFollowings();
    if (location.pathname !== "/profile" || getDataFlag === 1) getData();
    else getMyData();
    setGetDataFlag(0);
  }, [getDataFlag, loginState, location]);

  if (location.pathname === "/profile" && loginState === null) {
    return <Redirect to="/" />;
  } else if (loginState !== null && Number(userId) === loginState.id)
    return <Redirect to="/profile" />;
  else
    return userData === null ? (
      <div className="proflePage-wrap">
        {openModal && (
          <Modal
            body="존재하지 않는 유저입니다"
            buttons={["확인"]}
            confirmFunc={() => {
              setOpenModal(false);
              history.goBack();
            }}
          />
        )}
        <ReactLoading type="spin" color="#a7bc5b" />
      </div>
    ) : (
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
