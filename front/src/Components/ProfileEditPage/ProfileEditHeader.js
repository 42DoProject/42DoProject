import React from "react";
import { useSelector } from "react-redux";
import "../../SCSS/ProfilePage/ProfileHeader.scss";
// import { Icon } from "@iconify/react";

export default function ProfileEditHeader() {
  // let userState = useSelector((state) => state.userReducer);
  let loginState = useSelector((state) => state.loginReducer);

  return (
    <div className="profileHeader">
      <div className="header__left">
        <img
          className="profileImage"
          alt="profileImage"
          // src={loginState.profileImage}
        />

        <textarea
          spellcheck="false"
          className="profile__bubble"
          maxlength="30"
        />
        <div className="profile__last-access">마지막 접속: 3일 전</div>
      </div>
      <div className="header__right">
        <div className="right__row1">
          {/* <div className="row1__name">{loginState.name}</div> */}
          <div className="row1__name">seojeong</div>
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
        <textarea spellcheck="false" className="right__introduction" />
      </div>
    </div>
  );
}
