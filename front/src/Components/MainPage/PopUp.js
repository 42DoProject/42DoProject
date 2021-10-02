import React from "react";
import { Popover, OverlayTrigger, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../../SCSS/MainPage/PopUp.scss";
import axios from "axios";

export const Example = () => {
  let loginState = useSelector((state) => state.loginReducer);
  return (
    <OverlayTrigger trigger="focus" placement="bottom" overlay={Pop()}>
      <Button variant="light">
        <div>{loginState.name}</div>
        <div className="Nav__user image">
          <img
            className="IntraImage"
            src={loginState.profileImage}
            alt="intraImage"
          />
        </div>
      </Button>
    </OverlayTrigger>
  );
};

function Pop() {
  let dispatch = useDispatch();
  return (
    <Popover id="popover-basic">
      <Link to="/profile">
        <Popover.Body>프로필 보기</Popover.Body>
      </Link>
      <div
        className="popover__wrap"
        onClick={() => {
          logOut();
          dispatch({ type: "LOGOUT" });
        }}
      >
        <Popover.Body>SIGN OUT</Popover.Body>
      </div>
    </Popover>
  );
}

function logOut() {
  axios.get(`http://localhost:5000/auth/signout`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  const timerId = localStorage.getItem("timerId");
  clearInterval(timerId);
}
