import React, { useState } from "react";
import ProjectTypeBar from "./ProjectTypeBar";
import "../../SCSS/AllProjectPage/ProjectTypeBar.scss";
import "../../SCSS/AllProjectPage/AllProjectPage.scss";
import ProjectPaginate from "./ProjectPaginate";

export default function ProceedProjects() {
  const [filterOption, setFilterOption] = useState("");

  return (
    <>
      <div className="allproject__wrap">
        <ProjectTypeBar state="proceeding" setFilterOption={setFilterOption} />
        <ProjectPaginate
          state="proceeding"
          filterOption={filterOption}
          setFilterOption={setFilterOption}
        />
      </div>
    </>
  );
}
