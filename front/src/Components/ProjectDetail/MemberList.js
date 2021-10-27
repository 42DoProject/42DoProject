import React, { useState } from "react";
import "../../SCSS/ProjectDetail/MemberList.scss";
import { Icon } from "@iconify/react";
import axios from "axios";
import { positions } from "../../userData";

export default function MemberList({
  data,
  loginState,
  userStatus,
  setApplyFlag,
}) {
  const onApply = (e, elm) => {
    if (loginState === null) alert("로그인이 필요합니다.");
    else {
      axios({
        method: "POST",
        url: `http://localhost:5000/project/apply/${data.id}/${elm}`,
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

  console.log("data", data);
  console.log("projectprofile", data.projectprofile);

  return (
    <>
      <div className="member_list">
        <div className="list_row1">
          <Icon icon="bi:person-fill" color="#565656" fontSize="1.5rem" />
          <div className="member_count">
            멤버 {data.currentMember} / {data.totalMember}
          </div>
        </div>
        <div className="member_image_list">
          <div className="filled_member">
            {data.projectprofile.map((e, key) => (
              <div className="member_image" key={key}>
                {data.leader === e.profile.id ? (
                  <Icon
                    icon="ph:crown-simple-fill"
                    color="#ffb648"
                    fontSize="1.3rem"
                  />
                ) : null}
                <img
                  key={key}
                  alt={e.profile.userId}
                  src={e.profile.user.profileImage}
                />
                <div className="member_position">
                  {e.position === null ? (
                    <div>백엔드</div>
                  ) : (
                    positions[e.position]
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
