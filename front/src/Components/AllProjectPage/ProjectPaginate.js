import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import Pagination from "react-js-pagination";
import Cards from "../MainPage/Cards";
import "../../SCSS/AllProjectPage/ProjectPaginate.scss";
import "../../SCSS/AllProjectPage/ProjectGrid.scss";

export default function ProjectPaginate() {
  const [page, setPage] = useState(1);
  const [recruitingProject, setRecruitingProject] = useState([]);
  const getData = async () => {
    try {
      const {
        data: { project: recruitingData },
      } = await axios.get(
        `http://localhost:5000/project?pageSize=12&page=${page}`
      );
      setRecruitingProject(recruitingData);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
    console.log(page);
  };

  useEffect(() => {
    getData();
  }, [page]);

  return (
    <>
      <div className="project-grid">
        {recruitingProject.map((el, idx) => {
          return <Cards key={idx} projectData={el} />;
        })}
      </div>
      <Pagination
        hideFirstLastPages={true}
        activePage={page}
        itemsCountPerPage={12}
        totalItemsCount={450}
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
    </>
  );
}
