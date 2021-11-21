import React, { useState } from "react";
import { useSelector } from "react-redux";
import "../../SCSS/LoungePage/LoungeWrite.scss";
import axios from "axios";

export default function LoungeWrite({ refreshFlag, setRefreshFlag }) {
  const loginState = useSelector((state) => state.loginReducer);
  const postLounge = async (textValue) => {
    try {
      await axios({
        method: "POST",
        url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/lounge`,
        headers: {
          Authorization: `Bearer ${loginState.accessToken}`,
        },
        data: {
          comment: textValue,
        },
      });
      refreshFlag ? setRefreshFlag(0) : setRefreshFlag(1);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="lounge-write">
      <div className="lounge-write__profile">
        <img
          className="profile__img"
          src={loginState !== null ? loginState.profileImage : null}
          alt="profile__img"></img>

        <span className="profile__name">
          {loginState !== null ? loginState.name : null}
        </span>
      </div>
      <div className="lounge-write__space">
        <textarea
          className="lounge-write__box"
          placeholder="새로운 글을 작성해 보세요."
          spellCheck="false"
          maxLength="800"
          onClick={(e) => {
            e.target.value = "";
          }}></textarea>
        <button
          type="submit"
          className="lounge-write__submit"
          onClick={() => {
            const textEl = document.querySelector(".lounge-write__box");
            postLounge(textEl.value);
            textEl.value = "";
          }}>
          등록
        </button>
      </div>
    </div>
  );
}
