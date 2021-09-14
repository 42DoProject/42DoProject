import React from "react";
import { useSelector } from "react-redux";
import "../../SCSS/MainPage/DashCards.scss";
export default function DashCards() {
  let store = useSelector((store) => {
    return store;
  });
  let userState = store.userReducer;
  return (
    <div className="DashCards">
      <div className="DashCards__image">
        <img src={userState.progressProject[0].image} alt={"progress" + 1} />
        <div className="DashCards__title">
          {userState.progressProject[0].title}
        </div>
      </div>
    </div>
  );
}
