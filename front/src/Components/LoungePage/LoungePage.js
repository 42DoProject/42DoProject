import React from "react";
import LoungeBody from "./LoungeBody";
import "../../SCSS/LoungePage/LoungePage.scss";
import ProjectPaginate from "./ProjectPaginate";

export default function LoungePage() {
  return (
    <>
      <div className="lounge-wrap">
        <LoungeBody />
        <ProjectPaginate />
      </div>
    </>
  );
}
