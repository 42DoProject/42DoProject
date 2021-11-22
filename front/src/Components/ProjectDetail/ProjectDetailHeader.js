import React from "react";
import "../../SCSS/ProjectDetail/ProjectDetailHeader.scss";

export default function ProjectDetailHeader({ title, image, projectState }) {
  let projectstatus = "";
  let color = "";

  switch (projectState) {
    case "recruiting":
      projectstatus = "모집중";
      color = "darkcyan";
      break;
    case "completed":
      projectstatus = "완성됨";
      color = "#8BA52D";
      break;
    case "proceeding":
      projectstatus = "진행중";
      color = "goldenrod";
      break;
  }

  return (
    <>
      <div className="header_image">
        <img src={image} alt="header_image" />
        <div className="project_title">{title}</div>
        <div className="project_status" style={{ backgroundColor: color }}>
          {projectstatus}
        </div>
      </div>
    </>
  );
}
