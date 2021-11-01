import React, { useEffect, useState } from "react";
import "../../SCSS/MainPage/Cadet.scss";
import CadetCards from "./CadetCards";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Cadet() {
  const [cadets, setCadets] = useState([]);

  const getData = async () => {
    try {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/user/cadet`
      );
      setCadets(data);
      console.log("cadets", cadets);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="cadet">
      <Link className="cadet__title" to="/cadet/recruit">
        프로젝트를 찾고있는 카뎃
      </Link>
      <div className="cadet__list">
        {cadets.map((v, i) => {
          return <CadetCards cadetData={v} key={v.id} />;
        })}
      </div>
    </div>
  );
}
