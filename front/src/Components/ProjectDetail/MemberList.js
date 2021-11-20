import React, { useState } from "react";
import "../../SCSS/ProjectDetail/MemberList.scss";
import { Icon } from "@iconify/react";
import axios from "axios";
import { positions } from "../../userData";
import WaitList from "./WaitList";
import { useHistory } from "react-router";
import MemberCard from "./MemberCard";
import ProjectStatusChange from "./ProjectStatusChange";

export default function MemberList({
  data,
  loginState,
  userStatus,
  setApplyFlag,
}) {
  const history = useHistory();

  const onApply = (e, elm) => {
    if (loginState === null) alert("로그인이 필요합니다.");
    else {
      axios({
        method: "POST",
        url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/project/apply/${data.id}/${elm}`,
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
    }
  };

  return (
    <>
      <div className="member_list">
        <div className="list_row1">
          <div className="member-icon__wrap">
            <Icon icon="bi:person-fill" color="#565656" fontSize="1.5rem" />
            <div className="member_count">
              멤버 {data.currentMember} / {data.totalMember}
            </div>
          </div>
          {loginState?.id === data.leader ? (
            <div className="project_manage">
              <WaitList
                data={data}
                loginState={loginState}
                setApplyFlag={setApplyFlag}
                positions={positions}
              />
              <ProjectStatusChange
                data={data}
                loginState={loginState}
                setApplyFlag={setApplyFlag}
              />
              <div
                className="edit__btn"
                onClick={(e) => {
                  history.push(`/project/edit/${data.id}`);
                  e.preventDefault();
                }}
              >
                수정
              </div>
            </div>
          ) : null}
        </div>
        <div className="member_image_list">
          <div className="filled_member">
            {data?.projectprofile.map((elm, key) => (
              <>
                {data.leader === elm.profile.id ? (
                  <MemberCard
                    elm={elm}
                    key={key}
                    data={data}
                    loginState={loginState}
                    setApplyFlag={setApplyFlag}
                  />
                ) : null}
              </>
            ))}
            {data?.projectprofile.map((elm, key) => (
              <>
                {data.leader !== elm.profile.id ? (
                  <MemberCard
                    elm={elm}
                    key={key}
                    data={data}
                    loginState={loginState}
                    setApplyFlag={setApplyFlag}
                  />
                ) : null}
              </>
            ))}
          </div>
          <div className="empty_list">
            {data?.position.map((elm, key) => (
              <div className="empty_member" key={key}>
                <div className="chair_icon">
                  <Icon
                    icon="bx:bx-chair"
                    style={{ fontSize: "3.5rem", color: "#c4c4c4" }}
                    className="empty_chair-icon"
                  />
                  {userStatus?.status === "nothing" && (
                    <div className="plus_icon">
                      <Icon
                        icon="akar-icons:circle-plus-fill"
                        color="#5bbcb6"
                        position={elm}
                        key={key}
                        onClick={(e) => onApply(e, elm)}
                        style={{ fontSize: "1.7rem", cursor: "pointer" }}
                      />
                    </div>
                  )}
                  {userStatus?.status === "applying" &&
                    userStatus?.applyingPosition === elm && (
                      <div className="check_icon">
                        <Icon
                          icon="ant-design:check-circle-filled"
                          color="#ffb648"
                          position={elm}
                          key={key}
                          style={{ fontSize: "1.7rem" }}
                        />
                      </div>
                    )}
                </div>
                <div className="empty_position">{positions[elm]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
