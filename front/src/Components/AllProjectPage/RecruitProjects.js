import React from "react";
import ProjectTypeBar from "./ProjectTypeBar";
import "../../SCSS/AllProjectPage/ProjectTypeBar.scss";
import "../../SCSS/AllProjectPage/AllProjectPage.scss";
import ProjectPaginate from "./ProjectPaginate";

export default function RecruitProjects() {
  return (
    <>
      <div className="allproject__wrap">
        <ProjectTypeBar state="recruiting" />
        <ProjectPaginate state="recruiting" />
      </div>
    </>
  );
}
