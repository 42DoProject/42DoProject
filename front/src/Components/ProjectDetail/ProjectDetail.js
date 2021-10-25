import React, { useState, useEffect } from "react";
import axios from "axios";
import ProjectDetailHeader from "./ProjectDetailHeader";
import "../../SCSS/ProjectDetail/ProjectDetail.scss";
import ProjectStatus from "./ProjectStatus";
import MemberList from "./MemberList";
import ProjectContent from "./ProjectContent";
import ProjectInfo from "./ProjectInfo";
import { useParams } from "react-router-dom";
import ProjectComment from "./ProjectComment";
import { useSelector } from "react-redux";

export default function ProjectDetail(props) {
  const [project, setProject] = useState();
  const projectId = useParams()["id"];

  const loginState = useSelector((state) => state.loginReducer);
  // const projectId = props.match.params.id;

  console.log(loginState);
  useEffect(() => {
    getData();
  }, []);

  console.log(project);

  const getData = async () => {
    try {
      const {
        data: { content: projectContent },
      } = await axios.get(
        `http://localhost:5000/project/content?projectId=${projectId}`
      );
      setProject(projectContent);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="ProjectDetail__wrap">
        {project && (
          <>
            <ProjectDetailHeader
              title={project.title}
              image={project.thumbnailImage}
            />
            <div className="projectdetail-body">
              <div className="projectdetail-body__row1">
                <ProjectStatus projectId={project.id} loginstate={loginState} />
                <ProjectInfo info={project} loginstate={loginState} />
              </div>
              <div className="projectdetail-body_row2">
                <div className="project_memberlist">
                  <MemberList data={project} loginState={loginState} />
                </div>
                <hr />
                <div className="body-content">
                  <ProjectContent content={project} />
                </div>
                <hr />
                {project.id && (
                  <ProjectComment
                    projectId={project.id}
                    loginState={loginState}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
