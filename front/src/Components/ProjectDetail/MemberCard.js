import React, { useState, useEffect } from "react";
import CheckModal from "./CheckModal";
import { useHistory } from "react-router";
import axios from "axios";
import { Icon } from "@iconify/react";
import { positions } from "../../userData";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";

export default function MemberCard({
  elm,
  key,
  data,
  loginState,
  setApplyFlag,
}) {
  const history = useHistory();
  const [toggleNum, setToggleNum] = useState(0);
  const [modalFlag, setModalFlag] = useState(0);
  const [iconStyle, setIconStyle] = useState("bi:caret-down-fill");

  const modalOpen = () => {
    if (modalFlag == 0) {
      setModalFlag(1);
    } else {
      setModalFlag(0);
    }
  };
  const onMemberToggle = (e, key) => {
    if (toggleNum === 0) {
      setToggleNum(1);
      setIconStyle("bi:caret-up-fill");
    } else {
      setToggleNum(0);
      setIconStyle("bi:caret-down-fill");
    }
  };

  const onChangeLeader = (e, elm) => {
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project/leader/${data.id}/${elm.profile.id}`,
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
        setApplyFlag(1);
      })
      .catch((e) => console.log(e));
    e.preventDefault();
  };

  const onDeleteMember = (e, elm) => {
    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project/accept/${data.id}/${elm.profile.id}`,
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
        setApplyFlag(1);
      })
      .catch((e) => console.log(e));
    e.preventDefault();
  };

  return (
    <div className="member_image">
      {data.leader === elm.profile.id ? (
        <div className="leader_icon">
          <Icon icon="ph:crown-simple-fill" color="#ffb648" fontSize="1.3rem" />
        </div>
      ) : null}
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip
            id={`tooltip-top`}
            wrapperStyle={{ backgroundColor: "#4A4A4A" }}
          >
            {elm.profile.user.username}
          </Tooltip>
        }
      >
        <img
          key={key}
          alt={elm.profile.id}
          src={elm.profile.user.profileImage}
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault();
            history.push(`/profile/${elm.profile.id}`);
          }}
        />
      </OverlayTrigger>

      <div className="member_position__row1">
        <div
          className="member_position"
          //이부분이 setState문제!
          // onClick={(e) => onMemberToggle(e, key)}
        >
          <div className="empty_div" />
          <div className="position_text">
            {elm.position === null ? (
              // 리더의 포지션이 정해지면 수정 필요.
              <div>팀장</div>
            ) : (
              positions[elm.position]
            )}
          </div>
          {loginState?.id === data.leader ? (
            <div className="member_control">
              <Icon
                icon={iconStyle}
                color="white"
                fontSize="0.8rem"
                key={key}
                onClick={(e) => onMemberToggle(e, key)}
              />
              {toggleNum === 1 && (
                <div className="member_toggle">
                  {elm.profile.id !== data.leader && (
                    <div
                      className="toggle_text"
                      onClick={(e) => onChangeLeader(e, elm)}
                    >
                      팀장 위임하기
                    </div>
                  )}
                  {elm.profile.id !== data.leader && (
                    <div
                      className="toggle_text"
                      onClick={(e) => onDeleteMember(e, elm)}
                    >
                      내보내기
                    </div>
                  )}
                  <div className="toggle_text" onClick={modalOpen}>
                    포지션 변경하기
                  </div>
                  {modalFlag === 1 && (
                    <CheckModal
                      data={data}
                      positions={positions}
                      position={elm.position}
                      setModalFlag={setModalFlag}
                      setApplyFlag={setApplyFlag}
                      loginState={loginState}
                      userId={elm.profile.id}
                      modalFlag={modalFlag}
                      setToggleNum={setToggleNum}
                    />
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="empty_div" />
          )}
        </div>
      </div>
    </div>
  );
}
