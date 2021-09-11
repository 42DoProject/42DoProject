import React from "react";
import "../../SCSS/ProfilePage/ProfileRight.scss";
// import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";

export default function ProfileRight() {
  let userState = store.userReducer;
  return (
    <div>
      <div className="column-right__following">
        <span>피드</span>
        <div>
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
      <div className="column-right__follower">
        <span>나를 팔로우한 카뎃</span>
        <div></div>
      </div>
      <div className="column-right__other-cadets">
        <span>내가 팔로우한 카뎃</span>
        <div></div>
      </div>
    </div>
  );
}
