import React from "react";
import "../../SCSS/MainPage/CadetCards.scss";
import defaultImg from "../../default_intra.png";
import { positions } from "../../userData";
import { Redirect, useHistory } from "react-router";

export default function CadetCards({ cadetData }) {
  const history = useHistory();

  return (
    <div
      className="cadet-card"
      onClick={() => {
        history.push(`/profile/${cadetData.id}`);
      }}>
      <img
        className="cadet__image"
        src={cadetData.profileImage || defaultImg}
        alt="cadet_image"
      />
      <div className="cadet__name">{cadetData.username}</div>
      <div className="cadet__work">{positions[cadetData.position]}</div>
      {cadetData.statusMessage ? (
        <div className="cadet__word-wrap">
          <div className="cadet__word">{cadetData.statusMessage}</div>
        </div>
      ) : (
        <div className="cadet__no-word">작성된 한마디가 없습니다</div>
      )}
    </div>
  );
}
