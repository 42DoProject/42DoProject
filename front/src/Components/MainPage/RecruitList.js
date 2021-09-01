import Cards from "./Cards";
import "../../SCSS/MainPage/List.scss";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function Cardlist() {
  let [slideFlag, setSlideFlag] = useState([0, 0]);
  return (
    <div className="cardlist">
      <button
        className="cardbutton prev"
        onClick={(event) => {
          prevUtil(slideFlag, setSlideFlag);
        }}
      >
        <Icon className="prev__icon" icon="dashicons:arrow-left-alt2" />
      </button>
      <button
        className="cardbutton next"
        onClick={(event) => {
          nextUtil(slideFlag, setSlideFlag);
        }}
      >
        <Icon className="next__icon" icon="dashicons:arrow-right-alt2" />
      </button>
      <div className="cardpadding">
        <div className="cards-row">
          <Cards />
          <Cards />
          <Cards />
          <Cards />
          <Cards />
          <Cards />
          <Cards />
          <Cards />
        </div>
      </div>
    </div>
  );
}

function nextUtil(slideFlag, setSlideFlag) {
  const $cardsrow = document.querySelector(".recruit .cards-row");
  $cardsrow.style.transition = "transform .7s ease-out";
  if (slideFlag[1] !== 3) slideFlag[1]++;
  $cardsrow.style.transform = `translateX(${
    (716 / 16) * slideFlag[0] + (-716 / 16) * slideFlag[1]
  }rem)`;
  let newSlideFlag = [slideFlag[0], slideFlag[1]];
  setSlideFlag(newSlideFlag);
}

function prevUtil(slideFlag, setSlideFlag) {
  const $cardsrow = document.querySelector(".recruit .cards-row");
  $cardsrow.style.transition = "transform .7s ease-out";
  if (slideFlag[1] !== 0) slideFlag[1]--;
  $cardsrow.style.transform = `translateX(${
    (716 / 16) * slideFlag[0] + (-716 / 16) * slideFlag[1]
  }rem)`;
  let newSlideFlag = [slideFlag[0], slideFlag[1]];
  setSlideFlag(newSlideFlag);
}
