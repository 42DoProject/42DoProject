import React from "react";
import ProjectContents from "./ProjectContents";
import ProjectTypeBar from "./ProjectTypeBar";
import "../../SCSS/AllProjectPage/ProjectTypeBar.scss";
import "../../SCSS/AllProjectPage/AllProjectPage.scss";
import ProjectPaginate from "./ProjectPaginate";

export default function AllProjectPage() {
  return (
    <>
      <div className="allproject__wrap">
        <ProjectTypeBar />
        <ProjectContents />
        <ProjectPaginate />
      </div>
    </>
  );
}
