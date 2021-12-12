import React, { useState } from "react";
import "../../SCSS/ProjectEditPage/Unsplash.scss";
import { Icon } from "@iconify/react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function Unsplash({
  setOpenUnsplash,
  setImage,
  image,
  setImgLoadFlag,
  setImgBase64,
  imgBase64,
}) {
  const [imgInput, setImgInput] = useState(); // unsplash 창에 이미지 파일 input 값
  const checkImage = () => {
    console.log("imgInput", imgInput);
    if (
      imgInput.type !== "image/jpeg" &&
      imgInput.type !== "image/jpg" &&
      imgInput.type !== "image/png" &&
      imgInput.type !== "image/gif" &&
      imgInput.type !== "image/bmp"
    )
      return false;
    else return true;
  };

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
            setOpenUnsplash(false);
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
            onChange={(e) => setImgInput(e.target.files[0])}
          />
          <div className="unsplash__body-info">
            <div> ✓ jpeg, jpg, png, gif, bmp 이미지를 업로드할 수 있어요</div>
            <div> ✓ 저작권에 위배되지 않는 이미지를 선택해주세요</div>
          </div>
        </div>
        {imgInput && checkImage() === true ? (
          <button
            className="unsplash__button-active"
            onClick={() => {
              let reader = new FileReader();

              reader.readAsDataURL(imgInput);
              reader.onloadend = () => {
                const base64 = reader.result.toString(); //imgInput 파일을 미리보기용 base64 이미지로 변환

                // if (imgBase64 === base64) {
                //   setImgLoadFlag(2); // 선택한 이미지가 기존과 같은 이미지일 경우
                // }
                setImgBase64(base64);
              };
              setImgLoadFlag(1);
              setImage(imgInput);
              setOpenUnsplash(false);
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
