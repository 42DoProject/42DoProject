import React from "react";
import "../../SCSS/LoungePage/LoungeBody.scss";
import { Link } from "react-router-dom";
import LoungePost from "./LoungePost";
import LoungeWrite from "./LoungeWrite";
import { useSelector } from "react-redux";
import defaultImg from "../../default_intra.png";

export default function LoungeBody() {
  let loginState = useSelector((state) => state.loginReducer);
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
            {loginState !== null ? <LoungeWrite /> : <LoungePost />}
            <LoungePost />
            <LoungePost />
            <LoungePost />
          </div>
        </div>
        <div className="lounge-right">
          <div className="right-bar">
            접속중인 카뎃 <span className="right-num"> 12명</span>
          </div>
          <div className="right__connected-wrap">
            <div className="right__connected">
              <div className="connected__cadet">
                <img
                  className="connected__img"
                  src={defaultImg}
                  alt="connected__img"></img>
                <div className="connected__name">seojeong</div>
              </div>
              <div className="connected__cadet">
                <img
                  className="connected__img"
                  src={defaultImg}
                  alt="connected__img"></img>
                <div className="connected__name">jiylee</div>
              </div>
              <div className="connected__cadet">
                <img
                  className="connected__img"
                  src={defaultImg}
                  alt="connected__img"></img>
                <div className="connected__name">seojeong</div>
              </div>
              <div className="connected__cadet">
                <img
                  className="connected__img"
                  src={defaultImg}
                  alt="connected__img"></img>
                <div className="connected__name">seojeong</div>
              </div>
              <div className="connected__cadet">
                <img
                  className="connected__img"
                  src={defaultImg}
                  alt="connected__img"></img>
                <div className="connected__name">seojeong</div>
              </div>
              <div className="connected__cadet">
                <img
                  className="connected__img"
                  src={defaultImg}
                  alt="connected__img"></img>
                <div className="connected__name">seojeong</div>
              </div>
              <div className="connected__cadet">
                <img
                  className="connected__img"
                  src={defaultImg}
                  alt="connected__img"></img>
                <div className="connected__name">seojeong</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
