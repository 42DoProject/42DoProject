import React from "react";
import { Icon } from "@iconify/react";
import "../../SCSS/MainPage/Dashboard.scss";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard__background">
        <div className="dashboard__wrap">
          <div className="row1">
            <div className="row1__user">
              <Icon className="user__image" icon="bi:person-circle" />
              <div className="user__name">seojeong</div>
              <div className="user__level">lv4</div>
            </div>
            <div className="row1__button">
              <Icon icon="akar-icons:edit" />
              <Icon icon="ri:user-follow-fill" />
              <Icon icon="simpole-icons:42" />
            <div className="box1__column2">
              <div className="column2__job">프론트엔드</div>
              <div className="column2__level">초보</div>
              <div className="column2__skill">
                <img alt="badge1" src="https://img.shields.io/badge/HTML-E34F26?style=flat-square&logo=HTML5&logoColor=white" />
                <img alt="badge2" src="https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=CSS3&logoColor=white" />
                <img alt="badge3" src="https://img.shields.io/badge/Javascript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white" />
              </div>
            </div>
          </div>
          <div className="row2">
            <div className="row2__box1">
              <div className="box1__column1">
                <div className="column1__job">직업</div>
                <div className="column1__level">레벨</div>
                <div className="column1__skill">보유 스킬</div>
              </div>
              <div className="box1__column2">
                <div className="column2__job">프론트엔드</div>
                <div className="column2__level">초보</div>
                <div className="column2__skill">
                  <img src="https://img.shields.io/badge/HTML-E34F26?style=flat-square&logo=HTML5&logoColor=white" />
                  <img src="https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=CSS3&logoColor=white" />
                  <img src="https://img.shields.io/badge/Javascript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white" />
                </div>
              </div>
            </div>
            <div className="row2__box2">
              <div className="box2__title">진행중인 프로젝트</div>
              <div className="box2__slides">-</div>
            </div>
            <div className="row2__box3">
              <div className="box3__title">관심있는 프로젝트</div>
              <div className="box3__slides">-</div>
            </div>
          </div>
          <div className="row3">
            <div className="row3__reportbox">
              <div className="reportbox__report">
                42개의 프로젝트가 진행중이고 142개의 프로젝트가 완료되었어요
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
