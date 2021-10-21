import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import Pagination from "react-js-pagination";
import "../../SCSS/ProjectDetail/ProjectComment.scss";

export default function ProjectComment({ projectId }) {
  const [commentList, setCommentList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [newComment, setNewComment] = useState("");

  const getData = async () => {
    try {
      const {
        data: {
          comments: { rows: commentData, count },
        },
      } = await axios.get(
        `http://localhost:5000/project/comments?projectId=${projectId}&page=${page}&pageSize=5`
      );

      setCommentList(commentData);
      setTotalPage(count);
    } catch (err) {
      console.log(err);
    }
  };

  const onDelete = (commentId, e) => {
    console.log(commentId);
    axios({
      method: "DELETE",
      url: `http://localhost:5000/project/comments?commentId=${commentId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e));
    // e.preventDefault();
  };

  const onSubmit = (e) => {
    console.log("submit");
    axios({
      method: "POST",
      url: `http://localhost:5000/project/comments?contentId=${projectId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      data: {
        comment: newComment,
      },
    })
      .then((res) => {
        console.log(res);
        setNewComment("");
      })
      .catch((e) => console.log(e));
    e.preventDefault();
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  useEffect(() => {
    getData();
  }, [page, commentList]);

  const onChange = useCallback((e) => {
    setNewComment(e.target.value);
  }, []);

  return (
    <div className="body-comment">
      <div className="comment-row">
        <Icon icon="bi:chat-left-text" color="#565656" height="25" />
        <div className="comment_text">응원 / 질문을 남겨주세요! </div>
      </div>
      {commentList &&
        commentList.map((el, key) => (
          <div className="comment-list">
            <div className="comment-id">{el.profile.user.username}</div>
            <div className="comment-content">{el.comment}</div>
            {el.profile.id === 1 && (
              <Icon
                icon="bx:bx-x"
                color="#ff6864"
                height="18"
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
      <form className="comment-input" onSubmit={onSubmit}>
        <input
          spellCheck="false"
          type="text"
          className="comment_input"
          maxLength="50"
          placeholder="ex. 너무 좋은 프로젝트입니다."
          onChange={onChange}
          // onKeyPress={this.typeEnter}
          value={newComment}
        />
        <button type="submit">등록</button>
      </form>
    </div>
  );
}
