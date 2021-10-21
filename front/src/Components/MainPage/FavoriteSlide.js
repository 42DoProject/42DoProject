import React, { useState } from "react";
import DashCards from "./DashCards";
import { Icon } from "@iconify/react";
import "../../SCSS/MainPage/DashSlide.scss";
export default function FavoriteSlide({ projectData }) {
  let [slideFlag, setSlideFlag] = useState(0);
  return (
    <div className="dashSlide">
      {slideFlag !== 0 && (
        <button
          className="cardbutton prev"
          onClick={(event) => {
            prevUtil(slideFlag, setSlideFlag);
          }}
        >
          <Icon className="prev__icon" icon="dashicons:arrow-left-alt2" />
        </button>
      )}
      <div className="dashCardslist">
        <div className="dashCards-wrap">
          {projectData?.map((e, idx) => {
            return <DashCards key={e.id} projectData={e} />;
          })}
        </div>
      </div>
      {slideFlag < projectData?.length - 1 && (
        <button
          className="cardbutton next"
          onClick={(event) => {
            nextUtil(slideFlag, setSlideFlag, projectData.length);
          }}
        >
          <Icon className="next__icon" icon="dashicons:arrow-right-alt2" />
        </button>
      )}
    </div>
  );
}

function nextUtil(slideFlag, setSlideFlag, prCnt) {
  const $dashCards = document.querySelector(
    ".dashboard .row2__box3 .dashCards-wrap"
  );
  $dashCards.style.transition = "transform .7s ease-out";
  if (slideFlag < prCnt - 1) slideFlag++;
  $dashCards.style.transform = `translateX(${(-223 / 16) * slideFlag}rem)`;
  setSlideFlag(slideFlag);
}

function prevUtil(slideFlag, setSlideFlag, Cnt) {
  const $dashCards = document.querySelector(
    ".dashboard .row2__box3 .dashCards-wrap"
  );
  $dashCards.style.transition = "transform .7s ease-out";
  if (slideFlag !== 0) slideFlag--;
  $dashCards.style.transform = `translateX(${(-223 / 16) * slideFlag}rem)`;
  setSlideFlag(slideFlag);
}
