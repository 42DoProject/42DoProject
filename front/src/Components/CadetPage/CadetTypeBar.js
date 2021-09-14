import React from "react";
import { Icon } from "@iconify/react";
import "../../SCSS/CadetPage/CadetTypeBar.scss";
import { Link } from "react-router-dom";
export default function CadetTypeBar() {
  return (
    <>
      {/* 모집중인 프로젝트/ 홍보중인 프로젝트(완료) / 필터버튼 */}
      {/* 각각 버튼으로 바꾸어 주어야함.*/}
      <div className="cadet-bar">
        <div className="cadet-bar-column1">
          <div className="recruit-cadet">프로젝트를 찾고있는 카뎃</div>
          <div className="public-cadet">
            <Link to="/allcadet">모든 카뎃</Link>
          </div>
        </div>
        <div className="cadet-bar-column2">
          <Icon icon="mi:filter" style={{ fontSize: "2rem" }} />
        </div>
      </div>
    </>
  );
}
