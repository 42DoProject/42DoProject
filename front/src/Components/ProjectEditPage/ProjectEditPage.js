import React, { useRef, useState } from "react";
import "../../SCSS/ProjectEditPage/ProjectEditPage.scss";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { Icon } from "@iconify/react";
import PositionCard from "./PositionCard";
import Unsplash from "./Unsplash";
import skills from "../../skills.json";
import { positions } from "../../userData";

export default function ProjectEditPage() {
  let [unsplashFlag, setUnsplashFlag] = useState(0);
  const unsplashRef = useRef();

  const handleClickOutside = (event) => {
    if (unsplashRef.current && !unsplashRef.current.contains(event.target))
      setUnsplashFlag(0);
  };

  document.addEventListener("mousedown", handleClickOutside);

  return (
    <div className="project-edit__wrapper">
      <form
        className="project-edit__form"
        // action="http://localhost:5000/project/:id"
        acceptCharset="utf-8"
        name="project-info"
        // method="post"
      >
        <div className="project-edit__left">
          <label>
            프로젝트 썸네일<span className="project-edit__asterisk">*</span>
          </label>
          <div className="project-edit__thumbnail">
            <div
              className="project-edit__img"
              onClick={() => {
                unsplashFlag === 0 ? setUnsplashFlag(1) : setUnsplashFlag(0);
              }}>
              <Icon
                icon="ant-design:camera-filled"
                style={{ fontSize: "2rem", color: "#8e8e93" }}
              />
            </div>
            {unsplashFlag === 1 ? (
              <div ref={unsplashRef}>
                <Unsplash setUnsplashFlag={setUnsplashFlag} />
              </div>
            ) : null}
          </div>
          <div className="project-edit__position-label">
            <label>
              프로젝트에 필요한 포지션
              <span className="project-edit__asterisk">*</span>
            </label>
            <select id="job_select" className="project-edit__add-position">
              <option value="" disabled selected>
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
          </div>
          <div className="project-edit__position">
            <PositionCard />
            <PositionCard />
            {/* <PositionCard />
            <PositionCard />
            <PositionCard />
            <PositionCard />
            <PositionCard />
            <PositionCard />
            <PositionCard /> */}
          </div>
          <label>프로젝트 완료까지의 예상 소요 기간</label>
          <div className="project-edit__period">
            시작일<input type="date" className="project-edit__date"></input>~
            종료일<input type="date" className="project-edit__date"></input>
            <span>(90일)</span>
          </div>
          <label className="project-edit__skill-label">
            프로젝트에 필요한 스킬
            <div className="project-edit__skill">
              <input
                className="project-edit__add-skill"
                placeholder="스킬을 검색해 추가해보세요"
                list="tech-stacks"
              />
              <datalist id="tech-stacks">
                {[...skills.skills].sort().map((v, idx) => {
                  return <option key={idx} value={v[0]} />;
                })}
              </datalist>
            </div>
          </label>
        </div>
        <div className="project-edit__right">
          <label>
            프로젝트명<span className="project-edit__asterisk">*</span>
          </label>
          <input
            className="project-edit__name"
            placeholder="프로젝트명을 입력해주세요. (ex. 식재료에 따른 요리 추천 앱)"
          />
          <label>
            프로젝트 소개<span className="project-edit__asterisk">*</span>
          </label>
          <div className="project-edit__introduction">
            <Editor height="500px" />
          </div>
        </div>
      </form>
      <div className="project-edit__buttons">
        <button className="project-edit__delete">프로젝트 삭제</button>
        <button className="project-edit__save" type="submit">
          저장
        </button>
      </div>
    </div>
  );
}
