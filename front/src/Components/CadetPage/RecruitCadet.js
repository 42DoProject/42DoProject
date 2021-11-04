import React, { useEffect, useState } from "react";
import CadetTypeBar from "./CadetTypeBar";
import "../../SCSS/CadetPage/RecruitCadet.scss";
import CadetCards from "../MainPage/CadetCards";
import axios from "axios";
import { Icon } from "@iconify/react";
import Pagination from "react-js-pagination";
import ReactLoading from "../CommonComponent/Loading";

export default function RecruitCadet() {
  const [cadets, setCadets] = useState(null);
  const [page, setPage] = useState(1);
  const [totCount, setTotCount] = useState(0);

  const getData = async () => {
    try {
      const {
        data: { count, list },
      } = await axios({
        method: "post",
        url: `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/search/user?page=${page}`,
        data: {
          status: 1,
        },
      });
      setTotCount(count);
      setCadets(list);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  useEffect(() => {
    getData();
  }, [page]);

  return cadets === null ? (
    <div className="recruitCadet-wrap">
      <CadetTypeBar state="recruit" />
      <ReactLoading type="spin" color="#a7bc5b" />
    </div>
  ) : (
    <>
      {cadets.length === 0 ? (
        <div className="recruitCadet-wrap">
          <CadetTypeBar state="recruit" />
          <div className="noCadet">프로젝트를 찾고 있는 카뎃이 없어요</div>
        </div>
      ) : (
        <div className="recruitCadet-wrap">
          <CadetTypeBar state="recruit" />
          <div className="recruitCadet-grid">
            {cadets?.map((v, i) => {
              return <CadetCards cadetData={v} key={v.id} />;
            })}
          </div>
          <div className="project-pagination">
            <Pagination
              hideFirstLastPages={true}
              activePage={page}
              itemsCountPerPage={15}
              totalItemsCount={totCount}
              pageRangeDisplayed={4}
              prevPageText={
                <Icon
                  icon="dashicons:arrow-left-alt2"
                  color="#e5e5e5"
                  height="2rem"
                />
              }
              nextPageText={
                <Icon
                  icon="dashicons:arrow-right-alt2"
                  color="#e5e5e5"
                  height="2rem"
                />
              }
              onChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </>
  );
}
