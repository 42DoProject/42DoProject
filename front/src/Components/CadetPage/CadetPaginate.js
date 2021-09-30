import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import "../../SCSS/AllProjectPage/ProjectPaginate.scss";
import { Icon } from "@iconify/react";
import axios from "axios";

export default function CadetPaginate() {
  const [page, setPage] = useState(1);
  const handlePageChange = (page) => {
    setPage(page);
    console.log(page);
  };
  return (
    <Pagination
      hideFirstLastPages={true}
      activePage={page}
      itemsCountPerPage={10}
      totalItemsCount={450}
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
