import React from "react";
import "../../SCSS/MainPage/MainBody.scss";
import RecruitList from "./RecruitList";
import PublicList from "./PublicList";
import { Link } from "react-router-dom";

export default function MainBody(props) {
  return (
    <div className="recruit__wrap">
      <div className="recruit">
        <div className="recruit__title">
          <Link className="a-color" to="project/recruit">
            모집중인 프로젝트
          </Link>
        </div>
        <RecruitList setProgressPr={props.setProgressPr} />
      </div>
      <div className="public">
        <div className="public__title">
          <Link className="a-color" to="project/complete">
            완료된 프로젝트
          </Link>
        </div>
        <PublicList setFinishPr={props.setFinishPr} />
      </div>
    </div>
  );
}
