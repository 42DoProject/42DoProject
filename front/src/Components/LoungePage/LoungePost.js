import React, { useEffect, useState } from "react";
import "../../SCSS/LoungePage/LoungePost.scss";
import { Icon } from "@iconify/react";
import defaultImg from "../../default_intra.png";
import relativeTime from "../../relativeTime";
import axios from "axios";
import { useSelector } from "react-redux";
import LoungeComment from "./LoungeComment";
import { useHistory } from "react-router";

export default function LoungePost({
  loungeData,
  refreshFlag,
  setRefreshFlag,
}) {
  const loginState = useSelector((state) => state.loginReducer);
  const history = useHistory();
  const [editFlag, setEditFlag] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [commentIcon, setCommentIcon] = useState("dashicons:arrow-down-alt2");

  const likeLounge = async () => {
    try {
      await axios({
        method: "POST",
        url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/lounge/like/${loungeData.id}`,
        headers: {
          Authorization: `Bearer ${loginState?.accessToken}`,
        },
      });
      refreshFlag ? setRefreshFlag(0) : setRefreshFlag(1);
    } catch (err) {
      console.log(err);
    }
  };
  const unlikeLounge = async () => {
    try {
      await axios({
        method: "DELETE",
        url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/lounge/unlike/${loungeData.id}`,
        headers: {
          Authorization: `Bearer ${loginState?.accessToken}`,
        },
      });
      refreshFlag ? setRefreshFlag(0) : setRefreshFlag(1);
    } catch (err) {
      console.log(err);
    }
  };
  const editPost = () => {
    setEditFlag(true);
  };
  const putPost = async () => {
    try {
      await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/lounge/${loungeData.id}`,
        headers: {
          Authorization: `Bearer ${loginState?.accessToken}`,
        },
        data: {
          comment: document.querySelector(".lounge-post__edit-space").value,
        },
      });
      refreshFlag ? setRefreshFlag(0) : setRefreshFlag(1);
      setEditFlag(false);
    } catch (err) {
      console.log(err);
    }
  };
  const deletePost = async () => {
    try {
      await axios({
        method: "DELETE",
        url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/lounge/${loungeData.id}`,
        headers: {
          Authorization: `Bearer ${loginState?.accessToken}`,
        },
      });
      refreshFlag ? setRefreshFlag(0) : setRefreshFlag(1);
    } catch (err) {
      console.log(err);
    }
  };
  const toggleComment = () => {
    if (openComment) {
      setOpenComment(false);
      setCommentIcon("dashicons:arrow-down-alt2");
    } else {
      setOpenComment(true);
      setCommentIcon("dashicons:arrow-up-alt2");
    }
  };

  console.log("loungeData", loungeData);

  return (
    <div className="lounge-post">
      <div className="lounge-post__row1">
        <div
          className="lounge-post__profile"
          onClick={() => history.push(`/profile/${loungeData.userid}`)}>
          <img
            className="profile__img"
            src={loungeData.image || defaultImg}
            alt="profile__img"></img>
          <div className="profile__name">{loungeData.username || "user"}</div>
        </div>
        <div className="lounge-post__time">
          {relativeTime(new Date(loungeData.createdAt).getTime())}
        </div>
      </div>
      {editFlag === false ? (
        <pre className="lounge-post__space">
          {loungeData.comment}{" "}
          {loungeData.createdAt !== loungeData.updatedAt && (
            <span className="post__edited">(edited)</span>
          )}
        </pre>
      ) : (
        <textarea
          className="lounge-post__edit-space"
          spellCheck="false"
          defaultValue={loungeData.comment}
          maxLength="800"></textarea>
      )}
      <div className="lounge-post__bottom">
        <button
          className="bottom__open-comments"
          onClick={() => toggleComment()}>
          {`댓글 ${loungeData.replyCount}개`}
          <Icon className="bottom__comment-icon" icon={commentIcon} />
        </button>
        <div className="bottom__info">
          {loungeData?.userid === loginState?.id && (
            <>
              {editFlag === false ? (
                <div className="bottom__edit" onClick={() => editPost()}>
                  수정
                </div>
              ) : (
                <div className="bottom__on-edit">
                  <div onClick={() => putPost()}>완료</div>
                  <div onClick={() => setEditFlag(false)}>취소</div>
                </div>
              )}
              <div className="bottom__delete" onClick={() => deletePost()}>
                삭제
              </div>
            </>
          )}
          <div className="bottom__like">
            {loungeData.checkLike === "true" ? (
              <div onClick={() => unlikeLounge()}>
                <Icon
                  className="bottom__like-icon-fill"
                  icon="ant-design:like-fill"
                />
                <span className="like-color">{loungeData.like}</span>
              </div>
            ) : (
              <div onClick={() => likeLounge()}>
                <Icon
                  className="bottom__like-icon"
                  icon="ant-design:like-outlined"
                />
                <span>{loungeData.like}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {openComment === true && (
        <LoungeComment
          loungeData={loungeData}
          refreshFlag={refreshFlag}
          setRefreshFlag={setRefreshFlag}
        />
      )}
    </div>
  );
}
