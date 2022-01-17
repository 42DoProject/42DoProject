import React, { useState, useEffect } from "react";
import "../../SCSS/ProjectDetail/ProjectInfo.scss";
import { Icon } from "@iconify/react";
import skills from "../../skills.json";
import dayjs from "dayjs";
import axios from "axios";
import { useSelector } from "react-redux";
import Modal from "../ProjectEditPage/Modal";

export default function ProjectInfo({
  info,
  userStatus,
  setCancleFlag,
  setApplyFlag,
  commentCount,
}) {
  const [clickFlag, setClickFlag] = useState(0);
  const [likeCount, setLikeCount] = useState(info.like);
  const [cancleModal, setCancleModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
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

  const applyCancel = () => {
    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project/apply/${info.id}/${loginState.id}`,
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
    })
      .then((res) => {
        setCancleFlag(1);
        setCancleModal(false)
      })
      .catch((e) => console.log(e));
  };

  const deleteMember = () => {
    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project/accept/${info.id}/${loginState.id}`,
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
    })
      .then((res) => {
        setApplyFlag(1);
        setDeleteModal(false);
      })
      .catch((e) => console.log(e));
  };

  const checkLike = async () => {
    try {
      const {
        data: { message: likeStatus },
      } = await axios.get(
        `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project/interest/${info.id}`,
        {
          headers: {
            Authorization: `Bearer ${loginState.accessToken}`,
          },
        }
      );
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
        url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project/like/${info.id}`,
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
      url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project/like/${info.id}`,
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
            fontSize="1.5rem"
            onClick={(e) => {
              if (clickFlag === 0) onClickLike(e);
              else onClickUnlike(e);
            }}
          />
        </div>
        <div className="info_createdAt">프로젝트 생성일</div>
        <div className="createdAt">
          {dayjs(info.content.createdAt).format("YY.MM.DD")}
        </div>
        <hr />
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
        <div className="project-cancle_btn" onClick={() => setCancleModal(true)}>
          신청 취소하기
        </div>
      )}
      {cancleModal === true && (
        <Modal
          body="프로젝트 신청을 취소하시겠습니까?"
          buttons={["아니오", "네"]}
          cancelFunc={() => setCancleModal(false)}
          confirmFunc={() => applyCancel()}
        />
      )}
      {userStatus === "participating" && loginState?.id !== info.leader && (
        <div className="project-cancle_btn" onClick={() => setDeleteModal(true)}>
          프로젝트에서 나가기
        </div>
      )}
      {deleteModal === true && (
        <Modal
          body="프로젝트에서 나가시겠습니까?"
          buttons={["아니오", "네"]}
          cancelFunc={() => setDeleteModal(false)}
          confirmFunc={() => deleteMember()}
        />
      )}
    </>
  );
}
