import React, { useState } from "react";
import LoungeBody from "./LoungeBody";
import "../../SCSS/LoungePage/LoungePage.scss";
import ProjectPaginate from "./ProjectPaginate";

export default function LoungePage() {
  let [restart, setRestart] = useState(0);
  return (
    <>
      <div className="lounge-wrap">
        <LoungeBody />
        <ProjectPaginate />
      </div>
    </>
  );
}
