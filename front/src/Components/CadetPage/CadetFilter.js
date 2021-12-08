import React, { useRef } from "react";
import "../../SCSS/CadetPage/CadetFilter.scss";
import skills from "../../skills.json";
import { Icon } from "@iconify/react";
import { positions } from "../../userData";

export default function CadetFilter({
  setFilterOption,
  setFilterFlag,
  selectedSkill,
  setSelectedSkill,
  selectedPos,
  setSelectedPos,
  selectedPosIndex,
  setSelectedPosIndex,
  cadetLevel,
  setCadetLevel,
  defaultPosition,
  setDefaultPosition,
}) {
  const myRef = useRef();

  const handleClickOutside = (event) => {
    if (myRef.current && !myRef.current.contains(event.target))
      setFilterFlag(0);
  };

  document.addEventListener("mousedown", handleClickOutside);

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

  const applyFilter = (e) => {
    setFilterOption({
      skill: selectedSkill,
      position: selectedPosIndex,
      level: cadetLevel,
    });
    setFilterFlag(0);
  };

  return (
    <>
      <div ref={myRef} className="filter">
        <div className="skill_filter">
          <div className="filter_header">보유 스킬로 필터링</div>
          <div className="project-edit__skill">
            <input
              className="project-edit__add-skill"
              placeholder="스킬을 검색해 추가해보세요"
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
          <div className="skill__tags">
            {selectedSkill.map((e, idx) => {
              return (
                <div key={idx} className="skill__wrap">
                  <img
                    className="selected-img"
                    key={idx + 1}
                    src={e[1]}
                    alt={e[2]}
                  />
                  <Icon
                    key={idx + 2}
                    className="skill_x"
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
        <div className="position_filter">
          <div className="filter_header">포지션으로 필터링</div>
          <select
            id="job_select"
            className="project-edit__add-position"
            defaultValue={defaultPosition}
            onChange={(e) => {
              const posSelectEl = document.getElementById("job_select");
              setSelectedPos(posSelectEl.value);
              setSelectedPosIndex(posSelectEl.selectedIndex - 1);
              setDefaultPosition(posSelectEl.value);
              // posSelectEl.selectedIndex = 0;
            }}
          >
            <option value="default" disabled>
              포지션 선택
            </option>
            {positions.map((v, i) => {
              return (
                <>
                  <option key={i} idx={i} value={v}>
                    {v}
                  </option>
                </>
              );
            })}
          </select>
        </div>
        <div className="level_filter">
          <div className="filter_header">42 레벨로 필터링</div>
          {/* <div className="input_wrap"> */}
          <input
            type="number"
            // defaultValue={cadetLevel}
            value={cadetLevel}
            name="cadet_level_number"
            min="0"
            max="10"
            step="1"
            onChange={(e) => {
              setCadetLevel(e.target.value);
            }}
          ></input>
          <input
            type="range"
            name="cadet_level_range"
            // defaultValue={cadetLevel}
            value={cadetLevel}
            min="0"
            max="10"
            step="1"
            onChange={(e) => {
              setCadetLevel(e.target.value);
            }}
          ></input>
          {/* </div> */}
        </div>
        <div className="filter_btn__wrap">
          <button className="filter_btn" onClick={(e) => applyFilter(e)}>
            적용하기
          </button>
        </div>
      </div>
    </>
  );
}
