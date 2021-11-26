import React from "react";
import "../../SCSS/ProjectEditPage/Unsplash.scss";
import { Icon } from "@iconify/react";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";

export default function Unsplash({
  setUnsplashFlag,
  setImage,
  image,
  setImgLoadFlag,
  setImgBase64,
  imgBase64,
}) {
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
            setUnsplashFlag(0);
          }}
        />
      </div>
      <hr />
      <div className="unsplash__tab">
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip
              id={`tooltip-top`}
              wrapperStyle={{ backgroundColor: "#4A4A4A" }}>
              준비중
            </Tooltip>
          }>
          <div className="tab__presets">
            <Icon icon="bx:bx-bookmark" className="presets-icon" />
            프리셋
          </div>
        </OverlayTrigger>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip
              id={`tooltip-top`}
              wrapperStyle={{ backgroundColor: "#4A4A4A" }}>
              준비중
            </Tooltip>
          }>
          <div className="tab__search">
            <Icon icon="fe:search" className="search-icon" />
            검색
          </div>
        </OverlayTrigger>

        <div className="tab__upload">
          <Icon icon="bx:bx-upload" className="upload-icon" />
          이미지 업로드
        </div>
      </div>
      <hr />
      <div className="unsplash__body">
        <div>
          <input
            type="file"
            className="upload__input"
            accept="image/jpeg, image/jpg, image/png, image/gif, image/bmp"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <div className="unsplash__body-info">
            <div> ✓ jpeg, jpg, png, gif, bmp 이미지를 업로드할 수 있어요</div>
            <div> ✓ 저작권에 위배되지 않는 이미지를 선택해주세요</div>
          </div>
        </div>
        {image ? (
          <button
            className="unsplash__button-active"
            onClick={() => {
              let reader = new FileReader();

              reader.readAsDataURL(image);
              reader.onloadend = () => {
                const base64 = reader.result.toString();

                if (imgBase64 === base64) {
                  setImgLoadFlag(2);
                }
                // 선택한 이미지가 기존과 같은 이미지일 경우
                setImgBase64(base64);
              };
              setImgLoadFlag(1);
              setUnsplashFlag(0);
            }}>
            이미지 선택
          </button>
        ) : (
          <button className="unsplash__button">이미지 선택</button>
        )}
      </div>
    </div>
  );
}
