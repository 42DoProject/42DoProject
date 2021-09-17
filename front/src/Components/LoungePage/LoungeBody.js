import React from "react";
import "../../SCSS/LoungePage/LoungeBody.scss";
import { Link } from "react-router-dom";
import LoungePost from "./LoungePost";
import LoungeWrite from "./LoungeWrite";

export default function LoungeBody() {
  return (
    <>
      {/* 모집중인 프로젝트/ 홍보중인 프로젝트(완료) / 필터버튼 */}
      {/* 각각 버튼으로 바꾸어 주어야함.*/}
      <div className="lounge-body">
        <div className="lounge-left">
          <div className="left-bar">
            <div className="left-bar__lounge">라운지</div>
            <div className="left-bar__best">
              <Link to="/lounge">인기글</Link>
            </div>
          </div>
          <div className="left__posts">
            <LoungeWrite />
            <LoungePost />
            <LoungePost />
            <LoungePost />
          </div>
        </div>
        <div className="lounge-right">
          <div className="right-bar">접속중인 카뎃</div>
          <div className="right__connected"></div>
        </div>
      </div>
    </>
  );
}
