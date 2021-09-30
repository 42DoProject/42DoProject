import React from "react";
import CadetTypeBar from "./CadetTypeBar";
import CardsList from "./CardsList";
import CadetPaginate from "./CadetPaginate";
import "../../SCSS/CadetPage/RecruitCadet.scss";

export default function AllCadet() {
  return (
    <>
      <div className="recruitCadet-wrap">
        <CadetTypeBar state="all" />
        <CadetPaginate state="all" />
      </div>
    </>
  );
}
