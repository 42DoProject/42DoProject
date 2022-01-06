import React, { useEffect, useRef, useState } from "react";
import "../../SCSS/ProjectEditPage/ProjectEditPage.scss";
import ProjectEditLeft from "./ProjectEditLeft";
import ProjectEditRight from "./ProjectEditRight";
import "@toast-ui/editor/dist/toastui-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import Modal from "./Modal";
import ReactLoading from "../CommonComponent/Loading";
import { positions } from "../../userData";

export default function ProjectEditPage() {
  const projectId = useParams()["id"];
  const history = useHistory();
  const loginState = useSelector((state) => state.loginReducer);
  const editorRef = useRef();

  const [projectData, setProjectData] = useState(null);
  const [myData, setMyData] = useState({});
  const [modalFlag, setModalFlag] = useState(false); // true일때 모달창 띄움
  const [validateFlag, setValidateFlag] = useState(false); // true일때 모달창 띄움
  const [validateMsg, setValidateMsg] = useState([]); // [validate모달창에 띄울 메시지, 버튼 종류]
  const [isValid, setIsValid] = useState(false); // validity 테스트 통과하면 true
  const [isLoading, setIsLoading] = useState(false); // true일때 스피너
  const [deleteConfirmed, setDeleteConfirmed] = useState(false); // true일 때 프로젝트 삭제
  const [imgLoadFlag, setImgLoadFlag] = useState(0); // 1일때 이미지 로딩중(spinner), 로드 완료 후 2 (spinner hidden)
  const [goBackModal, setGoBackModal] = useState(false);

  // saveProject시 보낼 data 목록
  const [image, setImage] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [selectedPos, setSelectedPos] = useState([]); //[[사진, 포지션이름, x여부], ...]
  const [selectedSkill, setSelectedSkill] = useState([]); // [["Docker","https://img~","129"], ...]
  const [refer, setRefer] = useState([]); // 참고링크 URI

  let dateDiff =
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;

  const testValid = () => {
    if (!document.querySelector(".project-edit__name").value) {
      setValidateMsg(["프로젝트명을 입력해주세요", ["확인"]]);
      setValidateFlag(true);
    } else if (!editorRef.current.getInstance().getMarkdown()) {
      setValidateMsg(["프로젝트 소개를 입력해주세요", ["확인"]]);
      setValidateFlag(true);
    } else if (!image) {
      setValidateMsg(["프로젝트 썸네일을 추가해주세요", ["확인"]]);
      setValidateFlag(true);
    } else if (startDate && endDate && dateDiff <= 0) {
      setValidateMsg(["종료일은 시작일 이후 날짜로 설정해주세요", ["확인"]]);
      setValidateFlag(true);
    } else if (selectedPos.filter((e) => e[2] === "enabled").length === 0) {
      setValidateMsg([
        `빈 포지션이 없으면 프로젝트 참여 신청을 받을 수 없어요. 이대로 프로젝트를 ${
          projectId ? "저장" : "생성"
        }할까요?`,
        ["취소", "확인"],
      ]);
      setValidateFlag(true);
    } else return 1;
  }; // 제출 전 입력값들 유효한지 확인하는 함수

  const saveProject = async () => {
    try {
      const editorInstance = editorRef.current.getInstance();
      let skillPost = [];
      for (let e of selectedSkill) skillPost.push(+e[2]);
      let positionPost = selectedPos
        .filter((e) => e[2] === "enabled")
        .map((e) => positions.indexOf(e[1]));

      const textField = {
        title: document.querySelector(".project-edit__name").value,
        content: editorInstance.getMarkdown(),
        position: JSON.stringify(positionPost),
        skill: JSON.stringify(skillPost),
        reference: JSON.stringify(refer),
      };
      const formData = new FormData();
      formData.append("thumbnail", image);
      for (let key in textField) {
        formData.append(key, textField[key]);
      }
      if (startDate) formData.append("startDate", startDate);
      if (endDate) formData.append("endDate", endDate);
      if (!projectId) formData.append("leaderPosition", myData.position);

      const res = await axios({
        method: `${projectId ? "put" : "post"}`,
        url: `${
          projectId
            ? `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project?projectId=${projectId}`
            : `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project`
        }`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${loginState.accessToken}`,
        },
        data: formData,
      });
      // console.log("res", res);
      // for (var pair of formData.entries()) {
      //   console.log(pair[0] + ", " + pair[1]);
      // }
      setIsLoading(false);
      projectId
        ? history.push(`/project/${projectId}`)
        : history.push(`/project/${res.data.newProject}`);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      // setImgLoadFlag(1);
      setValidateMsg([
        `프로젝트 ${projectId ? "저장" : "생성"} 중 에러가 발생했어요`,
        ["확인"],
      ]);
      setValidateFlag(true);
    }
  };

  const getMyData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/user/me`,
        {
          headers: {
            Authorization: `Bearer ${loginState.accessToken}`,
          },
        }
      );
      setMyData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const projectDelete = async () => {
    try {
      const res = await axios({
        method: "delete",
        url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project?projectId=${projectId}`,
        headers: {
          Authorization: `Bearer ${loginState.accessToken}`,
        },
      });
      console.log(res);
      history.push("/");
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setDeleteConfirmed(false);
      setValidateMsg(["프로젝트 삭제 중 에러가 발생했어요", ["확인"]]);
      setModalFlag(true);
    }
  };

  const getProjectData = async () => {
    try {
      const {
        data: { content: projectContent },
      } = await axios.get(
        `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project/content?projectId=${projectId}`
      );
      setProjectData(projectContent);
      if (projectContent.leader !== loginState?.id) {
        setValidateMsg(["프로젝트의 리더만 수정할 수 있어요", ["확인"]]);
        setGoBackModal(true);
      }
    } catch (err) {
      console.log(err);
      setValidateMsg(["존재하지 않는 프로젝트입니다", ["확인"]]);
      setGoBackModal(true);
    }
  };

  useEffect(() => {
    if (projectId) getProjectData();
  }, [projectId, loginState]);

  useEffect(() => {
    if (loginState === null) {
      history.goBack();
    } else getMyData();
  }, [loginState]);

  useEffect(() => {
    if (isValid === true) {
      setIsLoading(true);
      saveProject();
    }
  }, [isValid]);

  useEffect(() => {
    if (deleteConfirmed === true) {
      setIsLoading(true);
      projectDelete();
    }
  }, [deleteConfirmed]);

  if (isLoading) return <ReactLoading type="spin" color="#a7bc5b" />;

  // console.log("myData", myData);
  console.log("imgLoadFlag", imgLoadFlag);

  return (
    <div className="project-edit__wrapper">
      <div className="project-edit__form">
        <ProjectEditLeft
          projectData={projectData}
          projectId={projectId}
          myData={myData}
          image={image}
          setImage={setImage}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          dateDiff={dateDiff}
          selectedPos={selectedPos}
          setSelectedPos={setSelectedPos}
          selectedSkill={selectedSkill}
          setSelectedSkill={setSelectedSkill}
          imgLoadFlag={imgLoadFlag}
          setImgLoadFlag={setImgLoadFlag}
          refer={refer}
          setRefer={setRefer}
        />
        <ProjectEditRight projectData={projectData} editorRef={editorRef} />
      </div>
      {validateFlag === true && (
        <Modal
          body={validateMsg[0]}
          buttons={validateMsg[1]}
          cancelFunc={() => setValidateFlag(false)}
          confirmFunc={() => {
            setValidateFlag(false);
            setIsValid(true);
          }}
        />
      )}
      {goBackModal === true && (
        <Modal
          body={validateMsg[0]}
          buttons={validateMsg[1]}
          cancelFunc={() => {
            setGoBackModal(false);
            history.goBack();
          }}
        />
      )}
      {modalFlag === true && (
        <Modal
          body={validateMsg[0]}
          buttons={validateMsg[1]}
          cancelFunc={() => setModalFlag(false)}
          confirmFunc={() => {
            setDeleteConfirmed(true);
            setModalFlag(false);
          }}
        />
      )}
      <div className="project-edit__buttons">
        <button
          className="project-edit__save"
          onClick={(e) => {
            if (testValid() === 1) {
              setIsLoading(true);
              saveProject();
            }
          }}>
          {projectId ? "프로젝트 저장" : "프로젝트 생성"}
        </button>
        {projectId && (
          <button
            className="project-edit__delete"
            onClick={() => {
              setValidateMsg([`프로젝트를 정말 삭제할까요?`, ["취소", "확인"]]);
              setModalFlag(true);
            }}>
            프로젝트 삭제
          </button>
        )}
      </div>
    </div>
  );
}
