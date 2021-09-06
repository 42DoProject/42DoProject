import React, { useState } from "react";
import { Icon } from "@iconify/react";
import "../../SCSS/Navbar.scss";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Navbar() {
  let [clickFlag, setClickFlag] = useState(0);
  let store = useSelector((store) => {
    return store;
  });
  let userState = store.userReducer;
  return (
    <div className="Nav">
      <div className="Nav-column1">
        <Link to="/">
          <div className="Nav__title">
            <Icon className="title-icon" icon="simple-icons:42" />
            <div className="title-text">DoProject</div>
          </div>
        </Link>
        <div className="Nav__input">
          <Icon className="input-icon" icon="fe:search" />
          <input placeholder="카뎃 닉네임, 프로젝트명 등을 검색해보세요"></input>
        </div>
      </div>
      <div className="Nav-column2">
        <div className="Nav__project">
          <Link className="a-color" to="/allproject">
            프로젝트
          </Link>
        </div>

        <div className="Nav__cadet">
          <Link className="a-color" to="/cadet">
            카뎃
          </Link>
        </div>
        <div className="Nav__lounge">
          <Link className="a-color" to="/lounge">
            라운지
          </Link>
        </div>
        <div className="Nav__notification">
          {parseInt(userState.notification.num) ? (
            <span className="haveNotification">
              {userState.notification.num}
            </span>
          ) : (
            <span className="notNotification">{0}</span>
          )}
          <Icon
            className="icon"
            icon="carbon:notification"
            onClick={() => {
              let iconEl = document.querySelector(".icon");
              if (clickFlag === 0) {
                setClickFlag(1);
                iconEl.style.color = "#a7bc5b";
              } else {
                setClickFlag(0);
                iconEl.style.color = "#565656";
              }
            }}
          />
          {clickFlag === 1 && (
            <div className="notiText__wrap">
              <div className="notiText__header">
                <div className="header__text">알림</div>
              </div>
              <div className="notiText__body">
                {userState.notification.list.map((e) => {
                  return (
                    <div className="body__card">
                      <div className="card__row1">
                        <div className="card__title">{e.title}</div>
                        <div className="card__date">{e.date}</div>
                      </div>
                      <div className="card__text">{e.text}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <Link to="/profile">
          <div className="Nav__user">
            <div className="Nav__user name">{userState.intraName}</div>
            <div className="Nav__user image">
              {userState.intraImage ? (
                <img
                  className="IntraImage"
                  src={userState.intraImage}
                  alt="intraImage"
                />
              ) : (
                <Icon icon="bi:person-fill" />
              )}
            </div>
          </div>
        </Link>
        <div className="Nav__menu">
          <Icon icon="heroicons-outline:menu-alt-4" />
        </div>
      </div>
    </div>
  );
}