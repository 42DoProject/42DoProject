import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "../../SCSS/LoungePage/LoungeComment.scss";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import Pagination from "react-js-pagination";
import Modal from "../ProjectEditPage/Modal";
import CommentElement from "./CommentElement";

export default function LoungeComment({
  loungeData,
  refreshFlag,
  setRefreshFlag,
}) {
  const loginState = useSelector((state) => state.loginReducer);
  const [replies, setReplies] = useState([]);
  const [replyRefresh, setReplyRefresh] = useState(0);
  const itemPerPage = 10;
  const [page, setPage] = useState(
    Math.ceil(loungeData.replyCount / itemPerPage)
  );
  const [totalPage, setTotalPage] = useState(1);
  const [modalFlag, setModalFlag] = useState(false);
  const inputRef = useRef();

  const handlePageChange = (page) => {
    setPage(page);
  };

  const postReply = async () => {
    try {
      await axios({
        method: "POST",
        url: `https://${process.env.REACT_APP_BACKEND_DOMAIN}/lounge/reply/${loungeData.id}`,
        headers: {
          Authorization: `Bearer ${loginState?.accessToken}`,
        },
        data: { comment: inputRef.current.value },
      });
      inputRef.current.value = "";
      setPage(Math.ceil((loungeData.replyCount + 1) / itemPerPage));
      refreshFlag ? setRefreshFlag(0) : setRefreshFlag(1);
      replyRefresh ? setReplyRefresh(0) : setReplyRefresh(1);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getReply = async () => {
      try {
        const {
          data: { count, rows },
        } = await axios({
          method: "GET",
          url: `https://${process.env.REACT_APP_BACKEND_DOMAIN}/lounge/reply/${
            loungeData.id
          }?page=${page ? page : 1}&pageSize=${itemPerPage}
        `,
          headers: {
            Authorization: `Bearer ${loginState?.accessToken}`,
          },
        });
        setTotalPage(count);
        setReplies(rows);
      } catch (err) {
        console.log(err);
      }
    };
    getReply();
  }, [replyRefresh, page]);

  // console.log("page", page);

  return (
    <div className="comment-wrap">
      {modalFlag === true && (
        <Modal
          body="로그인해 주세요"
          buttons={["확인"]}
          confirmFunc={() => setModalFlag(false)}
        />
      )}
      {replies?.map((e) => {
        return (
          <CommentElement
            e={e}
            key={e.id}
            loungeData={loungeData}
            replyRefresh={replyRefresh}
            setReplyRefresh={setReplyRefresh}
            refreshFlag={refreshFlag}
            setRefreshFlag={setRefreshFlag}
            page={page}
            setPage={setPage}
            itemPerPage={itemPerPage}
          />
        );
      })}
      {replies?.length !== 0 && (
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
      )}
      <div className="comment__write">
        <input
          ref={inputRef}
          className="comment__input"
          spellCheck="false"
          placeholder="댓글을 작성해 주세요"
          maxLength="300"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              if (!loginState) {
                setModalFlag(true);
              } else {
                inputRef.current.value !== "" && postReply();
              }
            }
          }}></input>
        <Icon
          icon="fluent:send-20-filled"
          className="comment-send"
          onClick={() => {
            if (!loginState) {
              setModalFlag(true);
            } else {
              inputRef.current.value !== "" && postReply();
            }
          }}
        />
      </div>
    </div>
  );
}
