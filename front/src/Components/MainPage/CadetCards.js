import React, { useEffect, useState } from "react";
import "../../SCSS/MainPage/CadetCards.scss";
// import defaultImg from "../../default_intra.png";
import blankImg from "../../blankImg.png";
import { positions } from "../../userData";
import { Redirect, useHistory } from "react-router";
import axios from "axios";

export default function CadetCards({ cadetData }) {
  const history = useHistory();
  const [profileUrl, setProfileUrl] = useState();

  useEffect(() => {
    const resizedImage = async (key, size) => {
      // 정상적으로 가져와지면 resized url반환, 아니면 원본이미지 url반환
      const url = key.split("/");
      url[url.length - 3] = size;
      const resized = url.join("/");
      try {
        await axios({
          method: "head",
          url: `${resized}?timestamp=${Date.now()}`,
        });
        setProfileUrl(resized);
      } catch (err) {
        console.log(err);
        setProfileUrl(key);
      }
    };
    if (cadetData?.profileImage) resizedImage(cadetData.profileImage, "500");
  }, [cadetData]);

  return (
    <div
      className="cadet-card"
      onClick={() => {
        history.push(`/profile/${cadetData.id}`);
      }}>
      <img
        className="cadet__image"
        src={profileUrl || blankImg}
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
