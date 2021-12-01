import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import Pagination from "react-js-pagination";
import "../../SCSS/ProjectDetail/ProjectComment.scss";
import relativeTime from "../../relativeTime";
import Modal from "../ProjectEditPage/Modal";

export default function ProjectComment({
  projectId,
  loginState,
  setCommentCount,
  commentCount,
}) {
  const [commentList, setCommentList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [newComment, setNewComment] = useState("");
  const [editComment, setEditComment] = useState("");
  const [isChange, setIsChange] = useState(0);
  const [editable, setEditable] = useState(-1);
  const [openModal, setOpenModal] = useState(false);
  const itemPerPage = 10;

  useEffect(() => {
    getCommentData();
    setIsChange(0);
  }, [isChange, page]);

  //TODO:버튼을 다시 클릭한 경우는 현재 수정이 안됨. 엔터를 입력한 경우만 수정됨.
  const onEdit = (e, elm, key) => {
    setEditComment(elm.comment);
    if (editable === key) {
      setEditable(-1);
    } else {
      setEditable(key);
    }
  };

  const handleKeyDown = (e, elm) => {
    if (e.key === "Enter") {
      onEditComment(e, elm.id);
      setEditable(-1);
    }
  };

  const getCommentData = async () => {
    try {
      const {
        data: {
          comments: { rows: commentData, count },
        },
      } = await axios.get(
        `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project/comments?projectId=${projectId}&page=${page}&pageSize=${itemPerPage}`
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
      url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project/comments?commentId=${commentId}`,
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
        setCommentCount(commentCount - 1);
        setIsChange(1);
        setEditable(-1);
        //댓글 지울때 해당 댓글이 마지막일 경우 잔 페이지로 이동 처리.
        //TODO:비어있다고 표시될때 있음.
        setPage(Math.ceil((totalPage - 1) / itemPerPage));
      })
      .catch((e) => console.log(e));
    e.preventDefault();
  };

  const onSubmit = (e) => {
    if (loginState === null) setOpenModal(true);
    else {
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project/comments?contentId=${projectId}`,
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
          setEditable(-1);

          //새로 댓글달때 해당 댓글이 있는 마지막 페이지로 이동 처리.
          //TODO:11번째 댓글이 바로 렌더링되지않음.
          console.log(Math.ceil((totalPage + 1) / itemPerPage));
          console.log((totalPage + 1) / itemPerPage);
          setPage(Math.ceil((totalPage + 1) / itemPerPage));
          setIsChange(1);
        })
        .catch((e) => console.log(e));
      // e.preventDefault();
    }
  };

  const onEditComment = (e, commentId) => {
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project/comments?commentId=${commentId}`,
      headers: {
        Authorization: `Bearer ${loginState.accessToken}`,
      },
      data: {
        comment: editComment,
      },
    })
      .then((res) => {
        console.log(res);
        setIsChange(1);
        setEditComment("");
      })
      .catch((e) => console.log(e));
    e.preventDefault();
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const onEditChange = useCallback((e) => {
    setEditComment(e.target.value);
  }, []);
  const onChange = useCallback((e) => {
    setNewComment(e.target.value);
  }, []);

  console.log("commentList", commentList);

  return (
    <div className="body-comment">
      {openModal && (
        <Modal
          body="로그인해 주세요"
          buttons={["확인"]}
          cancelFunc={() => setOpenModal(false)}
        />
      )}
      <div className="comment-row">
        <Icon icon="bi:chat-left-text" color="#565656" fontSize="1.5rem" />
        <div className="comment_text">댓글</div>
      </div>
      <div className="comment_main">
        {commentList.length !== 0 ? (
          <>
            {commentList.map((elm, key) => (
              <div className="comment-list" key={key}>
                <div className="comment-id">{elm.profile.user.username}</div>
                <div className="comment-right">
                  {editable === key ? (
                    <textarea
                      // type="text"
                      // rows="8"
                      spellCheck="false"
                      value={editComment}
                      onChange={(e) => {
                        onEditChange(e);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, elm)}
                    />
                  ) : (
                    <pre className="comment-content">{elm.comment}</pre>
                  )}
                  <div className="comment-icons">
                    <span className="comment-time">
                      {relativeTime(new Date(elm.createdAt).getTime())}
                    </span>
                    {elm.profile.id === loginState?.id && (
                      <>
                        <Icon
                          icon="clarity:edit-solid"
                          onClick={(e) => onEdit(e, elm, key)}
                          style={{ cursor: "pointer" }}
                        />
                        <Icon
                          icon="icomoon-free:bin"
                          onClick={(e) => onDelete(elm.id, e)}
                          style={{ cursor: "pointer" }}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="comment_pagination">
              <Pagination
                hideFirstLastPages={true}
                activePage={page}
                itemsCountPerPage={itemPerPage}
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
      <div className="comment-input">
        <textarea
          spellCheck="false"
          className="comment_input"
          maxLength="500"
          placeholder="응원 / 질문을 남겨주세요!"
          onChange={onChange}
          // onKeyPress={this.typeEnter}
          value={newComment}
        />
        <button
          onClick={() => {
            if (document.querySelector("textarea.comment_input").value !== "")
              onSubmit();
          }}>
          댓글 등록
        </button>
      </div>
    </div>
  );
}
