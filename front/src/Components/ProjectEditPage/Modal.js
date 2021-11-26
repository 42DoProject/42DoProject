import React from "react";
import "../../SCSS/ProjectEditPage/Modal.scss";

export default function Modal({ body, buttons, confirmFunc, cancelFunc }) {
  return (
    <div className="validate__wrap">
      <div className="validate__header"></div>
      <div className="validate__body">{body}</div>
      <hr />
      <div className="validate__button">
        {buttons.length === 1 && ( // ["확인"]
          <div onClick={() => confirmFunc()}>{buttons[0]}</div>
        )}
        {buttons.length === 2 && ( // ["취소", "확인"]
          <>
            <div onClick={() => cancelFunc()}>{buttons[0]}</div>
            <div onClick={() => confirmFunc()}>{buttons[1]}</div>
          </>
        )}
      </div>
    </div>
  );
}
