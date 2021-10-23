import "../../SCSS/ProfilePage/ProfileProjects.scss";
// import "../../SCSS/MainPage/List.scss";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import DashCards from "../MainPage/DashCards";

export default function ProfileProjects({ projectData }) {
  const [slideFlag, setSlideFlag] = useState(0);

  function nextUtil(slideFlag, setSlideFlag, prCnt) {
    const $cardsrow = document.querySelector(
      ".profile-project__wrap .cards-row"
    );
    $cardsrow.style.transition = "transform .7s ease-out";
    if (slideFlag <= parseInt((prCnt - 3) / 2)) slideFlag++;
    $cardsrow.style.transform = `translateX(${(-680 / 16) * slideFlag}rem)`;
    setSlideFlag(slideFlag);
  }

  function prevUtil(slideFlag, setSlideFlag) {
    const $cardsrow = document.querySelector(
      ".profile-project__wrap .cards-row"
    );
    $cardsrow.style.transition = "transform .7s ease-out";
    if (slideFlag !== 0) slideFlag--;
    $cardsrow.style.transform = `translateX(${(-680 / 16) * slideFlag}rem)`;
    setSlideFlag(slideFlag);
  }

  return (
    <div className="profile-project__wrap">
      {slideFlag !== 0 && (
        <button
          className="cardbutton prev"
          onClick={(event) => {
            prevUtil(slideFlag, setSlideFlag);
          }}>
          <Icon className="prev__icon" icon="dashicons:arrow-left-alt2" />
        </button>
      )}
      {slideFlag >= (projectData.length - 3) / 2 ? null : (
        <button
          className="cardbutton next"
          onClick={(event) => {
            nextUtil(slideFlag, setSlideFlag, projectData.length);
          }}>
          <Icon className="next__icon" icon="dashicons:arrow-right-alt2" />
        </button>
      )}
      <div className="profile-project__padding">
        <div className="cards-row">
          {/* {projectData.map((el, idx) => {
            return <Cards key={idx} projectData={el} />;
          })} */}
          {projectData.map((e, i) => {
            return <DashCards key={e.id} projectData={e} />;
          })}
        </div>
      </div>
    </div>
  );
}
