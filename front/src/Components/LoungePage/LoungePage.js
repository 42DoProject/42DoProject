import React, { useEffect } from "react";
import LoungeBody from "./LoungeBody";
import "../../SCSS/LoungePage/LoungePage.scss";
// import ProjectPaginate from "./ProjectPaginate";
import { useLocation } from "react-router";

export default function LoungePage() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <div className="lounge-wrap">
        <LoungeBody />
        {/* <ProjectPaginate /> */}
      </div>
    </>
  );
}
