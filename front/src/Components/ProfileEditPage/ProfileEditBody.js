import React from "react";
import { Icon } from "@iconify/react";
import "../../SCSS/ProfilePage/ProfileBody.scss";
import { useSelector } from "react-redux";
import skills from "../../skills.json";
// import Cards from "../MainPage/Cards";

export default function ProfileEditBody() {
  // let userState = useSelector((state) => state.userReducer);
  let loginState = useSelector((state) => state.loginReducer);

  return (
    <div className="profileBody">
      <div className="profileBody__col1">
        <div className="col1__profile-card1">
          <div className="card1__job">
            <div className="job__label">포지션</div>
            <select id="job_select" className="job__content">
              <option value="프론트엔드">프론트엔드</option>
              <option value="백엔드">백엔드</option>
              <option value="iOS">iOS</option>
            </select>
          </div>
          <div className="card1__skill">
            <div className="skill__label">보유 스킬</div>
            <input
              className="skill__content"
              list="tech-stacks"
              placeholder="스킬을 검색해 추가해보세요"
            />
            <datalist id="tech-stacks">
              {skills.skills.map((e) => {
                return <option value={e[0]} />;
              })}
            </datalist>
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
            <span className="email-span">{loginState.email}</span>
          </div>
          <div className="card2__github">
            <Icon icon="akar-icons:github-fill" height="22px" />
            <input
              spellCheck="false"
              type="text"
              className="github-span"
              maxLength="15"
              placeholder="깃허브 user name"
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
