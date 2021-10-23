import React from "react";
import "../../SCSS/ProjectEditPage/Unsplash.scss";
import { Icon } from "@iconify/react";

export default function Unsplash({
  setUnsplashFlag,
  setImage,
  image,
  setImgLoadFlag,
  setImgBase64,
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
      <div className="unsplash__body">
        <div>
          <input
            type="file"
            accept=".jpeg, .png, .gif, .bmp"
            className="upload__input"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <div> jpeg, jpg, png, gif, bmp 파일</div>
          <div> 1200px * 3600px 이상</div>
        </div>
        {image ? (
          <button
            className="unsplash__button-active"
            onClick={async () => {
              // const formData = new FormData();
              // formData.append("thumbnail", image);
              // await axios({
              //   method: "post",
              //   url: "http://localhost:5000/project/thumbnail",
              //   data: formData,
              //   headers: {
              //     "Content-Type": "form-data",
              //   },
              // });
              // console.log(image);
              let reader = new FileReader();

              reader.readAsDataURL(image);
              reader.onloadend = () => {
                const base64 = reader.result;

                setImgBase64(base64.toString());
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
