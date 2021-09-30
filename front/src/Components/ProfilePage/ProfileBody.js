import React from "react";
import { Icon } from "@iconify/react";
import "../../SCSS/ProfilePage/ProfileBody.scss";
import { useSelector } from "react-redux";
// import Cards from "../MainPage/Cards";
export default function ProfileBody() {
  // let userState = useSelector((state) => state.userReducer);
  let loginState = useSelector((state) => state.loginReducer);

  return (
    <div className="profileBody">
      <div className="profileBody__col1">
        <div className="col1__profile-card1">
          <div className="card1__job">
            <div className="job__label">포지션</div>
            <div className="job__content">프론트엔드</div>
          </div>
          <div className="card1__skill">
            <div className="skill__label">보유 스킬</div>
            <div className="skill__content">
              <img
                alt="badge1"
                src="https://img.shields.io/badge/HTML-E34F26?style=flat-square&logo=HTML5&logoColor=white"
              />
              <img
                alt="badge2"
                src="https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=CSS3&logoColor=white"
              />
              <img
                alt="badge3"
                src="https://img.shields.io/badge/Javascript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"
              />
              <img
                alt="badge1"
                src="https://img.shields.io/badge/HTML-E34F26?style=flat-square&logo=HTML5&logoColor=white"
              />
              <img
                alt="badge2"
                src="https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=CSS3&logoColor=white"
              />
              <img
                alt="badge3"
                src="https://img.shields.io/badge/Javascript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"
              />
            </div>
          </div>
        </div>
        <div className="col1__profile-card2">
          <div className="card2__location">
            <Icon icon="carbon:location-filled" height="25px" />
            <span>{loginState.location}</span>
          </div>
          <div className="card2__level">
            <Icon icon="simple-icons:42" width="25px" />
            <span>{`level ${loginState.level}`}</span>
          </div>
          <div className="card2__email">
            <Icon icon="fluent:mail-48-filled" height="25px" />
            <a href={`mailto:${loginState.email}`} className="email-span">
              {loginState.email}
            </a>
          </div>
          <div className="card2__github">
            <Icon icon="akar-icons:github-fill" height="22px" />
            <a
              href="https://github.com/Jiyong95"
              target="_blank"
              className="github-span">
              Jiyong95
            </a>
          </div>
        </div>
      </div>
      <div className="profileBody__col2">
        <div className="col2__ongoing-projects">
          <span className="col2__subject-span">진행중인 프로젝트</span>
          <span>없음</span>
        </div>
        <hr className="hr__line" />
        <div className="col2__done-projects">
          <span className="col2__subject-span">완료한 프로젝트</span>
          <span>없음</span>
        </div>
        <hr className="hr__line" />
        <div className="col2__registered-projects">
          <span className="col2__subject-span">참여 신청중인 프로젝트</span>
          <span>없음</span>
        </div>
        <hr className="hr__line" />
        <div className="col2__interested-projects">
          <span className="col2__subject-span">관심있는 프로젝트</span>
          <span>없음</span>
          <div className="interested__cards">
            {/* <Cards />
            <Cards />
            <Cards /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
