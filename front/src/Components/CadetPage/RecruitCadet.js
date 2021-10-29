import React from "react";
import CadetTypeBar from "./CadetTypeBar";
import CardsList from "./CardsList";
import ProjectPaginate from "./ProjectPaginate";
import "../../SCSS/CadetPage/RecruitCadet.scss";

export default function RecruitCadet() {
  return (
    <>
      <div className="recruitCadet-wrap">
        <CadetTypeBar state="recruit" />
        {/* <CardsList />
        <CardsList />
        <CardsList /> */}
        {/* <ProjectPaginate state="recruit" /> */}
      </div>
    </>
  );
}
