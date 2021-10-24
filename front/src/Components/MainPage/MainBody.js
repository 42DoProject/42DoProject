import React from "react";
import "../../SCSS/MainPage/MainBody.scss";
import RecruitList from "./RecruitList";
import PublicList from "./PublicList";
import { Link } from "react-router-dom";

export default function MainBody(props) {
  return (
    <div className="recruit__wrap">
      <div className="recruit">
        <Link className="recruit__title" to="projectlist/recruit">
          모집중인 프로젝트
        </Link>
        <RecruitList setProgressPr={props.setProgressPr} />
      </div>
      <div className="public">
        <Link className="public__title" to="projectlist/complete">
          완료된 프로젝트
        </Link>
        <PublicList setFinishPr={props.setFinishPr} />
      </div>
    </div>
  );
}
