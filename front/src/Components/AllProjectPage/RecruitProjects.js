import React, { useState } from "react";
import ProjectTypeBar from "./ProjectTypeBar";
import "../../SCSS/AllProjectPage/ProjectTypeBar.scss";
import "../../SCSS/AllProjectPage/AllProjectPage.scss";
import ProjectPaginate from "./ProjectPaginate";

export default function RecruitProjects() {
  const [filterOption, setFilterOption] = useState("");

  return (
    <>
      <div className="allproject__wrap">
        <ProjectTypeBar state="recruiting" setFilterOption={setFilterOption} />
        <ProjectPaginate
          state="recruiting"
          filterOption={filterOption}
          setFilterOption={setFilterOption}
        />
      </div>
    </>
  );
}
