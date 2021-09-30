import React, { useState } from "react";
import { useSelector } from "react-redux";
import "../../SCSS/ProfilePage/ProfileHeader.scss";
// import { Icon } from "@iconify/react";

export default function ProfileEditHeader() {
  // let userState = useSelector((state) => state.userReducer);
  let loginState = useSelector((state) => state.loginReducer);
  let [bubbleLength, setBubbleLength] = useState(0);
  let [introLength, setIntroLength] = useState(0);

  return (
    <div className="profileHeader">
      <div className="header__left">
        <img
          className="profileImage"
          alt="profileImage"
          src={loginState.profileImage}
        />
        <div className="bubble__wrapper">
          <textarea
            spellCheck="false"
            className="profile__bubble"
            maxLength="30"
            placeholder="ex. 리액트를 이용한 웹 프론트엔드 개발을 해보고 싶습니다!"
            onChange={(e) => {
              if (e.target.value.length > e.target.maxLength) {
                e.target.value.substr(0, e.target.maxLength); //한글 처리
              } else setBubbleLength(e.target.value.length);
            }}
          />
          <div className="bubble__letters-count">{bubbleLength} / 30</div>
        </div>
        <div className="profile__last-access">마지막 접속: 3일 전</div>
      </div>
      <div className="header__right">
        <div className="right__row1">
          <div className="row1__name">{loginState.name}</div>
          <input
            type="submit"
            className="row1__finish-edit"
            value="프로필 저장"
          />
        </div>
        <div className="right__row2">
          <select className="row2__status">
            <option value="프로젝트_찾는_중">프로젝트 찾는 중</option>
            <option value="휴식중">휴식중</option>
          </select>
          <div className="row2__follower">팔로워 10명</div>
          <div className="row2__following">팔로워 15명</div>
        </div>
        <div className="right__introduction">
          <textarea
            spellCheck="false"
            className="introduction__textarea"
            maxLength="500"
            placeholder="자기소개를 작성해주세요. (ex. 내가 잘하는 분야, 하고 싶은 프로젝트, 배우고 싶은 스킬 등)"
            onChange={(e) => {
              if (e.target.value.length > e.target.maxLength) {
                e.target.value.substr(0, e.target.maxLength); //한글 처리
              } else setIntroLength(e.target.value.length);
            }}
          />
          <div className="introduction__letters-count">{introLength} / 500</div>
        </div>
      </div>
    </div>
  );
}
