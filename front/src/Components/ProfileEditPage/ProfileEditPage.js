import React, { useEffect, useState } from "react";
import ProfileEditHeader from "./ProfileEditHeader";
import ProfileEditBody from "./ProfileEditBody";
import "../../SCSS/ProfileEditPage/ProfileEditPage.scss";
import { useSelector } from "react-redux";
// import { Redirect } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router";

export default function ProfileEditPage() {
  const [userData, setUserData] = useState({});
  const loginState = useSelector((state) => state.loginReducer);
  let history = useHistory();

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
      .catch((e) => console.log(e));
  };

  // console.log("loginState", loginState);

  return (
    <>
      <div className="profileEditPage-wrap">
        <ProfileEditHeader user={userData} submit={submit} />
        <hr />
        <ProfileEditBody user={userData} />
      </div>
    </>
  );
}
