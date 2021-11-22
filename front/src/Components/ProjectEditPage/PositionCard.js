import React, { useState } from "react";
import "../../SCSS/ProjectEditPage/ProjectEditPage.scss";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Icon } from "@iconify/react";
import "../../SCSS/ProjectEditPage/PositionCard.scss";

export default function PositionCard(props) {
  return (
    <div className="positionCard">
      {props.image === "noImage" ? (
        <div className="positionCard__img">
          <Icon
            icon="bx:bx-chair"
            style={{ fontSize: "3.5rem", color: "#e5e5e5" }}
          />
        </div>
      ) : (
        <img className="positionCard__img" src={props.image} />
      )}

      {props.xdelete === "enabled" ? (
        <>
          <div className="positionCard__select">
            {/* <div className="positionCard__empty-div"></div> */}
            <div className="positionCard__position">{props.subject}</div>
            <Icon
              className="positionCard__x"
              icon="bi:x-circle-fill"
              onClick={() => {
                let dup = [...props.selectedPos];
                dup.splice(props.idx, 1);
                props.setSelectedPos(dup);
              }}
            />
          </div>
        </>
      ) : (
        <div
          className="positionCard__select"
          style={{ backgroundColor: "#a7bc5b", color: "#ffffff" }}>
          <div className="positionCard__position">{props.subject}</div>
        </div>
      )}
    </div>
  );
}
