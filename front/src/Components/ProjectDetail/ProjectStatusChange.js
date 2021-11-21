import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../SCSS/ProjectDetail/ProjectStatusChange.scss";
import { Icon } from "@iconify/react";

export default function ProjectStatusChange({
  data,
  setApplyFlag,
  loginState,
}) {
  const [toggle, setToggle] = useState(false);

  const onToggle = (e) => {
    if (toggle === false) {
      setToggle(true);
    } else setToggle(false);
    console.log("here");
  };
  const onStatusChange = () => {
    var status = document.getElementById("change_status").value;
    axios({
      method: "PUT",
      url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/project/status/${data.id}?state=${status}`,
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
        setApplyFlag(1);
        setToggle(false);
      })
      .catch((e) => console.log(e));
    console.log(status);
  };
  return (
    <>
      <div className="change__btn">
        <div className="edit__btn" onClick={onToggle}>
          프로젝트 상태 변경
        </div>

        {toggle && (
          <div className="change_toggle">
            <div className="toggle_header">프로젝트 상태 변경</div>
            <div className="toggle_body">
              <select className="change_select" id="change_status">
                <option value="recruiting">모집중</option>
                <option value="proceeding">진행중</option>
                <option value="completed">완성됨</option>
              </select>
              <Icon
                icon="ant-design:check-circle-filled"
                className="change_btn"
                onClick={(e) => onStatusChange(e)}
                fontSize="1.5rem"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
