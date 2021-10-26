import React, { useState } from "react";
import "../../SCSS/ProjectDetail/MemberList.scss";
import { Icon } from "@iconify/react";
import axios from "axios";
import { positions } from "../../userData";

export default function MemberList({ data, loginState }) {
  const onApply = (e, elm) => {
    axios({
      method: "POST",
      url: `http://localhost:5000/project/apply/${data.id}/${elm}`,
      headers: {
        Authorization: `Bearer ${loginState.acceessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e));
    e.preventDefault();
  };
  console.log(data.position);
  console.log(data.projectprofile);
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
              <div className="member_image">
                {data.leader === e.profile.userId ? (
                  <Icon
                    icon="ph:crown-simple-fill"
                    color="#ffb648"
                    fontSize="1.3rem"
                  />
                ) : null}
                <img
                  img
                  key={key}
                  alt={e.profile.userId}
                  src={e.profile.user.profileImage}
                />
                <div className="member_position">
                  {positions[e.profile.position]}
                </div>
              </div>
            ))}
          </div>
          <div className="empty_list">
            {data.position.map((elm, index) => (
              <div className="empty_member">
                <div className="chair_icon">
                  <Icon
                    icon="bx:bx-chair"
                    style={{ fontSize: "3.5rem", color: "#c4c4c4" }}
                    className="empty_chair-icon"
                  />
                  <div className="plus_icon">
                    <Icon
                      icon="akar-icons:circle-plus-fill"
                      color="#5bbcb6"
                      position={elm}
                      key={index}
                      onClick={(e) => onApply(e, elm)}
                      style={{ fontSize: "1.7rem", cursor: "pointer" }}
                    />
                  </div>
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
