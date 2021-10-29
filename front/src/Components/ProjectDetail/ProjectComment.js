import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import Pagination from "react-js-pagination";
import "../../SCSS/ProjectDetail/ProjectComment.scss";

export default function ProjectComment({
  projectId,
  loginState,
  setCommentCount,
  commentCount,
}) {
  const [commentList, setCommentList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [newComment, setNewComment] = useState("");

  const getCommentData = async () => {
    try {
      const {
        data: {
          comments: { rows: commentData, count },
        },
      } = await axios.get(
        `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/project/comments?projectId=${projectId}&page=${page}&pageSize=5`
      );

      setCommentList(commentData);
      setTotalPage(count);
    } catch (err) {
      console.log(err);
    }
  };

  const onDelete = (commentId, e) => {
    axios({
      method: "DELETE",
      url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/project/comments?commentId=${commentId}`,
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
        setCommentCount(commentCount - 1);
      })
      .catch((e) => console.log(e));
    e.preventDefault();
  };

  const onSubmit = (e) => {
    if (loginState === null) alert("로그인이 필요합니다.");
    else {
      axios({
        method: "POST",
        url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/project/comments?contentId=${projectId}`,
        headers: {
          Authorization: `Bearer ${loginState.accessToken}`,
        },
        data: {
          comment: newComment,
        },
      })
        .then((res) => {
          console.log(res);
          setCommentCount(commentCount + 1);
          setNewComment("");
        })
        .catch((e) => console.log(e));
      e.preventDefault();
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  useEffect(() => {
    getCommentData();
  }, [page, commentList]);

  const onChange = useCallback((e) => {
    setNewComment(e.target.value);
  }, []);

  return (
    <div className="body-comment">
      <div className="comment-row">
        <Icon icon="bi:chat-left-text" color="#565656" fontSize="1.5rem" />
        <div className="comment_text">응원 / 질문을 남겨주세요! </div>
      </div>
      <div className="comment_main">
        {commentList.length !== 0 ? (
          <>
            {commentList.map((el, key) => (
              <div className="comment-list" key={key}>
                <div className="comment-id">{el.profile.user.username}</div>
                <div className="comment-content">{el.comment}</div>
                {el.profile.id === loginState?.id && (
                  <Icon
                    icon="bx:bx-x"
                    color="#ff6864"
                    fontSize="1rem"
                    onClick={(e) => onDelete(el.id, e)}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </div>
            ))}
            <div className="comment_pagination">
              <Pagination
                hideFirstLastPages={true}
                activePage={page}
                itemsCountPerPage={5}
                totalItemsCount={totalPage}
                pageRangeDisplayed={4}
                prevPageText={
                  <Icon
                    icon="dashicons:arrow-left-alt2"
                    color="#e5e5e5"
                    height="1rem"
                  />
                }
                nextPageText={
                  <Icon
                    icon="dashicons:arrow-right-alt2"
                    color="#e5e5e5"
                    height="1rem"
                  />
                }
                onChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className="empty-comment">
            프로젝트에 첫 댓글을 남겨주세요 😃
          </div>
        )}
      </div>
      <form className="comment-input" onSubmit={onSubmit}>
        <textarea
          spellCheck="false"
          // type="textarea"
          className="comment_input"
          maxLength="50"
          placeholder="ex. 너무 좋은 프로젝트입니다."
          onChange={onChange}
          // onKeyPress={this.typeEnter}
          value={newComment}
        />
        <button type="submit">댓글 등록</button>
      </form>
    </div>
  );
}
