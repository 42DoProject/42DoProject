import React, { useEffect, useRef, useState } from "react";
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
import { useHistory } from "react-router";

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

  let dateDiff =
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;

  const handleClickOutside = (event) => {
    if (unsplashRef.current && !unsplashRef.current.contains(event.target))
      setUnsplashFlag(0);
  };

  const projectSave = async () => {
    try {
      const editorInstance = editorRef.current.getInstance();
      let skillPost = [];
      for (let e of selectedSkill) skillPost.push(e[2]);

      const res = await axios({
        method: "POST",
        url: "http://localhost:5000/project",
        headers: {
          Authorization: `Bearer ${loginState.accessToken}`,
        },
        data: {
          title: document.querySelector(".project-edit__name").value,
          totalMember: selectedPos.length,
          state: "recruiting",
          startDate: startDate,
          endDate: endDate,
          content: editorInstance.getMarkdown(),
          tag: skillPost,
          position: ["1"],
        },
      });
      console.log(res);
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
      // console.log(myData);
      setSelectedPos([
        [myData.profileImage, positions[myData.position], "disabled"],
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMyData();
  }, [loginState]);

  unsplashFlag && document.addEventListener("mousedown", handleClickOutside);

  return (
    <div className="project-edit__wrapper">
      <div className="project-edit__form">
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
            <span className="period__day">
              ({startDate && endDate && (dateDiff > 0 ? dateDiff : "")}
              일)
            </span>
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
          />
          <label>
            프로젝트 소개<span className="project-edit__asterisk">*</span>
          </label>
          <div className="project-edit__introduction">
            <Editor ref={editorRef} height="500px" />
          </div>
        </div>
      </div>
      <div className="project-edit__buttons">
        {/* <button className="project-edit__delete">프로젝트 삭제</button> */}
        <button
          className="project-edit__save"
          onClick={() => {
            projectSave();
            history.push("/");
          }}>
          프로젝트 생성
        </button>
      </div>
    </div>
  );
}
