import React from "react";
import { Popover, OverlayTrigger, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../../SCSS/MainPage/PopUp.scss";

export const Example = ({ username }) => {
  return (
    <OverlayTrigger trigger="click" placement="bottom" overlay={Pop()}>
      <Button variant="light">{username}</Button>
    </OverlayTrigger>
  );
};

function Pop() {
  let dispatch = useDispatch();
  // let loginState = useSelector((state) => state.loginReducer);
  return (
    <Popover id="popover-basic">
      <Link to="/profile">
        <Popover.Body>Profile</Popover.Body>
      </Link>
      <div
        className="popover__wrap"
        onClick={() => {
          dispatch({ type: "LOGOUT" });
          // console.log(loginState);
        }}
      >
        <Popover.Body>SIGN OUT</Popover.Body>
      </div>
    </Popover>
  );
}
