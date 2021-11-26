import React, { useState } from "react";
import { useSelector } from "react-redux";
import "../../SCSS/LoungePage/LoungeWrite.scss";
import axios from "axios";
import defaultImg from "../../default_intra.png";
import { Icon } from "@iconify/react";
import Modal from "../ProjectEditPage/Modal";

export default function LoungeWrite({ refreshFlag, setRefreshFlag }) {
  const loginState = useSelector((state) => state.loginReducer);
  const [openModal, setOpenModal] = useState(false);
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
      {openModal === true && (
        <Modal
          body="로그인해 주세요"
          buttons={["확인"]}
          confirmFunc={() => setOpenModal(false)}
        />
      )}
      <div className="lounge-write__profile">
        {loginState ? (
          <img
            className="profile__img"
            src={loginState?.profileImage || defaultImg}
            alt="profile__img"></img>
        ) : (
          <Icon className="profile__icon" icon="bi:person-circle" />
        )}

        <span className="profile__name">
          {loginState !== null ? loginState.name || "user" : "guest"}
        </span>
      </div>
      <div className="lounge-write__space">
        <textarea
          className="lounge-write__box"
          placeholder="새로운 글을 작성해 보세요"
          spellCheck="false"
          maxLength="800"
          onClick={(e) => {
            e.target.value = "";
          }}></textarea>
        <button
          type="submit"
          className="lounge-write__submit"
          onClick={() => {
            if (loginState === null) setOpenModal(true);
            else {
              const textEl = document.querySelector(".lounge-write__box");
              if (textEl.value !== "") postLounge(textEl.value);
              textEl.value = "";
            }
          }}>
          등록
        </button>
      </div>
    </div>
  );
}
