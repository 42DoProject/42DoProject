import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import "../../SCSS/MainPage/Dashboard.scss";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProgressSlide from "./ProgressSlide";
import FavoriteSlide from "./FavoriteSlide";
import axios from "axios";
import { positions } from "../../userData";
import skills from "../../skills.json";
import defaultImg from "../../default_intra.png";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function Dashboard(props) {
  const loginState = useSelector((state) => state.loginReducer);
  const [userData, setUserData] = useState();
  const [proceedingPrCnt, setProceedingPrCnt] = useState();
  let dispatch = useDispatch();

  const getData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/user/me`,
        {
          headers: {
            Authorization: `Bearer ${loginState.accessToken}`,
          },
        }
      );
      setUserData(data);
    } catch (err) {
      console.log(err);
      dispatch({ type: "LOGOUT" });
    }
  };

  const getProceedingPr = async () => {
    try {
      const {
        data: {
          project: { count },
        },
      } = await axios.get(
        `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project?state=proceeding`
      );
      setProceedingPrCnt(count);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getProceedingPr();
    if (loginState) getData();
  }, [loginState]);
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
                  src={loginState.profileImage || defaultImg}
                  alt="intraImage"
                />
              )}

              <div className="user__name">
                {loginState === null ? "guest" : loginState.name || "user"}
              </div>
            </div>
            {loginState && (
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id={`tooltip-bottom`}>프로필 수정</Tooltip>}>
                <div className="row1__button">
                  <Link className="icon__link" to="/profile/edit">
                    <Icon icon="akar-icons:edit" />
                  </Link>
                </div>
              </OverlayTrigger>
            )}
          </div>
          <div className="row2">
            <div className="row2__box1-wrap">
              <div className="row2__box1">
                <div className="box1__column1">
                  <div className="column1__job">포지션</div>
                  <div className="column1__skill">보유 스킬</div>
                </div>
                <div className="box1__column2">
                  <div className="column2__job">
                    {loginState && userData && positions[+userData.position]}
                  </div>
                  <div className="column2__skill">
                    {loginState &&
                      userData?.skill.length !== 0 &&
                      userData?.skill.map((e, idx) => {
                        return (
                          <img
                            key={idx}
                            src={skills[e][1]}
                            alt={skills[e][0]}
                          />
                        );
                      })}
                    {loginState && userData?.skill.length === 0 && (
                      <div className="not-skills"> - </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="row2__box2">
              <div className="box2__title">참여중인 프로젝트</div>
              <div className="box2__slides">
                {loginState && userData?.participatingProject.length ? (
                  <ProgressSlide projectData={userData?.participatingProject} />
                ) : (
                  <div className="not-project">-</div>
                )}
              </div>
            </div>
            <div className="row2__box3">
              <div className="box3__title">관심있는 프로젝트</div>
              <div className="box3__slides">
                {loginState && userData?.interestedProject.length ? (
                  <FavoriteSlide projectData={userData?.interestedProject} />
                ) : (
                  <div className="not-project">-</div>
                )}
              </div>
            </div>
          </div>
          <div className="row3">
            <div className="row3__reportbox">
              <div className="reportbox__report">
                현재{" "}
                <Link
                  className="dashboard__project__link1"
                  to="/projectlist/recruit">
                  {props.progressPr}
                </Link>
                개의{" "}
                <Link
                  className="dashboard__project__link2"
                  to="/projectlist/recruit">
                  모집중
                </Link>{" "}
                ∙{" "}
                <Link
                  className="dashboard__project__link3"
                  to="/projectlist/proceed">
                  {proceedingPrCnt || "0"}
                </Link>
                개의{" "}
                <Link
                  className="dashboard__project__link4"
                  to="/projectlist/proceed">
                  진행중
                </Link>{" "}
                ∙{" "}
                <Link
                  className="dashboard__project__link5"
                  to="/projectlist/complete">
                  {props.finishPr}
                </Link>
                개의{" "}
                <Link
                  className="dashboard__project__link6"
                  to="/projectlist/complete">
                  완성된{" "}
                </Link>
                프로젝트가 있어요
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
