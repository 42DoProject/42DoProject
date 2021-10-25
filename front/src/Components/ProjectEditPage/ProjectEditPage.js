import React, { isValidElement, useEffect, useRef, useState } from "react";
import "../../SCSS/ProjectEditPage/ProjectEditPage.scss";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { Icon } from "@iconify/react";
import PositionCard from "./PositionCard";
import Unsplash from "./Unsplash";
import skills from "../../skills.json";
import { positions } from "../../userData";
import axios from "axios";
import { useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router";
import ValidateModal from "./ValidateModal";

export default function ProjectEditPage() {
  const loginState = useSelector((state) => state.loginReducer);
  const [unsplashFlag, setUnsplashFlag] = useState(0);
  const unsplashRef = useRef();
  const [selectedPos, setSelectedPos] = useState([]); //[[사진, 포지션이름, x여부], [사진, 포지션이름, x여부]]
  const [selectedSkill, setSelectedSkill] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [myData, setMyData] = useState({});
  const editorRef = useRef();
  const history = useHistory();
  const [image, setImage] = useState();
  const [imgLoadFlag, setImgLoadFlag] = useState(0); // 1일때 이미지 로드, 로드 완료 후 2
  const [imgBase64, setImgBase64] = useState(""); // 이미지 파일 base64 (업로드 전 미리보기 기능)
  const [validateFlag, setValidateFlag] = useState(0); // 1일때 모달창 띄움
  const [validateMsg, setValidateMsg] = useState([]); // [validate모달창에 띄울 메시지, 버튼 종류]
  const [isValid, setIsValid] = useState(0); // validity 테스트 통과하면 1

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
        "빈 포지션이 없으면 프로젝트 참여 신청을 받을 수 없어요. 이대로 프로젝트를 생성할까요?",
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
        // totalMember: selectedPos.length,
        title: document.querySelector(".project-edit__name").value,
        state: "recruiting",
        content: editorInstance.getMarkdown(),
        position: `[${positionPost}]`,
        skill: `[${skillPost}]`,
      };
      const formData = new FormData();
      formData.append("thumbnail", image);
      for (let key in textField) {
        formData.append(key, textField[key]);
      }
      if (startDate) formData.append("startDate", startDate);
      if (endDate) formData.append("endDate", endDate);

      // for (let key of formData.keys()) {
      //   console.log(key);
      // }
      // for (let value of formData.values()) {
      //   console.log(value);
      // }

      const res = await axios({
        method: "post",
        url: "http://localhost:5000/project",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${loginState.accessToken}`,
        },
        // contentType: false,
        // proecessData: false,
        data: formData,
      });
      console.log("res", res);
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  const getMyData = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/user/me", {
        headers: {
          Authorization: `Bearer ${loginState.accessToken}`,
        },
      });
      setMyData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (loginState === null) history.push("/");
    else getMyData();
  }, [loginState]);

  useEffect(() => {
    setSelectedPos([
      [myData.profileImage, positions[myData.position], "disabled"],
    ]);
  }, [myData]);

  useEffect(() => {
    if (isValid === 1) {
      projectSave();
    }
  }, [isValid]);

  unsplashFlag && document.addEventListener("mousedown", handleClickOutside);
  if (loginState === null) {
    return <Redirect to="/" />;
  }
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
              <img
                className="project-edit__img"
                src={imgBase64}
                alt="project-thumbnail"
              />
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
            <div>(멤버: 1 / {selectedPos.length})</div>
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
          <label>프로젝트 완료까지의 예상 소요 기간</label>
          <div className="project-edit__period">
            시작일
            <input
              type="date"
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
                placeholder="스킬을 검색해 추가해보세요"
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
          <div className="project-eidt__selected-skill">
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
        </div>
        <div className="project-edit__right">
          <label>
            프로젝트명<span className="project-edit__asterisk">*</span>
          </label>
          <input
            className="project-edit__name"
            placeholder="프로젝트명을 입력해주세요. (ex. 식재료에 따른 요리 추천 앱)"
            maxLength="30"
          />
          <label>
            프로젝트 소개<span className="project-edit__asterisk">*</span>
          </label>
          <div className="project-edit__introduction">
            <Editor ref={editorRef} height="500px" />
          </div>
        </div>
      </div>
      {validateFlag === 1 && (
        <ValidateModal
          body={validateMsg[0]}
          buttons={validateMsg[1]}
          setValidateFlag={setValidateFlag}
          setIsValid={setIsValid}
        />
      )}
      <div className="project-edit__buttons">
        {/* <button className="project-edit__delete">프로젝트 삭제</button> */}
        <button
          className="project-edit__save"
          onClick={(e) => {
            if (testValid() === 1) {
              e.target.innerText = "생성중...";
              projectSave();
            }
          }}>
          프로젝트 생성
        </button>
      </div>
    </div>
  );
}
