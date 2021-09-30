import React from "react";
import CadetTypeBar from "./CadetTypeBar";
import CardsList from "./CardsList";
import ProjectPaginate from "./ProjectPaginate";
import "../../SCSS/CadetPage/RecruitCadet.scss";

export default function AllCadet() {
  return (
    <>
      <div className="recruitCadet-wrap">
        <CadetTypeBar state="all" />
        <CardsList />
        <CardsList />
        <CardsList />
        <ProjectPaginate state="all" />
      </div>
    </>
  );
}
