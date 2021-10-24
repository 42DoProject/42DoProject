import React from "react";
import { Icon } from "@iconify/react";
import "../../SCSS/ProjectEditPage/ValidateModal.scss";

export default function ValidateModal(props) {
  return (
    <div className="validate__wrap">
      <div className="validate__header"></div>
      <div className="validate__body">{props.body}</div>
      <div className="validate__button">
        {props.buttons === "cancel-only" && (
          <button
            className="validate__cancel"
            onClick={() => {
              props.setValidateFlag(0);
            }}>
            확인
          </button>
        )}
        {/* {props.buttons === "confirm-only" && (
          <button className="validate__confirm">네</button>
        )} */}
        {props.buttons === "both" && (
          <>
            <button
              className="validate__cancel"
              onClick={() => {
                props.setValidateFlag(0);
              }}>
              아니요
            </button>
            <button
              className="validate__confirm"
              onClick={() => props.setIsValid(1)}>
              네
            </button>
          </>
        )}
      </div>
    </div>
  );
}
