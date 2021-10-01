import React from "react";
import { useSelector } from "react-redux";
import "../../SCSS/ProfilePage/Follow.scss";
import { Icon } from "@iconify/react";

export default function Follow(props) {
  // let follow__wrapper = document.querySelector(".follow__wrapper");
  const handleClickOutside = (event) => {
    if (event.target.className !== "follow__wrapper") props.setFollowFlag(0);
    console.log(event.target);
    // console.log(follow__wrapper);
  };
  document.addEventListener("mousedown", handleClickOutside);

  return (
    <div className="follow__wrapper">
      <div className="follow__header">
        <div className="box-space"></div>
        <div className="follow__subject">{props.subject}</div>
        <Icon
          icon="bx:bx-x"
          height="2rem"
          className="follow__x"
          onClick={() => {
            props.setFollowFlag(0);
          }}
        />
      </div>
      <div className="follow__list">안녕</div>
    </div>
  );
}
