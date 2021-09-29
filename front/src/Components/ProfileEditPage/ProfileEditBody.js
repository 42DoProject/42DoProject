import React from "react";
import { Icon } from "@iconify/react";
import "../../SCSS/ProfilePage/ProfileBody.scss";
import { useSelector } from "react-redux";
// import Cards from "../MainPage/Cards";

export default function ProfileEditBody() {
  // let userState = useSelector((state) => state.userReducer);
  let loginState = useSelector((state) => state.loginReducer);

  return (
    <div className="profileBody">
      <div className="profileBody__col1">
        <div className="col1__profile-card1">
          <div className="card1__column1">
            <div className="column1__job">직업</div>
            <div className="column1__level">레벨</div>
            <div className="column1__skill">보유 스킬</div>
          </div>
          <div className="card1__column2">
            <select className="column2__job">
              <option value="프론트엔드">프론트엔드</option>
              <option value="백엔드">백엔드</option>
              <option value="iOS">iOS</option>
            </select>
            <select className="column2__level">
              <option value="초보">초보</option>
              <option value="중수">중수</option>
              <option value="고수">고수</option>
            </select>
            <input className="column2__skill" list="programming-languages" />
            <datalist id="programming-languages">
              <option value="HTML" />
              <option value="CSS" />
              <option value="Javascript" />
              <option value="Java" />
              <option value="Spring" />
            </datalist>
            {/* <div className="column2__skill">
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
            </div> */}
          </div>
        </div>
        <div className="col1__profile-card2">
          <div className="card2__location">
            <Icon icon="carbon:location-filled" height="25px" />
            {/* <span>{loginState.location}</span> */}
            <span>location</span>
          </div>
          <div className="card2__email">
            <Icon icon="fluent:mail-48-filled" height="25px" />
            {/* <span className="email-span">{loginState.email}</span> */}
            <span className="email-span">email</span>
          </div>
          <div className="card2__github">
            <Icon icon="akar-icons:github-fill" height="22px" />
            <input
              spellCheck="false"
              type="text"
              className="github-span"
              maxlength="15"
            />
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
