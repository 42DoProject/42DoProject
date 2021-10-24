import React, { useState, useEffect } from "react";
import "../../SCSS/ProjectDetail/ProjectStatus.scss";
import { Icon, InlineIcon } from "@iconify/react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function ProjectStatus({ projectId, loginstate }) {
  const [status, setStatus] = useState();

  let loginState = useSelector((state) => state.loginReducer);

  const getStatusData = async () => {
    try {
      const {
        data: { status: statusData },
      } = await axios.get(
        `http://localhost:5000/project/status?projectId=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${loginState.accessToken}`,
          },
        }
      );
      setStatus(statusData);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(loginstate);
  useEffect(() => {
    if (loginstate !== null) getStatusData();
  }, [loginstate]);

  const statusData = {
    applying: {
      style: "applying",
      title: "참여 신청 완료",
      icon: "bi:shield-fill-check",
      detail: "팀장의 승인을 기다리고 있어요",
    },
    full: {
      style: "full",
      title: "모집 완료",
      icon: "ri:file-paper-2-line",
      detail: "더이상 신청을 받고 있지 않아요.",
    },
    nothing: {
      style: "nothing",
      title: "참여 신청 가능",
      icon: "ant-design:star-filled",
      detail: "포지션을 선택해 신청할 수 있어요.",
    },
    participaiting: {
      style: "participaiting",
      title: "프로젝트 참여중",
      icon: "mdi:lightning-bolt",
      detail: "프로젝트의 멤버가 되었어요.",
    },
  };

  let statusValue = statusData.nothing;

  switch (status) {
    case "participating":
      statusValue = statusData.participaiting;
      break;
    case "applying":
      statusValue = statusData.applying;
      break;
    case "full":
      statusValue = statusData.full;
      break;
  }

  return (
    <>
      <div className="status_box">
        <div className="status_title">{statusValue.title}</div>
        <Icon icon={statusValue.icon} color="white" height="60" />
        <div className="detail_row">
          <div className="detail_icon">
            <InlineIcon icon="bx:bx-info-circle" color="white" height="20" />
          </div>
          <div className="status_detail">{statusValue.detail}</div>
        </div>
      </div>
    </>
  );
}
