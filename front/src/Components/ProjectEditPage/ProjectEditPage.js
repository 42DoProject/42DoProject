import React, { useEffect, useRef, useState } from "react";
import "../../SCSS/ProjectEditPage/ProjectEditPage.scss";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import { Icon } from "@iconify/react";
import PositionCard from "./PositionCard";
import Unsplash from "./Unsplash";
import skills from "../../skills.json";
import { positions } from "../../userData";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import Modal from "./Modal";
import ReactLoading from "../CommonComponent/Loading";

export default function ProjectEditPage() {
  const projectId = useParams()["id"];
  const [projectData, setProjectData] = useState(null);
  const loginState = useSelector((state) => state.loginReducer);
  const [unsplashFlag, setUnsplashFlag] = useState(0);
  const unsplashRef = useRef();
  const [selectedPos, setSelectedPos] = useState([]); //[[사진, 포지션이름, x여부], ...]
  const [selectedSkill, setSelectedSkill] = useState([]); // [["Docker","https://img~","129"], ...]
  const [refer, setRefer] = useState([]); // 참고링크 URI
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [myData, setMyData] = useState({});
  const editorRef = useRef();
  const history = useHistory();
  const [image, setImage] = useState(); //
  const [imgLoadFlag, setImgLoadFlag] = useState(0); // 1일때 이미지 로드, 로드 완료 후 2
  const [imgBase64, setImgBase64] = useState(""); // 이미지 파일 base64 (업로드 전 미리보기 기능)
  const [validateFlag, setValidateFlag] = useState(0); // 1일때 모달창 띄움
  const [modalFlag, setModalFlag] = useState(0); // 1일때 모달창 띄움
  const [validateMsg, setValidateMsg] = useState([]); // [validate모달창에 띄울 메시지, 버튼 종류]
  const [isValid, setIsValid] = useState(0); // validity 테스트 통과하면 1
  const [isLoading, setIsLoading] = useState(0); // 1일때 스피너
  const [yes, setYes] = useState(0); // 1일 때 프로젝트 삭제
  let dateDiff =
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;

  const handleClickOutside = (event) => {
    if (unsplashRef.current && !unsplashRef.current.contains(event.target))
      setUnsplashFlag(0);
  };

  const testValid = () => {
    if (!document.querySelector(".project-edit__name").value) {
      setValidateMsg(["프로젝트명을 입력해주세요", "cancel-only"]);
      setValidateFlag(1);
    } else if (!editorRef.current.getInstance().getMarkdown()) {
      setValidateMsg(["프로젝트 소개를 입력해주세요", "cancel-only"]);
      setValidateFlag(1);
    } else if (!image) {
      setValidateMsg(["프로젝트 썸네일을 추가해주세요", "cancel-only"]);
      setValidateFlag(1);
    } else if (startDate && endDate && dateDiff <= 0) {
      setValidateMsg([
        "종료일은 시작일 이후 날짜로 설정해주세요",
        "cancel-only",
      ]);
      setValidateFlag(1);
    } else if (selectedPos.filter((e) => e[2] === "enabled").length === 0) {
      setValidateMsg([
        `빈 포지션이 없으면 프로젝트 참여 신청을 받을 수 없어요. 이대로 프로젝트를 ${
          projectId ? "저장" : "생성"
        }할까요?`,
        "both",
      ]);
      setValidateFlag(1);
    } else return 1;
  }; // 제출 전 입력값들 유효한지 확인하는 함수

  const projectSave = async () => {
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
      console.log("myData", myData);

      const res = await axios({
        method: `${projectId ? "put" : "post"}`,
        url: `${
          projectId
            ? `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/project?projectId=${projectId}`
            : `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/project`
        }`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${loginState.accessToken}`,
        },
        data: formData,
      });
      console.log("res", res);
      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
      setIsLoading(0);
      // history.goBack();
      projectId
        ? history.push(`/project/${projectId}`)
        : history.push(`/project/${res.data.newProject}`);
    } catch (err) {
      console.log(err);
      setIsLoading(0);
      setImgLoadFlag(1);
      setValidateMsg([
        `프로젝트 ${projectId ? "저장" : "생성"}중 에러가 발생했어요`,
        "cancel-only",
      ]);
      setValidateFlag(1);
    }
  };

  const getMyData = async () => {
    try {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/user/me`,
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
        url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/project?projectId=${projectId}`,
        headers: {
          Authorization: `Bearer ${loginState.accessToken}`,
        },
      });
      console.log(res);
      history.push("/");
    } catch (err) {
      console.log(err);
      setIsLoading(0);
      setYes(0);
      setValidateMsg(["존재하지 않는 프로젝트입니다", "cancel-only"]);
      setValidateFlag(1);
    }
  };

  const getProjectData = async () => {
    try {
      const {
        data: { content: projectContent },
      } = await axios.get(
        `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/project/content?projectId=${projectId}`
      );
      setProjectData(projectContent);
      if (projectContent?.thumbnailImage) setImgLoadFlag(1);
    } catch (err) {
      console.log(err);
      // history.goBack();
    }
  };

  useEffect(() => {
    if (projectData) {
      editorRef?.current.getInstance().setMarkdown(projectData.content.content);
      setImage(projectData.thumbnailImage);
      let skillSet = [];
      for (let e of projectData.skill) {
        skillSet.push([...skills.skills[e], e]);
      }
      let emptyPos = [];
      for (let e of projectData.position) {
        emptyPos.push(["noImage", positions[e], "enabled"]);
      }
      let filledPos = [];
      for (let e of projectData.projectprofile) {
        filledPos.push([
          e.profile.user.profileImage,
          `${e.position === null ? "팀장" : positions[e.position]}`,
          "disabled",
        ]);
      }
      setSelectedPos([...filledPos, ...emptyPos]);
      setSelectedSkill(skillSet);
      setRefer(projectData.content.reference);
      setStartDate(projectData.startDate?.slice(0, 10));
      setEndDate(projectData.endDate?.slice(0, 10));
      console.log("projectData", projectData);
    }
  }, [projectData]);

  useEffect(() => {
    if (editorRef?.current) {
      editorRef.current.getInstance().removeHook("addImageBlobHook");
      editorRef.current
        .getInstance()
        .addHook("addImageBlobHook", (blob, callback) => {
          (async () => {
            let formData = new FormData();
            formData.append("image", blob);
            let altText = document.getElementById("toastuiAltTextInput").value;

            const res = await axios({
              method: "post",
              url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/project/content/image`,
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${loginState.accessToken}`,
              },
              data: formData,
            });
            callback(res.data.url, altText);
          })();

          return false;
        });
    }
  }, [editorRef, loginState]);

  useEffect(() => {
    if (projectId) getProjectData();
  }, [projectId]);

  useEffect(() => {
    if (loginState === null) {
      history.goBack();
    } else getMyData();
  }, [loginState]);

  useEffect(() => {
    if (!projectId) {
      setSelectedPos([
        [myData.profileImage, positions[myData.position], "disabled"],
      ]);
    }
  }, [myData, projectId]);

  useEffect(() => {
    if (isValid === 1) {
      setIsLoading(1);
      projectSave();
    }
  }, [isValid]);

  useEffect(() => {
    if (yes === 1) {
      setIsLoading(1);
      projectDelete();
    }
  }, [yes]);

  useEffect(() => {
    const spinnerEl = document.querySelector(".loading-wrap");

    if (imgLoadFlag === 2) spinnerEl.style.visibility = "hidden";
    if (imgLoadFlag === 1) spinnerEl.style.visibility = "visible";
  }, [imgLoadFlag]);

  if (unsplashFlag) document.addEventListener("mousedown", handleClickOutside);
  if (isLoading) return <ReactLoading type="spin" color="#a7bc5b" />;

  return (
    <div className="project-edit__wrapper">
      <div className="project-edit__form">
        <div className="project-edit__left">
          <label>
            프로젝트 썸네일<span className="project-edit__asterisk">*</span>
          </label>
          <div
            className="project-edit__thumbnail"
            onMouseOver={() => {
              document.querySelector(
                ".project-edit__img-hover"
              ).style.visibility = "visible";
            }}
            onMouseLeave={() => {
              document.querySelector(
                ".project-edit__img-hover"
              ).style.visibility = "hidden";
            }}>
            {imgLoadFlag === 0 ? (
              <div className="project-edit__img">
                <Icon
                  icon="ant-design:camera-filled"
                  style={{ fontSize: "2rem", color: "#8e8e93" }}
                />
              </div>
            ) : (
              <>
                <ReactLoading type="spin" color="#a7bc5b" />
                <img
                  className="project-edit__img"
                  src={imgBase64 || projectData?.thumbnailImage}
                  alt="project-thumbnail"
                  onLoad={() => {
                    setImgLoadFlag(2);
                  }}
                  style={{ opacity: imgLoadFlag === 1 ? 0 : 1 }}
                />
              </>
            )}
            <div
              className="project-edit__img-hover"
              onClick={() =>
                unsplashFlag === 0 ? setUnsplashFlag(1) : setUnsplashFlag(0)
              }>
              <div className="img-hover__add">이미지 선택</div>
            </div>
          </div>
          {unsplashFlag === 1 && (
            <div ref={unsplashRef}>
              <Unsplash
                setUnsplashFlag={setUnsplashFlag}
                setImage={setImage}
                image={image}
                setImgLoadFlag={setImgLoadFlag}
                setImgBase64={setImgBase64}
                imgBase64={imgBase64}
              />
            </div>
          )}
          <div className="project-edit__position-label">
            <label>
              프로젝트에 필요한 포지션
              <span className="project-edit__asterisk">*</span>
            </label>
            <select
              id="job_select"
              className="project-edit__add-position"
              defaultValue="default"
              onChange={() => {
                const posSelectEl = document.getElementById("job_select");

                setSelectedPos([
                  ...selectedPos,
                  ["noImage", posSelectEl.value, "enabled"],
                ]);
                posSelectEl.selectedIndex = 0;
              }}>
              <option value="default" disabled>
                포지션 추가
              </option>
              {positions.map((v, i) => {
                return (
                  <option key={i} value={v}>
                    {v}
                  </option>
                );
              })}
            </select>
            <div>
              (멤버: {projectId ? projectData?.currentMember : "1"} /{" "}
              {selectedPos.length})
            </div>
          </div>
          <div className="project-edit__position">
            {selectedPos.map((v, i) => {
              return (
                <PositionCard
                  image={v[0]}
                  subject={v[1]}
                  xdelete={v[2]}
                  key={i}
                  selectedPos={selectedPos}
                  setSelectedPos={setSelectedPos}
                  idx={i}
                />
              );
            })}
          </div>
          <label>프로젝트 기간</label>
          <div className="project-edit__period">
            시작일
            <input
              type="date"
              value={startDate || ""}
              className="project-edit__start-date"
              onChange={() => {
                const startDateEl = document.getElementsByClassName(
                  "project-edit__start-date"
                );
                setStartDate(startDateEl[0].value);
              }}></input>
            ~ 종료일
            <input
              type="date"
              value={endDate || ""}
              className="project-edit__end-date"
              onChange={() => {
                const endDateEl = document.getElementsByClassName(
                  "project-edit__end-date"
                );
                setEndDate(endDateEl[0].value);
              }}></input>
            {/* <span className="period__day"> */}
            {startDate &&
              endDate &&
              (dateDiff > 0 ? (
                <span className="period__day">{`(${dateDiff}일)`}</span>
              ) : null)}
            {/* </span> */}
          </div>
          <label className="project-edit__skill-label">
            프로젝트에 필요한 스킬
            <div className="project-edit__skill">
              <input
                className="project-edit__add-skill"
                placeholder="스킬을 검색해 추가해 보세요"
                list="tech-stacks"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    skills.skills.forEach((el, idx) => {
                      if (e.target.value === el[0]) {
                        // 선택한 값이 skills에 있으면
                        for (let elem of selectedSkill) {
                          if (elem[0] === e.target.value) {
                            //선택한 값이 이미 selected에 있으면
                            e.target.value = "";
                            return; // 추가안하고 지워준 후 종료
                          }
                        }
                        setSelectedSkill([...selectedSkill, [...el, idx + ""]]); // selectedSkill에 인덱스(el[2])와 함께 추가
                        e.target.value = "";
                      }
                    });
                  }
                }}
              />
              <datalist id="tech-stacks">
                {[...skills.skills].sort().map((v, idx) => {
                  return <option key={idx} value={v[0]} />;
                })}
              </datalist>
            </div>
          </label>
          <div className="project-edit__selected-skill">
            {selectedSkill.map((e, idx) => {
              return (
                <div key={idx} className="selected-el">
                  <img
                    className="selected-img"
                    key={idx + 1}
                    src={e[1]}
                    alt={e[2]}
                  />
                  <Icon
                    key={idx + 2}
                    className="selected-x"
                    icon="bi:x-circle-fill"
                    onClick={(e) => {
                      let dup = [...selectedSkill];
                      dup.splice(idx, 1);
                      setSelectedSkill(dup);
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="project-edit__reference">
            <label>참고 링크</label>
            <div>
              <input
                className="reference-input"
                placeholder="GitHub repository, Notion 등의 웹 주소를 추가해 주세요"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && e.target.value) {
                    setRefer([...refer, e.target.value]);
                    e.target.value = "";
                  }
                }}
              />
              <Icon
                icon="akar-icons:circle-plus-fill"
                className="reference-icon"
                onClick={() => {
                  const referEl = document.querySelector(".reference-input");

                  if (referEl.value) {
                    setRefer([...refer, referEl.value]);
                    referEl.value = "";
                  }
                }}
              />
            </div>
            {refer?.map((v, i) => {
              return (
                <div className="selected-reference" key={i - 1}>
                  <div key={i} className="reference-url">
                    {v}
                  </div>
                  <Icon
                    key={i + 1}
                    icon="akar-icons:circle-minus-fill"
                    className="reference-x"
                    onClick={() => {
                      let duplicate = [...refer];
                      duplicate.splice(i, 1);
                      setRefer(duplicate);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="project-edit__right">
          <label>
            프로젝트명<span className="project-edit__asterisk">*</span>
          </label>
          <input
            className="project-edit__name"
            placeholder="프로젝트명을 입력해 주세요. (ex. 식재료에 따른 요리 추천 앱)"
            maxLength="30"
            defaultValue={projectData?.title}
          />
          <label>
            프로젝트 소개<span className="project-edit__asterisk">*</span>
          </label>
          <div className="project-edit__introduction">
            <Editor
              ref={editorRef}
              height="40rem"
              plugins={[
                colorSyntax,
                // [codeSyntaxHighlight, { highlighter: Prism }],
              ]}
              useCommandShortcut={true}
              placeholder={`프로젝트에 대해 자유롭게 소개해 주세요.
(ex. 초기 아이디어 및 프로젝트의 목적, 필요성, 출시 플랫폼, 타겟 유저 등)`}
            />
          </div>
        </div>
      </div>
      {validateFlag === 1 && (
        <Modal
          body={validateMsg[0]}
          buttons={validateMsg[1]}
          setOpenFlag={setValidateFlag}
          setYes={setIsValid}
        />
      )}
      {modalFlag === 1 && (
        <Modal
          body={validateMsg[0]}
          buttons={validateMsg[1]}
          setOpenFlag={setModalFlag}
          setYes={setYes}
        />
      )}
      <div className="project-edit__buttons">
        {projectId && (
          <button
            className="project-edit__delete"
            onClick={() => {
              setValidateMsg([`프로젝트를 정말 삭제할까요?`, "both"]);
              setModalFlag(1);
            }}>
            프로젝트 삭제
          </button>
        )}
        <button
          className="project-edit__save"
          onClick={(e) => {
            if (testValid() === 1) {
              setIsLoading(1);
              projectSave();
            }
          }}>
          {projectId ? "저장" : "프로젝트 생성"}
        </button>
      </div>
    </div>
  );
}
