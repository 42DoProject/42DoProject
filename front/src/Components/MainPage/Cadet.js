import React, { useEffect, useState } from "react";
import "../../SCSS/MainPage/Cadet.scss";
import CadetCards from "./CadetCards";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReactLoading from "../CommonComponent/Loading";

export default function Cadet() {
  const [cadets, setCadets] = useState([]);
  const loginState = useSelector((state) => state.loginReducer);

  const getData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/user/cadet`,
        {
          headers: {
            Authorization: `Bearer ${loginState?.accessToken}`,
          },
        }
      );
      setCadets(data);
      // console.log("cadets", cadets);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return cadets === null ? (
    <div className="cadet">
      <Link className="cadet__title" to="/cadet/recruit">
        프로젝트를 찾고 있는 카뎃
      </Link>
      <ReactLoading type="spin" color="#a7bc5b" />
    </div>
  ) : (
    <>
      {cadets.length === 0 ? (
        <div className="cadet">
          <Link className="cadet__title" to="/cadet/recruit">
            프로젝트를 찾고 있는 카뎃
          </Link>
          <div className="noCadet">프로젝트를 찾고 있는 카뎃이 없어요</div>
        </div>
      ) : (
        <div className="cadet">
          <Link className="cadet__title" to="/cadet/recruit">
            프로젝트를 찾고 있는 카뎃
          </Link>
          <div className="cadet__list">
            {cadets.map((v, i) => {
              return <CadetCards cadetData={v} key={v.id} />;
            })}
          </div>
        </div>
      )}
    </>
  );
}
