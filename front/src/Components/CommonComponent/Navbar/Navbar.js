import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import "../../../SCSS/Common/Navbar/Navbar.scss";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Example as PopUp } from "../../MainPage/PopUp";
import Notifiaction from "./Notification";
import { Example as PopUp2 } from "./PopUp2";
import axios from "axios";
import UserCard from "./SearchCard";
import ProjectCard from "./ProjectCard";

export default function Navbar(props) {
  const [searchRes, setSearchRes] = useState([]);
  const loginState = useSelector((state) => state.loginReducer);

  const search = async (input) => {
    try {
      if (input.length) {
        const { data } = await axios.get(
          `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/search/${input}`,
          {
            headers: {
              Authorization: `Bearer ${loginState?.accessToken}`,
            },
          }
        );
        console.log("input", data);
        setSearchRes(data);
      } else setSearchRes([]);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="Nav">
      <div className="Nav-column1">
        <Link to="/">
          <div className="Nav__title">
            <Icon className="title-icon" icon="simple-icons:42" />
            <div className="title-text">DoProject</div>
          </div>
        </Link>
        <div className="Nav__input">
          <Icon className="input-icon" icon="fe:search" />
          <input
            placeholder="카뎃 닉네임, 프로젝트명 등을 검색해 보세요"
            spellCheck="false"
            onChange={(e) => search(e.target.value)}></input>
          {searchRes.length !== 0 && (
            <div className="input__res">
              <div className="res__user">
                <div className="res__title1">카뎃</div>
                {searchRes.user.map((e) => (
                  <UserCard
                    key={e.id}
                    name={e.username}
                    profile={e.profileImage}
                    id={e.id}
                    setSearchRes={setSearchRes}
                  />
                ))}
              </div>
              <div className="res__project">
                <div className="res__title2">프로젝트</div>
                {searchRes.project.map((e) => (
                  <ProjectCard
                    key={e.id}
                    title={e.title}
                    image={e.image}
                    id={e.id}
                    setSearchRes={setSearchRes}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="Nav-column2">
        <div className="Nav__project">
          <Link className="nav-color" to="/projectlist/recruit">
            프로젝트
          </Link>
        </div>
        <div className="Nav__cadet">
          <Link className="nav-color" to="/cadet/recruit">
            카뎃
          </Link>
        </div>
        <div className="Nav__lounge">
          <Link className="nav-color" to="/lounge">
            라운지
          </Link>
        </div>
        {loginState && <Notifiaction />}
        {loginState === null ? (
          <button className="Nav__user__login">
            <a
              className="login__link"
              href={`https://api.intra.42.fr/oauth/authorize?client_id=${process.env.REACT_APP_API_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_API_REDIRECT_URI}&response_type=code`}>
              SIGN IN
            </a>
          </button>
        ) : (
          <div className="Nav__user">
            <div className="Nav__user name">
              <PopUp />
            </div>
          </div>
        )}
        <div className="Nav__menu">
          <PopUp2 />
        </div>
      </div>
    </div>
  );
}
