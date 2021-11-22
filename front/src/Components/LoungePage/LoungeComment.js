import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../SCSS/LoungePage/LoungeComment.scss";
import { useSelector } from "react-redux";

export default function LoungeComment({
  loungeData,
  refreshFlag,
  setRefreshFlag,
}) {
  const loginState = useSelector((state) => state.loginReducer);
  const [replies, setReplies] = useState([]);
  const [replyRefresh, setReplyRefresh] = useState(0);

  useEffect(() => {
    const getReply = async () => {
      try {
        const {
          data: { count, rows },
        } = await axios({
          method: "GET",
          url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/lounge/reply/${loungeData.id}?page=1&pageSize=10
        `,
        });
        // console.log("rows", rows);
        setReplies(rows);
      } catch (err) {
        console.log(err);
      }
    };
    getReply();
  }, [replyRefresh]);

  const postReply = async () => {
    try {
      await axios({
        method: "POST",
        url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/lounge/reply/${loungeData.id}`,
        headers: {
          Authorization: `Bearer ${loginState.accessToken}`,
        },
        data: { comment: document.querySelector(".comment__input").value },
      });
      document.querySelector(".comment__input").value = "";
      replyRefresh ? setReplyRefresh(0) : setReplyRefresh(1);
      refreshFlag ? setRefreshFlag(0) : setRefreshFlag(1);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="comment-wrap">
      {replies?.map((e, i) => {
        return (
          <div className="comment-element" key={i}>
            <div className="comment-profile">
              <img className="comment-img" src={e.image} />
              <div>{e.username}</div>
            </div>
            <div className="comment-content">{e.comment}</div>
          </div>
        );
      })}
      <div className="comment__write">
        <input
          className="comment__input"
          spellCheck="false"
          placeholder="댓글을 작성해 보세요"></input>
        <button
          onClick={() => {
            document.querySelector(".comment__input").value !== "" &&
              postReply();
          }}>
          댓글 등록
        </button>
      </div>
    </div>
  );
}
