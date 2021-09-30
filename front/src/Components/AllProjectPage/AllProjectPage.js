import React from "react";
import ProjectTypeBar from "./ProjectTypeBar";
import "../../SCSS/AllProjectPage/ProjectTypeBar.scss";
import "../../SCSS/AllProjectPage/AllProjectPage.scss";
import ProjectPaginate from "./ProjectPaginate";

export default function AllProjectPage() {
  return (
    <>
      <div className="allproject__wrap">
        <ProjectTypeBar />
        <ProjectPaginate />
      </div>
    </>
  );
}
