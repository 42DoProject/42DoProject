import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../SCSS/LoungePage/LoungeComment.scss";
import { useSelector } from "react-redux";
import relativeTime from "../../relativeTime";
import { Icon } from "@iconify/react";
import { useHistory } from "react-router";

export default function CommentElement({
  e,
  loungeData,
  replyRefresh,
  setReplyRefresh,
  refreshFlag,
  setRefreshFlag,
}) {
  const [onEdit, setOnEdit] = useState(false);
  const history = useHistory();
  const loginState = useSelector((state) => state.loginReducer);

  const editComment = async (replyid) => {
    try {
      await axios({
        method: "PUT",
        url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/lounge/reply/${replyid}`,
        headers: {
          Authorization: `Bearer ${loginState?.accessToken}`,
        },
        data: {
          comment: document.querySelector("input.comment-content").value,
        },
      });
      replyRefresh ? setReplyRefresh(0) : setReplyRefresh(1);
      setOnEdit(false);
    } catch (err) {
      console.log(err);
    }
  };
  const deleteComment = async (replyid) => {
    try {
      await axios({
        method: "DELETE",
        url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/lounge/reply/${replyid}`,
        headers: {
          Authorization: `Bearer ${loginState?.accessToken}`,
        },
      });
      replyRefresh ? setReplyRefresh(0) : setReplyRefresh(1);
      refreshFlag ? setRefreshFlag(0) : setRefreshFlag(1);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="comment-element" key={e.id}>
      <img
        className="comment-img"
        src={e.image}
        onClick={() => history.push(`/profile/${e.userid}`)}
      />
      <div className="comment-bubble">
        <div className="comment-username">
          <span onClick={() => history.push(`/profile/${e.userid}`)}>
            {e.username}
          </span>
          <span onClick={() => history.push(`/profile/${e.userid}`)}>
            {e.userid === loungeData.userid && "작성자"}
          </span>
        </div>
        {onEdit ? (
          <input
            className="comment-content"
            defaultValue={e.comment}
            spellCheck="false"></input>
        ) : (
          <div className="comment-content">{e.comment}</div>
        )}
        <div className="comment-icons">
          <span className="comment-time">
            {relativeTime(new Date(e.createdAt).getTime())}
          </span>
          {e.userid === loginState?.id && (
            <>
              {onEdit ? (
                <div className="comment__on-edit">
                  <div
                    onClick={() => editComment(e.id)}
                    style={{ cursor: "pointer" }}>
                    완료
                  </div>
                  <div
                    onClick={() => setOnEdit(false)}
                    style={{ cursor: "pointer" }}>
                    취소
                  </div>
                </div>
              ) : (
                <Icon
                  icon="clarity:edit-solid"
                  style={{ cursor: "pointer" }}
                  onClick={() => setOnEdit(true)}
                />
              )}
              <Icon
                icon="icomoon-free:bin"
                style={{ cursor: "pointer" }}
                onClick={() => deleteComment(e.id)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
