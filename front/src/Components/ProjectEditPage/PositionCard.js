import React, { useState } from "react";
import "../../SCSS/ProjectEditPage/ProjectEditPage.scss";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Icon } from "@iconify/react";
import "../../SCSS/ProjectEditPage/PositionCard.scss";

export default function PositionCard(props) {
  return (
    <div className="positionCard">
      {/* <img className="positionCard__img" /> */}
      <div className="positionCard__img">
        <Icon
          icon="bx:bx-chair"
          style={{ fontSize: "3.5rem", color: "#e5e5e5" }}
        />
      </div>
      <div className="positionCard__select">
        <div className="positionCard__position">백엔드</div>
        <Icon
          className="positionCard__x"
          icon="bx:bx-x"
          style={{ fontSize: "1.2rem", cursor: "pointer" }}
        />
      </div>
    </div>
  );
}
