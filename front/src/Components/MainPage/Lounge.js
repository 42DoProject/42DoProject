import React, { useEffect, useState } from "react";
import "../../SCSS/MainPage/Lounge.scss";
import { useHistory } from "react-router";
import axios from "axios";
import relativeTime from "../../relativeTime";
import defaultImg from "../../default_intra.png";
import { useSelector } from "react-redux";

export default function Lounge() {
  const [data, setData] = useState();
  const history = useHistory();
  const loginState = useSelector((state) => state.loginReducer);
  useEffect(() => {
    const getData = async () => {
      try {
        const {
          data: { rows },
        } = await axios.get(
          `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/lounge?page=1&pageSize=3`,
          {
            headers: {
              Authorization: `Bearer ${loginState?.accessToken}`,
            },
          }
        );
        // console.log("rows", rows);
        setData(rows);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  return (
    <div className="lounge">
      <div className="lounge__title" onClick={() => history.push("/lounge")}>
        라운지
      </div>
      {data?.length === 0 ? (
        <div className="lounge__no-lounge">라운지 글이 없어요</div>
      ) : (
        <div className="lounge__list">
          {data?.map((e, idx) => (
            <div
              className="lounge__card"
              key={idx}
              onClick={() => {
                history.push("/lounge");
              }}>
              <div className="card__row1">
                <img
                  className="row1__image"
                  src={e.image || defaultImg}
                  alt="profile_img"
                />
                <div className="row1__right">
                  <div className="row1__name">{e.username || defaultImg}</div>
                  <div className="row1__time">
                    {relativeTime(new Date(e.createdAt).getTime())}
                  </div>
                </div>
              </div>
              <div className="card__row2">
                <div className="row2__chat">
                  {e.comment.length > 69
                    ? e.comment.slice(0, 68) + "..."
                    : e.comment}
                </div>
              </div>
              <div className="card__row3">
                <span className="like">좋아요</span>
                <span className="like-num">{` ${e.like}`}</span>
                <span className="comment">댓글</span>
                <span className="comment-num">{` ${e.replyCount}`}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
