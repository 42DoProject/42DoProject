import React, { useState, useEffect } from "react";
import "../../SCSS/ProjectDetail/ProjectStatus.scss";
import { Icon, InlineIcon } from "@iconify/react";
import axios from "axios";

export default function ProjectStatus({ userStatus, project }) {
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
  switch (userStatus) {
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
  if (!(project.currentMember < project.totalMember))
    statusValue = statusData.full;
  return (
    <>
      <div className="status_box">
        <div className="status_title">{statusValue.title}</div>
        <Icon
          icon={statusValue.icon}
          style={{ fontSize: "4rem", color: "white" }}
        />
        <div className="detail_row">
          <div className="detail_icon">
            <InlineIcon
              icon="bx:bx-info-circle"
              style={{ fontSize: "1rem", color: "white" }}
            />
          </div>
          <div className="status_detail">{statusValue.detail}</div>
        </div>
      </div>
    </>
  );
}
