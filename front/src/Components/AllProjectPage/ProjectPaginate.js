import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import Pagination from "react-js-pagination";
import Cards from "../MainPage/Cards";
import "../../SCSS/AllProjectPage/ProjectPaginate.scss";
import "../../SCSS/AllProjectPage/ProjectGrid.scss";

export default function ProjectPaginate(props) {
  const [page, setPage] = useState(1);
  const [Project, setProject] = useState([]);
  let totCount = 1;
  const getData = async () => {
    try {
      const {
        data: {
          project: { rows: projectData, count },
        },
      } = await axios.get(
        `http://localhost:5000/project?state=${props.state}&pageSize=12&page=${page}`
      );
      setProject(projectData);
      totCount = count;
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
        {Project.map((el, idx) => {
          return <Cards key={idx} projectData={el} />;
        })}
      </div>
      <Pagination
        hideFirstLastPages={true}
        activePage={page}
        itemsCountPerPage={12}
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
    </>
  );
}
