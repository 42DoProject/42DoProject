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
import { useLocation } from "react-router";

export default function ProjectDetail(props) {
  const [project, setProject] = useState();
  const [userStatus, setUserStatus] = useState();
  const [applyFlag, setApplyFlag] = useState(0);
  const [cancleFlag, setCancleFlag] = useState(0);
  const [commentCount, setCommentCount] = useState();
  const projectId = useParams()["id"];

  const loginState = useSelector((state) => state.loginReducer);
  const location = useLocation();
  useEffect(() => {
    if (loginState !== null) getUserStatus();
    getData();
    setApplyFlag(0);
    setCancleFlag(0);
  }, [applyFlag, location, cancleFlag, loginState]);

  const getData = async () => {
    try {
      const {
        data: { content: projectContent },
      } = await axios.get(
        `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project/content?projectId=${projectId}`
      );
      setProject(projectContent);
      setCommentCount(projectContent.commentCount);
      console.log(project);
    } catch (err) {
      console.log(err);
    }
  };

  const getUserStatus = async () => {
    try {
      const { data: statusData } = await axios.get(
        `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project/status?projectId=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${loginState.accessToken}`,
          },
        }
      );
      setUserStatus(statusData);
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
              projectState={project.state}
            />
            <div className="projectdetail-body">
              <div className="projectdetail-body__row1">
                <ProjectStatus
                  userStatus={userStatus?.status}
                  project={project}
                />
                <ProjectInfo
                  info={project}
                  loginstate={loginState}
                  userStatus={userStatus?.status}
                  setApplyFlag={setApplyFlag}
                  setCancleFlag={setCancleFlag}
                  commentCount={commentCount}
                />
              </div>
              <div className="projectdetail-body_row2">
                <div className="project_memberlist">
                  <MemberList
                    data={project}
                    loginState={loginState}
                    userStatus={userStatus}
                    setApplyFlag={setApplyFlag}
                  />
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
                    commentCount={commentCount}
                    setCommentCount={setCommentCount}
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
