import React from "react";
import { Popover, OverlayTrigger, Button } from "react-bootstrap";
import "../../../SCSS/MainPage/PopUp.scss";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export const Example = () => {
  return (
    <OverlayTrigger trigger="focus" placement="bottom" overlay={Pop()}>
      <Button variant="light">
        <div>
          <Icon
            className="Nav__menu-icon"
            icon="heroicons-outline:menu-alt-4"
          />
        </div>
      </Button>
    </OverlayTrigger>
  );
};

function Pop() {
  return (
    <Popover id="popover-basic">
      <Link to="/projectlist/recruit">
        <Popover.Body>프로젝트</Popover.Body>
      </Link>
      <div className="popover__wrap">
        <Link to="/cadet/recruit">
          <Popover.Body> 카뎃</Popover.Body>
        </Link>
        <Link to="/lounge">
          <Popover.Body>라운지</Popover.Body>
        </Link>
      </div>
    </Popover>
  );
}
