import React, { useState } from "react";
import { Icon } from "@iconify/react";
import "../../SCSS/CadetPage/CadetTypeBar.scss";
import { Link } from "react-router-dom";
import CadetFilter from "./CadetFilter";

export default function CadetTypeBar({ state, setFilterOption }) {
  const [filterFlag, setFilterFlag] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState([]);
  const [selectedPos, setSelectedPos] = useState(); //[[사진, 포지션이름, x여부], [사진, 포지션이름, x여부]]
  const [selectedPosIndex, setSelectedPosIndex] = useState();
  const [cadetLevel, setCadetLevel] = useState(0);
  const [defaultPosition, setDefaultPosition] = useState("default");

  let recruitColor = "a-color";
  let allColor = "a-color";
  switch (state) {
    case "recruit":
      recruitColor = "b-color";
      break;
    case "all":
      allColor = "b-color";
      break;
  }
  return (
    <>
      <div className="cadet-bar">
        <div className="cadet-bar-column1">
          <Link className={recruitColor} to="/cadet/recruit">
            프로젝트를 찾고 있는 카뎃
          </Link>
          <Link className={allColor} to="/cadet/all">
            모든 카뎃
          </Link>
        </div>
        <div className="cadet-bar-column2">
          <Icon
            icon="mi:filter"
            style={{ fontSize: "2rem", cursor: "pointer" }}
            onClick={(e) => {
              if (filterFlag === 0) setFilterFlag(1);
              else setFilterFlag(0);
            }}
          />
          {filterFlag === 1 && (
            <CadetFilter
              setFilterOption={setFilterOption}
              setFilterFlag={setFilterFlag}
              selectedPos={selectedPos}
              setSelectedPos={setSelectedPos}
              selectedPosIndex={selectedPosIndex}
              setSelectedPosIndex={setSelectedPosIndex}
              selectedSkill={selectedSkill}
              setSelectedSkill={setSelectedSkill}
              cadetLevel={cadetLevel}
              setCadetLevel={setCadetLevel}
              setDefaultPosition={setDefaultPosition}
              defaultPosition={defaultPosition}
            />
          )}
        </div>
      </div>
    </>
  );
}
