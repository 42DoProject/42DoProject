import React from "react";
import "../../SCSS/MainPage/Cadet.scss";
import CadetCards from "./CadetCards";
export default function Cadet() {
  return (
    <div className="cadet">
      <div className="cadet__title">프로젝트를 찾고있는 카뎃</div>
      <div className="cadet__list">
        <CadetCards />
        <CadetCards />
        <CadetCards />
        <CadetCards />
        <CadetCards />
        <CadetCards />
      </div>
    </div>
  );
}
