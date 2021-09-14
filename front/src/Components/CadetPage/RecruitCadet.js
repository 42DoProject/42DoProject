import React from "react";
import Navbar from "../CommonComponent/Navbar";
import CadetTypeBar from "./CadetTypeBar";
import CardsList from "./CardsList";
import ProjectPaginate from "./ProjectPaginate";
import "../../SCSS/CadetPage/RecruitCadet.scss";

export default function RecruitCadet() {
  return (
    <div>
      <Navbar />
      <div className="recruitCadet-wrap">
        <CadetTypeBar />
        <CardsList />
        <CardsList />
        <CardsList />
        <CardsList />
        <ProjectPaginate />
      </div>
    </div>
  );
}
