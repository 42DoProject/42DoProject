import React, { useState } from "react";
import ProjectTypeBar from "./ProjectTypeBar";
import "../../SCSS/AllProjectPage/ProjectTypeBar.scss";
import "../../SCSS/AllProjectPage/AllProjectPage.scss";
import ProjectPaginate from "./ProjectPaginate";

export default function CompleteProjects() {
  const [filterOption, setFilterOption] = useState("");

  return (
    <>
      <div className="allproject__wrap">
        <ProjectTypeBar state="completed" setFilterOption={setFilterOption} />
        <ProjectPaginate
          state="completed"
          filterOption={filterOption}
          setFilterOption={setFilterOption}
        />
      </div>
    </>
  );
}
