import React from "react";
import "../../SCSS/MainPage/Cadet.scss";
import CadetCards from "./CadetCards";
export default function Cadet() {
  return (
    <div className="cadet">
      <div className="cadet__title">프로젝트를 찾고있는 카뎃</div>
      <div className="cadet__list">
        <div className="list__row1">
          <CadetCards />
          <CadetCards />
          <CadetCards />
        </div>
        <div className="list__row2">
          <CadetCards />
          <CadetCards />
          <CadetCards />
        </div>
      </div>
    </div>
  );
}
