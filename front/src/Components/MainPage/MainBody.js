import React from "react";
import "../../SCSS/MainPage/MainBody.scss";
import RecruitList from "./RecruitList";
import PubilcList from "./PubilcList";
import { Link } from "react-router-dom";

export default function MainBody() {
  return (
    <div className="recruit__wrap">
      <div className="recruit">
        <div className="recruit__title">
          <Link className="a-color" to="project/recruit">
            모집중인 프로젝트
          </Link>
        </div>
        <RecruitList />
      </div>
      <div className="public">
        <div className="public__title">
          <Link className="a-color" to="project/complete">
            완료된 프로젝트
          </Link>
        </div>
        <PubilcList />
      </div>
    </div>
  );
}
