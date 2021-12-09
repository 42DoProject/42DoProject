import React, { useEffect, useState } from "react";
import CadetTypeBar from "./CadetTypeBar";
import "../../SCSS/CadetPage/RecruitCadet.scss";
import CadetCards from "../MainPage/CadetCards";
import axios from "axios";
import Pagination from "react-js-pagination";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import ReactLoading from "../CommonComponent/Loading";

export default function AllCadet() {
  const [cadets, setCadets] = useState(null);
  const loginState = useSelector((state) => state.loginReducer);
  const [page, setPage] = useState(1);
  const [totCount, setTotCount] = useState(0);
  const [filterOption, setFilterOption] = useState({});

  const getData = async () => {
    // console.log(filterOption);
    try {
      const {
        data: { count, list },
      } = await axios({
        method: "post",
        url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/search/user?page=${page}`,
        headers: {
          Authorization: `Bearer ${loginState?.accessToken}`,
        },
        data: {
          ...filterOption,
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
  }, [page, filterOption]);

  return cadets === null ? (
    <div className="recruitCadet-wrap">
      <CadetTypeBar state="all" setFilterOption={setFilterOption} />
      <ReactLoading type="spin" color="#a7bc5b" />
    </div>
  ) : (
    <>
      {cadets.length === 0 ? (
        <div className="recruitCadet-wrap">
          <CadetTypeBar state="all" setFilterOption={setFilterOption} />
          <div className="noCadet">카뎃이 없어요</div>
        </div>
      ) : (
        <div className="recruitCadet-wrap">
          <CadetTypeBar state="all" setFilterOption={setFilterOption} />
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
