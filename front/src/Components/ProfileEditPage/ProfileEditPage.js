import React, { useEffect, useState } from "react";
import ProfileEditHeader from "./ProfileEditHeader";
import ProfileEditBody from "./ProfileEditBody";
import "../../SCSS/ProfileEditPage/ProfileEditPage.scss";
import { useDispatch, useSelector } from "react-redux";
// import { Redirect } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router";
import Modal from "../ProjectEditPage/Modal";

export default function ProfileEditPage() {
  const [userData, setUserData] = useState({});
  const loginState = useSelector((state) => state.loginReducer);
  const [profile, setProfile] = useState(loginState?.profileImage);
  const [openModal, setOpenModal] = useState(false);
  let history = useHistory();
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/user/me`,
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

  const updateMyProfile = async () => {
    const { data: profileImage } = await axios.get(
      `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/user/me`,
      {
        headers: {
          Authorization: `Bearer ${loginState.accessToken}`,
        },
      }
    );
    console.log("NEW PROFILE", profileImage);
    history.push("/profile");
    dispatch({ type: "PROFILE_UPDATE", payload: profileImage });
  };

  useEffect(() => {
    if (loginState === null) history.push("/");
    else getData();
  }, [loginState]);

  const submit = () => {
    const skill = document.querySelectorAll(".selected-img");
    let skillPost = [];
    const githubSpan = document.querySelector(".github-span").value;
    let githubPost;
    for (let el of skill) {
      skillPost.push(parseInt(el.alt));
    }
    githubSpan === "" ? (githubPost = null) : (githubPost = githubSpan);

    const formData = new FormData();
    if (profile !== loginState.profileImage) {
      formData.append("profile", profile);

      axios
        .all([
          axios({
            method: "POST",
            url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/user/me`,
            headers: {
              Authorization: `Bearer ${loginState.accessToken}`,
            },
            data: {
              statusMessage: document.querySelector(".profile__bubble").value,
              introduction: document.querySelector(".introduction__textarea")
                .value,
              github: githubPost,
              position: +document.querySelector(".job__content").value,
              skill: skillPost,
              status: +document.querySelector(".row2__status").value,
            },
          }),
          axios({
            method: "POST",
            url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/user/me/profile`,
            headers: {
              Authorization: `Bearer ${loginState.accessToken}`,
              "Content-Type": "multipart/form-data",
            },
            data: formData,
          }),
        ])
        .then((res) => {
          console.log(res);
          updateMyProfile();
        })
        .catch((e) => {
          console.log(e);
          console.log("Sorry!", e.response.data.error);
          setOpenModal(true);
        });
    } else {
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/user/me`,
        headers: {
          Authorization: `Bearer ${loginState.accessToken}`,
        },
        data: {
          statusMessage: document.querySelector(".profile__bubble").value,
          introduction: document.querySelector(".introduction__textarea").value,
          github: githubPost,
          position: +document.querySelector(".job__content").value,
          skill: skillPost,
          status: +document.querySelector(".row2__status").value,
        },
      })
        .then((res) => {
          console.log(res);
          history.push("/profile");
        })
        .catch((e) => {
          setOpenModal(true);
        });
    }
  };

  // console.log("loginState", loginState);

  return (
    <>
      <div className="profileEditPage-wrap">
        {openModal === true && (
          <Modal
            body="프로필 저장 중 에러가 발생했어요"
            buttons={["확인"]}
            cancelFunc={() => setOpenModal(false)}
          />
        )}
        <ProfileEditHeader
          user={userData}
          submit={submit}
          setProfile={setProfile}
        />
        <hr />
        <ProfileEditBody user={userData} />
      </div>
    </>
  );
}
