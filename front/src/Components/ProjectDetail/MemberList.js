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
          <Icon icon="bi:person-fill" color="#565656" height="25" />
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
                    height="24"
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
                <div className="plus_icon">
                  <Icon
                    icon="akar-icons:circle-plus-fill"
                    color="#5bbcb6"
                    height="24"
                    position={elm}
                    key={index}
                    onClick={(e) => onApply(e, elm)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="chair_icon">
                  <svg
                    width="39"
                    height="50"
                    viewBox="0 -5 41 65"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M37.7865 27.5V5C37.7865 2.2425 35.5594 0 32.8209 0H7.99317C5.25467 0 3.02762 2.2425 3.02762 5V27.5C2.36915 27.5 1.73764 27.7634 1.27203 28.2322C0.806423 28.7011 0.544846 29.337 0.544846 30V50H5.5104V37.5H35.3037V50H40.2693V30C40.2693 29.337 40.0077 28.7011 39.5421 28.2322C39.0765 27.7634 38.445 27.5 37.7865 27.5ZM32.8209 5V27.5H27.8554V5H32.8209ZM22.8898 5V27.5H17.9243V5H22.8898ZM7.99317 5H12.9587V27.5H7.99317V5Z"
                      fill="#C4C4C4"
                    />
                  </svg>
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
