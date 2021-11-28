import Cards from "./Cards";
import "../../SCSS/MainPage/List.scss";
import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "./Loading";

function PublicList(props) {
  let [slideFlag, setSlideFlag] = useState(0);
  const [completedProject, setCompletedProject] = useState(null);
  const getData = async () => {
    try {
      const {
        data: {
          project: { count, rows: completedData },
        },
      } = await axios.get(
        `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project?state=completed&pageSize=20&page=1`
      );
      props.setFinishPr(count);
      setCompletedProject(completedData);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return completedProject === null ? (
    <ReactLoading type="spin" color="#a7bc5b" />
  ) : (
    <>
      {completedProject.length === 0 ? (
        <div className="noProject">완성된 프로젝트가 없어요</div>
      ) : (
        <div className="cardlist">
          {slideFlag === 0 ? null : (
            <button
              className="cardbutton prev"
              onClick={(event) => {
                prevUtil(slideFlag, setSlideFlag);
              }}
            >
              <Icon className="prev__icon" icon="dashicons:arrow-left-alt2" />
            </button>
          )}
          {slideFlag >= (completedProject.length - 4) / 2 ? null : (
            <button
              className="cardbutton next"
              onClick={(event) => {
                nextUtil(slideFlag, setSlideFlag, completedProject.length);
              }}
            >
              <Icon className="next__icon" icon="dashicons:arrow-right-alt2" />
            </button>
          )}
          <div className="cardpadding">
            <div className="cards-row">
              {completedProject.map((el, idx) => {
                return <Cards key={el.id} projectData={el} />;
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function nextUtil(slideFlag, setSlideFlag, prCnt) {
  const $cardsrow = document.querySelector(".public .cards-row");
  $cardsrow.style.transition = "transform .7s ease-out";
  if (slideFlag <= parseInt((prCnt - 4) / 2)) slideFlag++;
  $cardsrow.style.transform = `translateX(${+(-696 / 16) * slideFlag}rem)`;
  setSlideFlag(slideFlag);
}

function prevUtil(slideFlag, setSlideFlag) {
  const $cardsrow = document.querySelector(".public .cards-row");
  $cardsrow.style.transition = "transform .7s ease-out";
  if (slideFlag !== 0) slideFlag--;
  $cardsrow.style.transform = `translateX(${(-696 / 16) * slideFlag}rem)`;
  setSlideFlag(slideFlag);
}

export default React.memo(PublicList);
