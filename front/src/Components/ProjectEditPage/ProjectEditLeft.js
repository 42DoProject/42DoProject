import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import ReactLoading from "../CommonComponent/Loading";
import PositionCard from "./PositionCard";
import Unsplash from "./Unsplash";
import skills from "../../skills.json";
import { positions } from "../../userData";
import { useSelector } from "react-redux";

export default function ProjectEditLeft({
  projectData,
  projectId,
  myData,
  image,
  setImage,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  dateDiff,
  selectedPos,
  setSelectedPos,
  selectedSkill,
  setSelectedSkill,
  imgLoadFlag,
  setImgLoadFlag,
  refer,
  setRefer,
}) {
  const [imgBase64, setImgBase64] = useState(); // 이미지 파일 base64 (업로드 전 미리보기 기능)
  const [openUnsplash, setOpenUnsplash] = useState(false);
  const unsplashRef = useRef();
  const loginState = useSelector((state) => state.loginReducer);

  const addSkill = (input) => {
    skills.skills.forEach((e, idx) => {
      if (input.value === e[0]) {
        // 선택한 값이 skills에 있으면
        for (let elem of selectedSkill) {
          if (elem[0] === input.value) {
            //선택한 값이 이미 selected에 있으면
            input.value = "";
            return; // 추가안하고 지워준 후 종료
          }
        }
        setSelectedSkill([...selectedSkill, [...e, idx + ""]]); // selectedSkill에 인덱스(el[2])와 함께 추가
        input.value = "";
      }
    });
  };

  const handleClickOutside = (event) => {
    if (unsplashRef.current && !unsplashRef.current.contains(event.target))
      setOpenUnsplash(false);
  };

  useEffect(() => {
    if (projectData) {
      if (projectData.thumbnailImage) {
        setImgLoadFlag(1);
        setImage(projectData.thumbnailImage);
      }
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
    if (!projectId) {
      setSelectedPos([
        [myData.profileImage, positions[myData.position], "disabled"],
      ]);
    }
  }, [myData, projectId, loginState]);

  useEffect(() => {
    const spinnerEl = document.querySelector(
      ".project-edit__thumbnail .loading-wrap"
    );
    if (imgLoadFlag === 2) spinnerEl.style.visibility = "hidden";
    if (imgLoadFlag === 1) spinnerEl.style.visibility = "visible";
  }, [imgLoadFlag]);

  if (openUnsplash) document.addEventListener("mousedown", handleClickOutside);

  return (
    <div className="project-edit__left">
      <label>
        프로젝트 썸네일<span className="project-edit__asterisk">*</span>
      </label>
      <div
        className="project-edit__thumbnail"
        onMouseOver={() => {
          document.querySelector(".project-edit__img-hover").style.visibility =
            "visible";
        }}
        onMouseLeave={() => {
          document.querySelector(".project-edit__img-hover").style.visibility =
            "hidden";
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
            openUnsplash === false
              ? setOpenUnsplash(true)
              : setOpenUnsplash(false)
          }>
          <div className="img-hover__add">이미지 선택</div>
        </div>
      </div>
      {openUnsplash === true && (
        <div ref={unsplashRef}>
          <Unsplash
            setOpenUnsplash={setOpenUnsplash}
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
        {startDate &&
          endDate &&
          (dateDiff > 0 ? (
            <span className="period__day">{`(${dateDiff}일)`}</span>
          ) : null)}
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
                const inputEl = document.querySelector(
                  "input.project-edit__add-skill"
                );
                addSkill(inputEl);
              }
            }}
          />
          <datalist id="tech-stacks">
            {[...skills.skills].sort().map((v, idx) => {
              return <option key={idx} value={v[0]} />;
            })}
          </datalist>
          <Icon
            icon="akar-icons:circle-plus-fill"
            className="add-skill__icon"
            onClick={() => {
              const inputEl = document.querySelector(
                "input.project-edit__add-skill"
              );
              addSkill(inputEl);
            }}
          />
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
  );
}
