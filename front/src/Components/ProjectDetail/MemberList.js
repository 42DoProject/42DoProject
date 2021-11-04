import React, { useState } from "react";
import "../../SCSS/ProjectDetail/MemberList.scss";
import { Icon } from "@iconify/react";
import axios from "axios";
import { positions } from "../../userData";
import WaitList from "./WaitList";
import { useHistory } from "react-router";

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
          <Icon icon="bi:person-fill" color="#565656" fontSize="1.5rem" />
          <div className="member_count">
            멤버 {data.currentMember} / {data.totalMember}
          </div>
          {loginState?.id === data.leader ? (
            <WaitList
              data={data}
              loginState={loginState}
              setApplyFlag={setApplyFlag}
              positions={positions}
            />
          ) : null}
        </div>
        <div className="member_image_list">
          <div className="filled_member">
            {data?.projectprofile.map((elm, key) => (
              <div className="member_image" key={key}>
                {data.leader === elm.profile.id ? (
                  <div className="leader_icon">
                    <Icon
                      icon="ph:crown-simple-fill"
                      color="#ffb648"
                      fontSize="1.3rem"
                    />
                  </div>
                ) : null}
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
                <div className="member_position">
                  {elm.position === null ? (
                    // 리더의 포지션이 정해지면 수정 필요.
                    <div>팀장</div>
                  ) : (
                    positions[elm.position]
                  )}
                </div>
              </div>
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
