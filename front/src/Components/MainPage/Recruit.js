import React from "react";
import { Icon } from "@iconify/react";
import "../../SCSS/MainPage/Recruit.scss";
import Cards from "./Cards";
import RecruitList from "./RecruitList";
import PubilcList from "./PubilcList";

export default function Recruit() {
  return (
    <div className="recruit__wrap">
      <div className="recruit">
        <div className="recruit__title">모집중인 프로젝트</div>
        <RecruitList />
      </div>
      <div className="public">
        <div className="public__title">프로젝트 홍보</div>
        <PubilcList />
      </div>
    </div>
  );
}
