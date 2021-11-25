import axios from "axios";
import React, { useEffect, useState } from "react";
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
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const itemPerPage = 10;

  const [modalFlag, setModalFlag] = useState(false);

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
        // console.log("rows", rows);
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

  return (
    <div className="comment-wrap">
      {modalFlag && (
        <Modal
          body="로그인해 주세요"
          buttons="cancel-only"
          setOpenFlag={setModalFlag}
        />
      )}
      {replies?.map((e, i) => {
        return (
          <CommentElement
            e={e}
            key={i}
            loungeData={loungeData}
            replyRefresh={replyRefresh}
            setReplyRefresh={setReplyRefresh}
            refreshFlag={refreshFlag}
            setRefreshFlag={setRefreshFlag}
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
          className="comment__input"
          spellCheck="false"
          placeholder="댓글을 작성해 주세요"
          maxLength="300"></input>
        <Icon
          icon="fluent:send-20-filled"
          className="comment-send"
          onClick={() => {
            if (!loginState) {
              setModalFlag(true);
            }
            document.querySelector(".comment__input").value !== "" &&
              postReply();
          }}
        />
      </div>
    </div>
  );
}
