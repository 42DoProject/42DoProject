import React from "react";
// import { Icon } from "@iconify/react";
import "../../SCSS/ProjectDetail/CheckModal.scss";
import axios from "axios";

export default function CheckModal({
  positions,
  preposition,
  setModalFlag,
  data,
  setApplyFlag,
  setToggleNum,
  loginState,
  modalFlag,
  setIconStyle,
}) {
  const ChangePosition = (e, elm) => {
    const selected_position = document.querySelector(".job__content").value;
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project/position/${data.id}/${loginState.id}/${selected_position}`,
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
        setApplyFlag(1);
        setToggleNum(0);
        setIconStyle("bi:caret-down-fill");
      })
      .catch((e) => console.log(e));
    e.preventDefault();
  };
  return (
    <>
      {modalFlag === 1 && (
        <div className="validate__wrap">
          <div className="validate__body">
            <select id="job_select" className="job__content">
              {positions.map((v, idx) => {
                return idx === preposition ? (
                  <option key={idx} value={idx} selected>
                    {v}
                  </option>
                ) : (
                  <option key={idx} value={idx}>
                    {v}
                  </option>
                );
              })}
            </select>
          </div>
          <hr />
          <div className="validate__button">
            <div
              className="validate__cancel"
              onClick={() => {
                setModalFlag(0);
              }}
            >
              취소
            </div>
            <div
              className="validate__confirm"
              onClick={(e) => {
                ChangePosition(e);
                setModalFlag(0);
              }}
            >
              변경하기
            </div>
          </div>
        </div>
      )}
    </>
  );
}
