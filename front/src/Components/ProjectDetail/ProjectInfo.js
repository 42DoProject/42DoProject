import React, { useState, useEffect } from "react";
import "../../SCSS/ProjectDetail/ProjectInfo.scss";
import { Icon } from "@iconify/react";
import skills from "../../skills.json";
import dayjs from "dayjs";
import axios from "axios";
import { useSelector } from "react-redux";

export default function ProjectInfo({ info, loginstate }) {
  const [clickFlag, setClickFlag] = useState(0);
  let loginState = useSelector((state) => state.loginReducer);

  var start = dayjs(info.startDate);
  var end = dayjs(info.endDate);
  var duration = end.diff(start, "day");

  console.log(duration);

  const likeData = [
    {
      icon: "fluent:heart-24-regular",
      color: "#545454",
    },
    {
      icon: "fluent:heart-24-filled",
      color: "#ff6864",
    },
  ];

  //userId부분 추후 변경 예정.
  const applyCancel = (e) => {
    axios({
      method: "DELETE",
      url: `http://localhost:5000/project/apply/${info.id}/1`,
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e));
    e.preventDefault();
  };

  const checkLike = async () => {
    try {
      const {
        data: { message: likeStatus },
      } = await axios.get(`http://localhost:5000/project/interest/${info.id}`, {
        headers: {
          Authorization: `Bearer ${loginState.accessToken}`,
        },
      });
      likeStatus === "true" ? setClickFlag(1) : setClickFlag(0);
    } catch (err) {
      console.log(err);
    }
  };

  const onClickLike = (e) => {
    if (loginState === null) alert("로그인이 필요합니다!");
    else {
      axios({
        method: "POST",
        url: `http://localhost:5000/project/like/${info.id}`,
        headers: {
          Authorization: `Bearer ${loginState.accessToken}`,
        },
      })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => console.log(e));
      e.preventDefault();
    }
  };

  const onClickUnlike = (e) => {
    axios({
      method: "DELETE",
      url: `http://localhost:5000/project/like/${info.id}`,
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e));
    e.preventDefault();
  };

  useEffect(() => {
    checkLike();
  }, []);

  return (
    <>
      <div className="project_info">
        <div className="info_icon">
          <Icon
            icon={likeData[clickFlag].icon}
            color={likeData[clickFlag].color}
            height="25"
            onClick={(e) => {
              if (clickFlag === 0) {
                setClickFlag(1);
                onClickLike(e);
              } else {
                setClickFlag(0);
                onClickUnlike(e);
              }
            }}
          />
        </div>
        <div className="info_date">프로젝트 기간</div>
        <div className="date">
          {start.format("YY.MM.DD")} ~ {end.format("YY.MM.DD")} ({duration} 일)
        </div>
        <hr />
        <div className="info_skill">프로젝트 필요 스킬</div>
        <div className="skill">
          {info.skill &&
            info.skill.map((e, i) => {
              return (
                <img
                  key={i}
                  alt={skills.skills[e][0]}
                  src={skills.skills[e][1]}
                />
              );
            })}
        </div>
        <div className="info_bottom">
          관심 {info.like} ∙ 댓글 {info.commentCount} ∙ 조회 {info.viewCount}
        </div>
      </div>
      {loginstate !== null && (
        <div className="project-cancle_btn" onClick={(e) => applyCancel(e)}>
          취소하기
        </div>
      )}
    </>
  );
}
