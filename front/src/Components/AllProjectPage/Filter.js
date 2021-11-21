import React, { useState } from "react";
import "../../SCSS/AllProjectPage/Filter.scss";
import skills from "../../skills.json";
import { Icon } from "@iconify/react";
import { positions } from "../../userData";
// import PositionCard from "../ProjectEditPage/PositionCard.js";

export default function Filter({ setFilterOption, setFilterFlag }) {
  const [selectedSkill, setSelectedSkill] = useState([]);
  const [selectedPos, setSelectedPos] = useState([]); //[[사진, 포지션이름, x여부], [사진, 포지션이름, x여부]]
  const [selectedPosIndex, setSelectedPosIndex] = useState([]);
  var filterUrl = "";
  var sortValue = "new";

  const onCheckSort = (e) => {
    const checkboxes = document.getElementsByName("sortbox");
    checkboxes.forEach((cb) => {
      cb.checked = false;
    });
    e.currentTarget.checked = true;
    sortValue = e.currentTarget.value;
  };

  //프로젝트 리스트 쿼리를 적용하기 위한 문자열처리 부분
  const applyFilter = (e) => {
    for (var i in selectedPosIndex) {
      filterUrl = filterUrl + "&position=" + selectedPosIndex[i];
    }
    for (var i in selectedSkill) {
      filterUrl = filterUrl + "&skill=" + selectedSkill[i][2];
    }
    if (sortValue !== "new") filterUrl = filterUrl + "&order=" + sortValue;
    setFilterOption(filterUrl);
    filterUrl = "";
    sortValue = "new";
    setFilterFlag(0);
  };
  return (
    <>
      <div className="filter">
        <div className="skill_filter">
          <div className="filter_header">필요한 스킬로 필터링</div>
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
                      setSelectedSkill([...selectedSkill, [...el, idx + ""]]);
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
          <div className="filter_header">빈 포지션으로 필터링</div>
          <select
            id="job_select"
            className="project-edit__add-position"
            defaultValue="default"
            onChange={(e) => {
              for (let elem of selectedPos) {
                if (elem[0] === e.target.value) {
                  //선택한 값이 이미 selected에 있으면
                  e.target.value = "";
                  return; // 추가안하고 지워준 후 종료
                }
              }
              const posSelectEl = document.getElementById("job_select");
              setSelectedPos([...selectedPos, [posSelectEl.value]]);
              setSelectedPosIndex([
                ...selectedPosIndex,
                //포지션 추가가 index 0이라 나머지가 position 인덱스보다 +1
                posSelectEl.selectedIndex - 1,
              ]);
              posSelectEl.selectedIndex = 0;
            }}>
            <option value="default" disabled>
              포지션 추가
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
          <div className="position__tags">
            {selectedPos.map((e, idx) => {
              return (
                <div className="tag_wrap" key={idx}>
                  <div className="position__tag" key={idx + 1}>
                    {e}
                  </div>
                  <Icon
                    key={idx + 2}
                    className="position_x"
                    icon="bi:x-circle-fill"
                    onClick={(e) => {
                      let dup = [...selectedPos];
                      dup.splice(idx, 1);
                      setSelectedPos(dup);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="filter_header">정렬</div>

        <div className="filter_sort">
          <div className="sort_box">
            <input
              type="checkbox"
              name="sortbox"
              value="new"
              // checked="true"
              onClick={(e) => {
                onCheckSort(e);
              }}
            />
            <div className="sort_text">최신순</div>
          </div>
          <div className="sort_box">
            <input
              type="checkbox"
              name="sortbox"
              value="view"
              onClick={(e) => {
                onCheckSort(e);
              }}
            />
            <div className="sort_text">조회순</div>
          </div>
          <div className="sort_box">
            <input
              type="checkbox"
              name="sortbox"
              value="like"
              onClick={(e) => {
                onCheckSort(e);
              }}
            />
            <div className="sort_text">인기순</div>
          </div>
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
