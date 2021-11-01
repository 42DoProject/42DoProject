import React, { useEffect, useState } from "react";
import "../../SCSS/LoungePage/LoungeBody.scss";
import { Link } from "react-router-dom";
import LoungePost from "./LoungePost";
import LoungeWrite from "./LoungeWrite";
import { useSelector } from "react-redux";
import defaultImg from "../../default_intra.png";
import axios from "axios";
import { useHistory } from "react-router";

export default function LoungeBody() {
  let loginState = useSelector((state) => state.loginReducer);
  const [concurrents, setConcurrents] = useState([]);
  const history = useHistory();

  const getConcurrent = async () => {
    try {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/user/concurrent`
      );
      setConcurrents(data);
      console.log("data", data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getConcurrent();
  }, []);

  return (
    <div className="lounge-body">
      <div className="lounge-left">
        <div className="left-bar">
          <div className="left-bar__lounge">라운지</div>
          <div className="left-bar__best">
            <Link to="/lounge">인기글</Link>
          </div>
        </div>
        <div className="left__posts">
          {loginState !== null ? <LoungeWrite /> : <LoungePost />}
          <LoungePost />
          <LoungePost />
          <LoungePost />
        </div>
      </div>
      <div className="lounge-right">
        <div className="right-bar">
          접속중인 카뎃{" "}
          <span className="right-num">{concurrents?.length}명</span>
        </div>
        <div className="right__connected-wrap">
          <div className="right__connected">
            {concurrents?.map((v, i) => {
              return (
                <div
                  className="connected__cadet"
                  key={i}
                  onClick={() => {
                    history.push(`/profile/${v.userId}`);
                  }}>
                  <img
                    className="connected__img"
                    src={v.profileImage || defaultImg}
                    alt="connected__img"></img>
                  <div className="connected__name">{v.username}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
