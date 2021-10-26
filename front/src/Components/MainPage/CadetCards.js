import React from "react";
import "../../SCSS/MainPage/CadetCards.scss";
import defaultImg from "../../default_intra.png";

export default function CadetCards() {
  return (
    <div className="cadet-card">
      <img className="cadet__image" src={defaultImg} alt="cadet_image" />
      <div className="cadet__name">jiylee</div>
      <div className="cadet__work">프론트엔드</div>
      <div className="cadet__word">
        리액트를 이용한 웹 프론트엔드 개발을 해보고 싶습니다.
      </div>
    </div>
  );
}
