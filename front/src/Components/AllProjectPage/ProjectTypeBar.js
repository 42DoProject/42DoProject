import React from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export default function ProjectTypeBar(props) {
  let recruitColor = "a-color";
  let proceedColor = "a-color";
  let completeColor = "a-color";

  switch (props.state) {
    case "recruiting":
      recruitColor = "b-color";
      break;
    case "proceeding":
      proceedColor = "b-color";
      break;
    case "completed":
      completeColor = "b-color";
      break;
  }

  return (
    <>
      <div className="project-bar">
        <div className="project-bar-column1">
          <div className="recruit-project">
            <Link className={recruitColor} to="/project/recruit">
              모집중인 프로젝트
            </Link>
          </div>
          <div className="proceed-project">
            <Link className={proceedColor} to="/project/proceed">
              진행중인 프로젝트
            </Link>
          </div>
          <div className="public-project">
            <Link className={completeColor} to="/project/complete">
              완료된 프로젝트
            </Link>
          </div>
        </div>
        <div className="project-bar-column2">
          <Icon icon="mi:filter" style={{ fontSize: "2rem" }} />
        </div>
      </div>
    </>
  );
}
