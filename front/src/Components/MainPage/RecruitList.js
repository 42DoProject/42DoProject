import Cards from "./Cards";
import "../../SCSS/MainPage/List.scss";
import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

function RecruitList(props) {
  const [slideFlag, setSlideFlag] = useState(0);
  const [recruitingProject, setRecruitingProject] = useState([]);
  const getData = async () => {
    try {
      const {
        data: {
          project: { count, rows: recruitingData },
        },
      } = await axios.get(
        `http://localhost:5000/project?state=recruiting&pageSize=20&page=1`
      );
      props.setProgressPr(count);
      setRecruitingProject(recruitingData);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      {recruitingProject.length === 0 ? (
        <div className="noProject">모집중인 프로젝트가 없어요</div>
      ) : (
        <div className="cardlist">
          {slideFlag !== 0 && (
            <button
              className="cardbutton prev"
              onClick={(event) => {
                prevUtil(slideFlag, setSlideFlag);
              }}>
              <Icon className="prev__icon" icon="dashicons:arrow-left-alt2" />
            </button>
          )}
          {slideFlag >= (recruitingProject.length - 4) / 2 ? null : (
            <button
              className="cardbutton next"
              onClick={(event) => {
                nextUtil(slideFlag, setSlideFlag, recruitingProject.length);
              }}>
              <Icon className="next__icon" icon="dashicons:arrow-right-alt2" />
            </button>
          )}
          <div className="cardpadding">
            <div className="cards-row">
              {recruitingProject.map((el, idx) => {
                return <Cards key={idx} projectData={el} />;
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function nextUtil(slideFlag, setSlideFlag, prCnt) {
  const $cardsrow = document.querySelector(".recruit .cards-row");
  $cardsrow.style.transition = "transform .7s ease-out";
  if (slideFlag <= parseInt((prCnt - 4) / 2)) slideFlag++;
  $cardsrow.style.transform = `translateX(${(-696 / 16) * slideFlag}rem)`;
  setSlideFlag(slideFlag);
}

function prevUtil(slideFlag, setSlideFlag) {
  const $cardsrow = document.querySelector(".recruit .cards-row");
  $cardsrow.style.transition = "transform .7s ease-out";
  if (slideFlag !== 0) slideFlag--;
  $cardsrow.style.transform = `translateX(${(-696 / 16) * slideFlag}rem)`;
  setSlideFlag(slideFlag);
}

export default React.memo(RecruitList);
