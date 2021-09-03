import React from "react";
// import { Icon } from "@iconify/react";
import "../../SCSS/ProfilePage/ProfileBody.scss";

export default function ProfileBody() {
  return (
    <div className="profileBody">
      <div className="profileBody__row1">
        <div className="row1__profile-card1">
          <div className="card1__column1">
            <div className="column1__job">직업</div>
            <div className="column1__level">레벨</div>
            <div className="column1__skill">보유 스킬</div>
          </div>
          <div className="card1__column2">
            <div className="column2__job">프론트엔드</div>
            <div className="column2__level">초보</div>
            <div className="column2__skill">
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
        <div className="row1__profile-card2"></div>
      </div>
    </div>
  );
}
