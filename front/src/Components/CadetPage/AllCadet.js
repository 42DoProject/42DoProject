import React, { useEffect, useState } from "react";
import CadetTypeBar from "./CadetTypeBar";
import "../../SCSS/CadetPage/RecruitCadet.scss";
import CadetCards from "../MainPage/CadetCards";
import axios from "axios";
import Pagination from "react-js-pagination";
import { Icon } from "@iconify/react";

export default function AllCadet() {
  const [cadets, setCadets] = useState();
  const [page, setPage] = useState(1);
  const [totCount, setTotCount] = useState(0);

  const getData = async () => {
    try {
      const {
        data: { count, list },
      } = await axios.get(
        `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/search/user?page=${page}`
      );
      setCadets(list);
      setTotCount(count);
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

  return (
    <>
      <div className="recruitCadet-wrap">
        <CadetTypeBar state="all" />
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
    </>
  );
}
