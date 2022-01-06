import React from "react";
import "../../SCSS/ProjectEditPage/Modal.scss";

export default function Modal({ body, buttons, confirmFunc, cancelFunc }) {
  return (
    <div className="modal__background">
      <div className="modal__wrap">
        <div className="modal__header"></div>
        <div className="modal__body">{body}</div>
        <hr />
        <div className="modal__button">
          {buttons.length === 1 && ( // ["확인"]: 기능은 cancel(모달창닫기 등)하는 기능에 해당
            <div onClick={() => cancelFunc()}>{buttons[0]}</div>
          )}
          {buttons.length === 2 && ( // ["취소", "확인"] : cancel(모달창닫기), confirm(계속 진행)
            <>
              <div onClick={() => cancelFunc()}>{buttons[0]}</div>
              <div onClick={() => confirmFunc()}>{buttons[1]}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
