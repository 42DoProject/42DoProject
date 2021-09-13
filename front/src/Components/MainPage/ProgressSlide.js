import React, { useState } from "react";
import DashCards from "./DashCards";
import { Icon } from "@iconify/react";
import "../../SCSS/MainPage/DashSlide.scss";
export default function ProgressSlide() {
  let [slideFlag, setSlideFlag] = useState([0, 0]);
  return (
    <div className="dashSlide">
      <button
        className="cardbutton prev"
        onClick={(event) => {
          prevUtil(slideFlag, setSlideFlag);
        }}
      >
        <Icon className="prev__icon" icon="dashicons:arrow-left-alt2" />
      </button>
      <div className="dashCardslist">
        <div className="dashCards-wrap">
          <DashCards />
          <DashCards />
          <DashCards />
          <DashCards />
          <DashCards />
          <DashCards />
          <DashCards />
          <DashCards />
          <DashCards />
          <DashCards />
          <DashCards />
          <DashCards />
          <DashCards />
          <DashCards />
          <DashCards />
          <DashCards />
        </div>
      </div>
      <button
        className="cardbutton next"
        onClick={(event) => {
          nextUtil(slideFlag, setSlideFlag);
        }}
      >
        <Icon className="next__icon" icon="dashicons:arrow-right-alt2" />
      </button>
    </div>
  );
}

function nextUtil(slideFlag, setSlideFlag) {
  const $dashCards = document.querySelector(
    ".dashboard .row2__box2 .dashCards-wrap"
  );
  console.log($dashCards);
  $dashCards.style.transition = "transform .7s ease-out";
  slideFlag[1]++;
  $dashCards.style.transform = `translateX(${
    (223 / 16) * slideFlag[0] + (-223 / 16) * slideFlag[1]
  }rem)`;
  let newSlideFlag = [slideFlag[0], slideFlag[1]];
  setSlideFlag(newSlideFlag);
}

function prevUtil(slideFlag, setSlideFlag) {
  const $dashCards = document.querySelector(
    ".dashboard .row2__box2 .dashCards-wrap"
  );
  $dashCards.style.transition = "transform .7s ease-out";
  if (slideFlag[1] !== 0) slideFlag[1]--;
  $dashCards.style.transform = `translateX(${
    (223 / 16) * slideFlag[0] + (-223 / 16) * slideFlag[1]
  }rem)`;
  let newSlideFlag = [slideFlag[0], slideFlag[1]];
  setSlideFlag(newSlideFlag);
}
