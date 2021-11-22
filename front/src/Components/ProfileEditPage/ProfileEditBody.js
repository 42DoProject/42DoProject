import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import "../../SCSS/ProfilePage/ProfileBody.scss";
import { useSelector } from "react-redux";
import skills from "../../skills.json";
import { positions } from "../../userData";
// import Cards from "../MainPage/Cards";

export default function ProfileEditBody(props) {
  // let userState = useSelector((state) => state.userReducer);
  const loginState = useSelector((state) => state.loginReducer);
  let existingSkills = [];
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (props.user.skill) {
      props.user.skill.forEach((e) => {
        existingSkills.push([skills.skills[e][0], skills.skills[e][1], e]);
      });
      setSelected(existingSkills);
    }
  }, [props]);

  return (
    <div className="profileBody">
      <div className="profileBody__col1">
        <div className="col1__profile-card1">
          <div className="card1__job">
            <div className="job__label">포지션</div>
            <select id="job_select" className="job__content">
              {positions.map((v, idx) => {
                return idx === props.user.position ? (
                  <option key={idx} value={idx} selected>
                    {v}
                  </option>
                ) : (
                  <option key={idx} value={idx}>
                    {v}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="card1__skill">
            <div className="skill__label">보유 스킬</div>
            <input
              className="skill__content"
              list="tech-stacks"
              placeholder="스킬을 검색해 추가해보세요"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  skills.skills.forEach((el, idx) => {
                    if (e.target.value === el[0]) {
                      // 선택한 값이 skills에 있으면
                      for (let elem of selected) {
                        if (elem[0] === e.target.value) {
                          //선택한 값이 이미 selected에 있으면
                          e.target.value = "";
                          return; // 추가안하고 지워준 후 종료
                        }
                      }
                      setSelected([...selected, [...el, idx + ""]]); // selected에 인덱스(el[2])와 함께 추가
                      e.target.value = "";
                      // console.log(idx);
                    }
                  });
                }
              }}
            />
            <datalist id="tech-stacks">
              {[...skills.skills].sort().map((v, idx) => {
                return <option key={idx} value={v[0]} />;
              })}
            </datalist>
          </div>
          <div className="selected-skills">
            {selected.map((e, idx) => {
              return (
                <div key={idx} className="selected-el">
                  <img
                    className="selected-img"
                    key={idx + 1}
                    src={e[1]}
                    alt={e[2]}
                  />
                  <Icon
                    key={idx + 2}
                    className="selected-x"
                    icon="bi:x-circle-fill"
                    onClick={(e) => {
                      let dup = [...selected];
                      dup.splice(idx, 1);
                      setSelected(dup);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="col1__profile-card2">
          <div className="card2__location">
            <Icon icon="carbon:location-filled" height="25px" />
            <span>{loginState?.location}</span>
          </div>
          <div className="card2__level">
            <Icon icon="simple-icons:42" width="25px" />
            <span>{`level ${Math.floor(props.user.level)}`}</span>
          </div>
          <div className="card2__email">
            <Icon icon="fluent:mail-48-filled" height="25px" />
            <span className="email-span">{loginState?.email}</span>
          </div>
          <div className="card2__github">
            <Icon icon="akar-icons:github-fill" height="22px" />
            <input
              spellCheck="false"
              type="text"
              className="github-span"
              maxLength="15"
              placeholder="GitHub user name"
              defaultValue={props.user.github}
            />
          </div>
        </div>
      </div>
      <div className="profileBody__col2">
        <div className="col2__ongoing-projects">
          <span className="col2__subject-span">진행중인 프로젝트</span>
        </div>
        <hr className="hr__line" />
        <div className="col2__done-projects">
          <span className="col2__subject-span">완성한 프로젝트</span>
        </div>
        <hr className="hr__line" />
        <div className="col2__registered-projects">
          <span className="col2__subject-span">참여 신청중인 프로젝트</span>
        </div>
        <hr className="hr__line" />
        <div className="col2__interested-projects">
          <span className="col2__subject-span">관심있는 프로젝트</span>
        </div>
      </div>
    </div>
  );
}
