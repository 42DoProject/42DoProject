import React, { useEffect, useState } from "react";
import "../../SCSS/LoungePage/LoungeBody.scss";
import { Link } from "react-router-dom";
import LoungePost from "./LoungePost";
import LoungeWrite from "./LoungeWrite";
import { useSelector } from "react-redux";
import defaultImg from "../../default_intra.png";
import axios from "axios";
import { useHistory } from "react-router";
import socket from "../../socket";

export default function LoungeBody({
  status,
  loungeData,
  refreshFlag,
  setRefreshFlag,
}) {
  let loginState = useSelector((state) => state.loginReducer);
  const [concurrents, setConcurrents] = useState([]);
  const history = useHistory();

  const getConcurrent = async () => {
    try {
      const { data } = await axios.get(
        `https://${process.env.REACT_APP_BACKEND_DOMAIN}/user/concurrent`
      );
      setConcurrents(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getConcurrent();
    socket.on("concurrent:connect", () => {
      getConcurrent();
    });
    socket.on("concurrent:disconnect", () => {
      getConcurrent();
    });
    return () => {
      socket.off("concurrent:connect");
      socket.off("concurrent:disconnect");
    };
  }, []);

  console.log("loungeData", loungeData);

  return (
    <div className="lounge-body">
      <div className="lounge-left">
        <div className="left-bar">
          {status === "base" ? (
            <>
              <div className="left-bar__lounge">라운지</div>
              <div className="left-bar__best">
                <Link to="/lounge/popular">인기글</Link>
              </div>
            </>
          ) : (
            <>
              <div className="left-bar__lounge">
                <Link to="/lounge">라운지</Link>
              </div>
              <div className="left-bar__best-color">인기글</div>
            </>
          )}
        </div>
        <div className="left__posts">
          {status === "base" && (
            <LoungeWrite
              refreshFlag={refreshFlag}
              setRefreshFlag={setRefreshFlag}
            />
          )}
          {loungeData === null ||
            (loungeData?.length === 0 && (
              <div className="lounge-noPost">
                라운지에 첫 글을 남겨주세요 😄
              </div>
            ))}
          {loungeData?.map((e, idx) => (
            <LoungePost
              key={e.id}
              loungeData={e}
              refreshFlag={refreshFlag}
              setRefreshFlag={setRefreshFlag}
            />
          ))}
        </div>
      </div>
      <div className="lounge-right">
        <div className="right-bar">
          접속중인 카뎃{" "}
          <span className="right-num">{concurrents?.length}명</span>
        </div>
        <div className="right__connected-wrap">
          {concurrents?.length === 0 ? (
            <div className="connected__noCadet">접속중인 카뎃이 없어요</div>
          ) : (
            <>
              <div className="right__connected">
                {concurrents?.map((v, i) => {
                  return (
                    <div
                      className="connected__cadet"
                      key={i}
                      onClick={() => {
                        history.push(`/profile/${v.userId}`);
                      }}
                    >
                      <img
                        className="connected__img"
                        src={v.profileImage || defaultImg}
                        alt="connected__img"
                      ></img>
                      <div className="connected__name">{v.username}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
