import React from "react";
import { Icon } from "@iconify/react";
import "../../SCSS/ProfilePage/ProfileBody.scss";
import skills from "../../skills.json";
import { positions } from "../../userData";
import ProgressSlide from "../MainPage/ProgressSlide";

export default function ProfileBody(props) {
  // let userState = useSelector((state) => state.userReducer);
  // let loginState = useSelector((state) => state.loginReducer);

  return (
    <div className="profileBody">
      <div className="profileBody__col1">
        <div className="col1__profile-card1">
          <div className="card1__job">
            <div className="job__label">포지션</div>
            <div className="job__content">
              {positions[+props.user.position]}
            </div>
          </div>
          <div className="card1__skill">
            <div className="skill__label">보유 스킬</div>
            <div className="skill__content">
              {props.user.skill && props.user.skill.length
                ? props.user.skill.map((e, i) => {
                    return (
                      <img
                        key={i}
                        alt={skills.skills[e][0]}
                        src={skills.skills[e][1]}
                      />
                    );
                  })
                : "-"}
            </div>
          </div>
        </div>
        <div className="col1__profile-card2">
          <div className="card2__location">
            <Icon icon="carbon:location-filled" height="25px" />
            <span>{props.user.location}</span>
          </div>
          <div className="card2__level">
            <Icon icon="simple-icons:42" width="25px" />
            <span>{`level ${Math.floor(props.user.level)}`}</span>
          </div>
          <div className="card2__email">
            <Icon icon="fluent:mail-48-filled" height="25px" />
            <a href={`mailto:${props.user.email}`} className="email-span">
              {props.user.email}
            </a>
          </div>
          <div className="card2__github">
            <Icon icon="akar-icons:github-fill" height="22px" />
            {props.user.github ? (
              <a
                href={`https://github.com/${props.user.github}`}
                target="_blank"
                rel="noreferrer noopener"
                className="github-span">
                {props.user.github}
              </a>
            ) : (
              <span className="github-span" style={{ color: "#565656" }}>
                -
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="profileBody__col2">
        <div className="col2__ongoing-projects">
          <span className="col2__subject-span">진행중인 프로젝트</span>
          <span>없음</span>
          <div className="projects__list">
            <ProgressSlide />
            <ProgressSlide />
          </div>
        </div>
        <hr className="hr__line" />
        <div className="col2__done-projects">
          <span className="col2__subject-span">완료한 프로젝트</span>
          <span>없음</span>
          <div className="projects__list">
            <ProgressSlide />
            <ProgressSlide />
          </div>
        </div>
        {props.location.pathname === "/profile" ? (
          <>
            <hr className="hr__line" />
            <div className="col2__registered-projects">
              <span className="col2__subject-span">참여 신청중인 프로젝트</span>
              <span>없음</span>
            </div>
            <hr className="hr__line" />
            <div className="col2__interested-projects">
              <span className="col2__subject-span">관심있는 프로젝트</span>
              <span>없음</span>
              <div className="projects__list">
                <ProgressSlide />
                <ProgressSlide />
                <ProgressSlide />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
