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
    if (loginState === null) alert("???????????? ?????????");
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
        <div className="info_createdAt">???????????? ?????????</div>
        <div className="createdAt">
          {dayjs(info.content.createdAt).format("YY.MM.DD")}
        </div>
        <hr />
        <div className="info_date">???????????? ??????</div>
        <div className="date">
          {info.startDate || info.endDate ? (
            <>
              {info.startDate ? start.format("YY.MM.DD") : " ? "}
              {info.endDate ? " ~ " + end.format("YY.MM.DD") : " ~ ? "}
              {duration > 0 ? ` (${duration}???)` : ""}
            </>
          ) : (
            <span className="info_not-defined">????????? ???????????? ???????????????</span>
          )}
        </div>
        <hr />
        <div className="info_skill">???????????? ?????? ??????</div>
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
              ????????? ????????? ???????????? ???????????????
            </span>
          )}
        </div>
        <div className="info_bottom">
          ?????? {likeCount} ??? ?????? {info.viewCount} ??? ?????? {commentCount}
        </div>
      </div>
      {userStatus === "applying" && (
        <div className="project-cancle_btn" onClick={() => setCancleModal(true)}>
          ?????? ????????????
        </div>
      )}
      {cancleModal === true && (
        <Modal
          body="???????????? ????????? ?????????????????????????"
          buttons={["?????????", "???"]}
          cancelFunc={() => setCancleModal(false)}
          confirmFunc={() => applyCancel()}
        />
      )}
      {userStatus === "participating" && loginState?.id !== info.leader && (
        <div className="project-cancle_btn" onClick={() => setDeleteModal(true)}>
          ?????????????????? ?????????
        </div>
      )}
      {deleteModal === true && (
        <Modal
          body="?????????????????? ??????????????????????"
          buttons={["?????????", "???"]}
          cancelFunc={() => setDeleteModal(false)}
          confirmFunc={() => deleteMember()}
        />
      )}
    </>
  );
}
