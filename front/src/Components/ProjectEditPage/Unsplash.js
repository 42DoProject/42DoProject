import React from "react";
import "../../SCSS/ProjectEditPage/Unsplash.scss";
import { Icon } from "@iconify/react";

export default function Unsplash(props) {
  return (
    <div className="unsplash__wrapper">
      <div className="unsplash__header">
        <div className="box-space"></div>
        <div className="unsplash__subject">썸네일 추가</div>
        <Icon
          icon="bx:bx-x"
          height="2rem"
          className="unsplash__x"
          onClick={() => {
            props.setUnsplashFlag(0);
          }}
        />
      </div>
      <hr />
      <div className="unsplash__tab">
        <div className="tab__presets">
          <Icon icon="bx:bx-bookmark" className="presets-icon" />
          프리셋
        </div>
        <div className="tab__search">
          <Icon icon="fe:search" className="search-icon" />
          검색
        </div>
        <div className="tab__upload">
          <Icon icon="bx:bx-upload" className="upload-icon" />
          이미지 업로드
        </div>
      </div>
      <hr />
    </div>
  );
}
