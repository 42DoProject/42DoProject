import React, { useState } from "react";
import { Popover, OverlayTrigger, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "../../SCSS/MainPage/PopUp.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import defaultImg from "../../default_intra.png";

export const Example = () => {
  let loginState = useSelector((state) => state.loginReducer);

  return (
    <OverlayTrigger
      trigger={("focus", "click")}
      placement="bottom"
      rootClose
      overlay={Pop()}
    >
      <Button variant="light">
        <div>{loginState.name || "user"}</div>
        <div className="Nav__user image">
          <img
            className="IntraImage"
            src={loginState.profileImage || defaultImg}
            alt="intraImage"
          />
        </div>
      </Button>
    </OverlayTrigger>
  );
};

function Pop() {
  let dispatch = useDispatch();
  let loginState = useSelector((state) => state.loginReducer);
  return (
    <Popover id="popover-basic">
      <Link to="/profile">
        <Popover.Body>프로필 보기</Popover.Body>
      </Link>
      <div
        className="popover__wrap"
        onClick={() => {
          logOut(loginState.accessToken);
          dispatch({ type: "LOGOUT" });
        }}
      >
        <Popover.Body>SIGN OUT</Popover.Body>
      </div>
    </Popover>
  );
}

function logOut(accessToken) {
  try {
    axios.get(
      `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/auth/signout`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const timerId = localStorage.getItem("timerId");
    clearInterval(timerId);
  } catch (err) {
    console.log(err);
  }
}
