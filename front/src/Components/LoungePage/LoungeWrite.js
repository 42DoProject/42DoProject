import React from "react";
import { useSelector } from "react-redux";
import "../../SCSS/LoungePage/LoungeWrite.scss";
// import { Link } from "react-router-dom";

export default function LoungeWrite() {
  let loginState = useSelector((state) => state.loginReducer);
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
      <form className="lounge-write__space">
        <input className="lounge-write__box"></input>
        <button type="submit" className="lounge-write__submit">
          등록
        </button>
      </form>
    </div>
  );
}
