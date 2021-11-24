import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../SCSS/LoungePage/LoungeComment.scss";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import Pagination from "react-js-pagination";
import relativeTime from "../../relativeTime";

export default function LoungeComment({
  loungeData,
  refreshFlag,
  setRefreshFlag,
}) {
  const loginState = useSelector((state) => state.loginReducer);
  const [replies, setReplies] = useState([]);
  const [replyRefresh, setReplyRefresh] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const itemPerPage = 10;
  const [onEdit, setOnEdit] = useState(false);

  const handlePageChange = (page) => {
    setPage(page);
  };

  useEffect(() => {
    const getReply = async () => {
      try {
        const {
          data: { count, rows },
        } = await axios({
          method: "GET",
          url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/lounge/reply/${loungeData.id}?page=${page}&pageSize=${itemPerPage}
        `,
          headers: {
            Authorization: `Bearer ${loginState?.accessToken}`,
          },
        });
        setTotalPage(count);
        console.log("rows", rows);
        setReplies(rows);
      } catch (err) {
        console.log(err);
      }
    };
    getReply();
  }, [replyRefresh, page]);

  const postReply = async () => {
    try {
      await axios({
        method: "POST",
        url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/lounge/reply/${loungeData.id}`,
        headers: {
          Authorization: `Bearer ${loginState?.accessToken}`,
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

  const editComment = async (reply) => {
    try {
      await axios({
        method: "PUT",
        url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/lounge/reply/${reply.id}`,
        headers: {
          Authorization: `Bearer ${loginState?.accessToken}`,
        },
        // data: { comment:  },
      });
      replyRefresh ? setReplyRefresh(0) : setReplyRefresh(1);
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
    <div className="comment-wrap">
      {replies?.map((e, i) => {
        return (
          <div className="comment-element" key={i}>
            <img className="comment-img" src={e.image} />
            <div className="comment-bubble">
              <div className="comment-username">
                <span>{e.username}</span>
                <span>{e.userid === loungeData.userid && "작성자"}</span>
              </div>
              <div className="comment-content">{e.comment}</div>
              <div className="comment-icons">
                <span className="comment-time">
                  {relativeTime(new Date(e.createdAt).getTime())}
                </span>
                {e.userid === loginState?.id && (
                  <>
                    <Icon
                      icon="clarity:edit-solid"
                      style={{ cursor: "pointer" }}
                      onClick={() => setOnEdit(true)}
                    />
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
      })}
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
      <div className="comment__write">
        <input
          className="comment__input"
          spellCheck="false"
          placeholder="댓글을 작성해 주세요"
          maxLength="300"></input>
        <Icon
          icon="fluent:send-20-filled"
          className="comment-send"
          onClick={() => {
            document.querySelector(".comment__input").value !== "" &&
              postReply();
          }}
        />
      </div>
    </div>
  );
}
