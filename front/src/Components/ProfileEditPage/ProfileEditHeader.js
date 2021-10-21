import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../SCSS/ProfilePage/ProfileHeader.scss";
import { status } from "../../userData";
import relativeTime from "../../relativeTime";

export default function ProfileEditHeader(props) {
  // let userState = useSelector((state) => state.userReducer);
  const loginState = useSelector((state) => state.loginReducer);
  const [bubbleLength, setBubbleLength] = useState(0);
  const [introLength, setIntroLength] = useState(0);
  const [statusColor, setStatusColor] = useState("#ff6864");
  const statusEl = document.querySelector(".row2__status");

  useEffect(() => {
    if (props.user.status) setStatusColor("#5bbcb6");
    else setStatusColor("#c4c4c4");

    props.user.statusMessage &&
      setBubbleLength(props.user.statusMessage.length);
    props.user.introduction && setIntroLength(props.user.introduction.length);
  }, [props]);

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
            defaultValue={props.user.statusMessage}
            onChange={(e) => {
              if (e.target.value.length > e.target.maxLength) {
                e.target.value.substr(0, e.target.maxLength); //한글 처리
              } else setBubbleLength(e.target.value.length);
            }}
          />
          <div className="bubble__letters-count">{bubbleLength} / 30</div>
        </div>
        <div className="profile__last-access">
          {props.user.lastAccess === "online" ? (
            <span className="profile__online">접속중</span>
          ) : (
            `마지막 접속: ${relativeTime(Date.parse(props.user.lastAccess))}`
          )}
        </div>
      </div>
      <div className="header__right">
        <div className="right__row1">
          <div className="row1__name">{loginState.name}</div>
          <input
            type="submit"
            className="row1__finish-edit"
            value="프로필 저장"
            onClick={() => {
              props.submit();
            }}
          />
        </div>
        <div className="right__row2">
          <select
            className="row2__status"
            style={{ backgroundColor: statusColor }}
            onChange={() => {
              let idx = +statusEl.value;
              if (idx) {
                setStatusColor("#5bbcb6");
              } else {
                setStatusColor("#c4c4c4");
              }
            }}>
            {status.map((v, idx) => {
              return idx === props.user.status ? (
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
          <div className="row2__follower">팔로워 {props.user.follower}명</div>
          <div className="row2__following">팔로우 {props.user.following}명</div>
        </div>
        <div className="right__introduction">
          <textarea
            spellCheck="false"
            className="introduction__textarea"
            maxLength="500"
            placeholder="자기소개를 작성해주세요. (ex. 내가 잘하는 분야, 하고 싶은 프로젝트, 배우고 싶은 스킬 등)"
            defaultValue={props.user.introduction}
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
