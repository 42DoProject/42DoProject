import React from "react";
import { Popover, OverlayTrigger, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../../SCSS/MainPage/PopUp.scss";

const popover = (
  <Popover id="popover-basic">
    <Link to="/profile">
      <Popover.Body>Profile</Popover.Body>
    </Link>
    <div
      className="popover__wrap"
      onClick={() => {
        localStorage.removeItem("user");
      }}
    >
      <Popover.Body>SIGN OUT</Popover.Body>
    </div>
  </Popover>
);

export const Example = ({ username }) => (
  <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
    <Button variant="light">{username}</Button>
  </OverlayTrigger>
);
