import React from "react";
import "../../SCSS/ProjectEditPage/Unsplash.scss";

export default function Unsplash(props) {
  return (
    <div className="unsplash__wrapper">
      <div className="unsplash__header">
        <div className="box-space"></div>
        <div className="unsplash__subject">{props.subject}</div>
        <Icon
          icon="bx:bx-x"
          height="2rem"
          className="unsplash__x"
          onClick={() => {
            props.setUnsplashFlag(0);
          }}
        />
      </div>
    </div>
  );
}
