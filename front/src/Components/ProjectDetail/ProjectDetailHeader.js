import React from "react";
import "../../SCSS/ProjectDetail/ProjectDetailHeader.scss";

export default function ProjectDetailHeader({ title, image, projectState }) {
  let projectstatus = "";

  switch (projectState) {
    case "recruiting":
      projectstatus = "모집중";
      break;
    case "completed":
      projectstatus = "완료";
      break;
    case "proceeding":
      projectstatus = "진행중";
      break;
  }

  return (
    <>
      <div className="header_image">
        <img src={image} alt="header_image" />
        <div className="project_title">{title}</div>
        <div className="project_status">{projectstatus}</div>
      </div>
    </>
  );
}
