import React from "react";
import CadetTypeBar from "./CadetTypeBar";
import CardsList from "./CardsList";
import CadetPaginate from "./CadetPaginate";
import "../../SCSS/CadetPage/RecruitCadet.scss";

export default function RecruitCadet() {
  return (
    <>
      <div className="recruitCadet-wrap">
        <CadetTypeBar state="recruit" />
        <CadetPaginate state="recruit" />
      </div>
    </>
  );
}
