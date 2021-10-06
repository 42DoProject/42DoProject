import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import "../../SCSS/MainPage/Dashboard.scss";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProgressSlide from "./ProgressSlide";
import FavoriteSlide from "./FavoriteSlide";
import axios from "axios";
import { positions } from "../../userData";
import { skills } from "../../skills.json";
export default function Dashboard(props) {
  // let userState = useSelector((store) => store.userReducer);
  let loginState = useSelector((state) => state.loginReducer);
  let [userData, setUserData] = useState(null);
  const getData = async () => {
    try {
      let ACCESS_TOKEN = localStorage.getItem("accessToken");
      const { data } = await axios.get("http://localhost:5000/user/me", {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
      setUserData(data);
      // console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  // console.log(userData);
  return (
    <div className="dashboard">
      <div className="dashboard__wrap">
        <div className="dashboard__background">
          <div className="row1">
            <div className="row1__user">
              {loginState === null ? (
                <Icon className="user__image" icon="bi:person-circle" />
              ) : (
                <img
                  className="IntraImage"
                  src={loginState.profileImage}
                  alt="intraImage"
                />
              )}

              <div className="user__name">
                {loginState === null ? "guest" : loginState.name}
              </div>
            </div>
            {loginState && (
              <div className="row1__button">
                <Link className="icon__link" to="/profile/edit">
                  <Icon icon="akar-icons:edit" />
                </Link>
              </div>
            )}
          </div>
          <div className="row2">
            <div className="row2__box1">
              <div className="box1__column1">
                <div className="column1__job">포지션</div>
                <div className="column1__skill">보유 스킬</div>
              </div>
              <div className="box1__column2">
                <div className="column2__job">
                  {userData && positions[+userData.position]}
                </div>
                <div className="column2__skill">
                  {userData &&
                    userData.skill.map((e, idx) => {
                      return (
                        <img key={idx} src={skills[e][1]} alt={skills[e][0]} />
                      );
                    })}
                </div>
              </div>
            </div>
            <div className="row2__box2">
              <div className="box2__title">진행중인 프로젝트</div>
              <div className="box2__slides">
                {loginState === null ? null : <ProgressSlide />}
              </div>
            </div>
            <div className="row2__box3">
              <div className="box3__title">관심있는 프로젝트</div>
              <div className="box3__slides">
                {loginState === null ? null : <FavoriteSlide />}
              </div>
            </div>
          </div>
          <div className="row3">
            <div className="row3__reportbox">
              <div className="reportbox__report">
                <Link
                  className="dashboard__project__link1"
                  to="/project/proceed">
                  {props.progressPr}
                </Link>
                개의 프로젝트가{" "}
                <Link
                  className="dashboard__project__link2"
                  to="/project/proceed">
                  진행중
                </Link>
                이고{" "}
                <Link
                  className="dashboard__project__link3"
                  to="/project/complete">
                  {props.finishPr}
                </Link>
                개의 프로젝트가{" "}
                <Link
                  className="dashboard__project__link4"
                  to="/project/complete">
                  완료
                </Link>
                되었어요
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
