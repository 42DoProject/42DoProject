import React, { useState, useEffect } from "react";
import "../../SCSS/ProjectDetail/ProjectInfo.scss";
import { Icon } from "@iconify/react";
import skills from "../../skills.json";
import dayjs from "dayjs";
import axios from "axios";
import { useSelector } from "react-redux";

export default function ProjectInfo({
  info,
  userStatus,
  setCancleFlag,
  commentCount,
}) {
  const [clickFlag, setClickFlag] = useState(0);
  const [likeCount, setLikeCount] = useState(info.like);
  let loginState = useSelector((state) => state.loginReducer);

  let start = dayjs(info.startDate);
  let end = dayjs(info.endDate);
  let duration = end.diff(start, "day") + 1;

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

  const applyCancel = (e) => {
    axios({
      method: "DELETE",
      url: `http://localhost:5000/project/apply/${info.id}/${loginState.id}`,
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
        setCancleFlag(1);
      })
      .catch((e) => console.log(e));
    e.preventDefault();
  };

  const deleteMember = (e) => {
    axios({
      method: "DELETE",
      url: `http://localhost:5000/project/accept/${info.id}/${loginState.id}`,
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e));
    // e.preventDefault();
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
    if (loginState === null) alert("로그인해 주세요");
    else {
      setClickFlag(1);
      axios({
        method: "POST",
        url: `http://localhost:5000/project/like/${info.id}`,
        headers: {
          Authorization: `Bearer ${loginState.accessToken}`,
        },
      })
        .then((res) => {
          console.log(res);
          setLikeCount(likeCount + 1);
        })
        .catch((e) => console.log(e));
      e.preventDefault();
    }
  };

  const onClickUnlike = (e) => {
    setClickFlag(0);
    axios({
      method: "DELETE",
      url: `http://localhost:5000/project/like/${info.id}`,
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
        setLikeCount(likeCount - 1);
      })
      .catch((e) => console.log(e));
    e.preventDefault();
  };

  useEffect(() => {
    if (loginState !== null) {
      console.log(loginState);
      checkLike();
    }
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
              if (clickFlag === 0) onClickLike(e);
              else onClickUnlike(e);
            }}
          />
        </div>
        <div className="info_date">프로젝트 기간</div>
        <div className="date">
          {info.startDate || info.endDate ? (
            <>
              {info.startDate ? start.format("YY.MM.DD") : " ? "}
              {info.endDate ? " ~ " + end.format("YY.MM.DD") : " ~ ? "}
              {duration > 0 ? ` (${duration}일)` : ""}
            </>
          ) : (
            <span className="info_not-defined">기간이 정해지지 않았습니다</span>
          )}
        </div>
        <hr />
        <div className="info_skill">프로젝트 필요 스킬</div>
        <div className="skill">
          {info.skill.length ? (
            info.skill.map((e, i) => {
              return (
                <img
                  key={i}
                  alt={skills.skills[e][0]}
                  src={skills.skills[e][1]}
                />
              );
            })
          ) : (
            <span className="info_not-defined">
              필요한 스킬이 정해지지 않았습니다
            </span>
          )}
        </div>
        <div className="info_bottom">
          관심 {likeCount} ∙ 조회 {info.viewCount} ∙ 댓글 {commentCount}
        </div>
      </div>
      {userStatus === "applying" && (
        <div className="project-cancle_btn" onClick={(e) => applyCancel(e)}>
          신청 취소하기
        </div>
      )}
    </>
  );
}
