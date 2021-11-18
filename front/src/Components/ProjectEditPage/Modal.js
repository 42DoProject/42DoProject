import React from "react";
// import { Icon } from "@iconify/react";
import "../../SCSS/ProjectEditPage/Modal.scss";

export default function Modal({ body, buttons, setYes, setOpenFlag }) {
  return (
    <div className="validate__wrap">
      <div className="validate__header"></div>
      <div className="validate__body">{body}</div>
      <hr />
      <div className="validate__button">
        {buttons === "cancel-only" && (
          <div
            className="validate__cancel"
            onClick={() => {
              setOpenFlag(0);
            }}>
            확인
          </div>
        )}
        {/* {buttons === "confirm-only" && (
          <button className="validate__confirm">네</button>
        )} */}
        {buttons === "both" && (
          <>
            <div
              className="validate__cancel"
              onClick={() => {
                setOpenFlag(0);
              }}>
              취소
            </div>
            <div
              className="validate__confirm"
              onClick={() => {
                setOpenFlag(0);
                setYes(1);
              }}>
              확인
            </div>
          </>
        )}
      </div>
    </div>
  );
}
