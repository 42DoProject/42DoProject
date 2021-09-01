import React from "react";
import { Icon } from "@iconify/react";
import "../../SCSS/Navbar.scss";
export default function Navbar() {
  return (
    <div className="Nav">
      <div className="Nav-column1">
        <div className="Nav__title">
          <Icon className="title-icon" icon="simple-icons:42" />
          <div className="title-text">DoProject</div>
        </div>
        <div className="Nav__input">
          <Icon className="input-icon" icon="fe:search" />
          <input placeholder="카뎃 닉네임, 프로젝트명 등을 검색해보세요"></input>
        </div>
      </div>
      <div className="Nav-column2">
        <div className="Nav__project">프로젝트</div>
        <div className="Nav__cadet">카뎃</div>
        <div className="Nav__lounge">라운지</div>
        <div className="Nav__notification">
          <span>1</span>
          <Icon className="icon" icon="carbon:notification" />
        </div>
        <div className="Nav__user">
          <div className="Nav__user name">seojeong</div>
          <div className="Nav__user image">
            <Icon icon="bi:person-fill" />
          </div>
        </div>
        <div className="Nav__menu">
          <Icon icon="heroicons-outline:menu-alt-4" />
        </div>
      </div>
    </div>
  );
}
