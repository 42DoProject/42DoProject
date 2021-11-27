import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import "../../SCSS/AllProjectPage/ProjectPaginate.scss";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function LoungePaginate({ status, setLoungeData, refreshFlag }) {
  const [page, setPage] = useState(1);
  const [loungeLength, setLoungeLength] = useState(0);
  const loginState = useSelector((state) => state.loginReducer);
  const handlePageChange = (page) => {
    setPage(page);
  };

  useEffect(() => {
    if (status === "base") {
      const getData = async () => {
        try {
          const {
            data: { count, rows },
          } = await axios.get(
            `https://${process.env.REACT_APP_BACKEND_DOMAIN}/lounge?page=${page}&pageSize=5`,
            {
              headers: {
                Authorization: `Bearer ${loginState?.accessToken}`,
              },
            }
          );
          setLoungeData(rows);
          setLoungeLength(count);
        } catch (err) {
          console.log(err);
        }
      };
      getData();
    } else {
      const getData = async () => {
        try {
          const {
            data: { count, rows },
          } = await axios.get(
            `https://${process.env.REACT_APP_BACKEND_DOMAIN}/lounge?page=${page}&pageSize=5&order=like`,
            {
              headers: {
                Authorization: `Bearer ${loginState?.accessToken}`,
              },
            }
          );
          setLoungeData(rows);
          setLoungeLength(count);
        } catch (err) {
          console.log(err);
        }
      };
      getData();
    }
  }, [page, refreshFlag]);

  return (
    <Pagination
      hideFirstLastPages={true}
      activePage={page}
      itemsCountPerPage={5}
      totalItemsCount={loungeLength}
      pageRangeDisplayed={4}
      prevPageText={
        <Icon icon="dashicons:arrow-left-alt2" color="#e5e5e5" height="2rem" />
      }
      nextPageText={
        <Icon icon="dashicons:arrow-right-alt2" color="#e5e5e5" height="2rem" />
      }
      onChange={handlePageChange}
    />
  );
}
