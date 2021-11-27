import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import Pagination from "react-js-pagination";
import Cards from "../MainPage/Cards";
import "../../SCSS/AllProjectPage/ProjectPaginate.scss";
import "../../SCSS/AllProjectPage/ProjectGrid.scss";
import ReactLoading from "../CommonComponent/Loading";

export default function ProjectPaginate({
  state,
  filterOption,
  setFilterOption,
}) {
  const [page, setPage] = useState(1);
  const [Project, setProject] = useState(null);
  const [totCount, setTotCount] = useState(1);
  let stateValue = "";

  const getData = async () => {
    try {
      const {
        data: {
          project: { rows: projectData, count },
        },
      } = await axios.get(
        `https://${process.env.REACT_APP_BACKEND_DOMAIN}/project?state=${state}&pageSize=12&page=${page}${filterOption}`
      );
      setTotCount(count);
      setProject(projectData);
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

  switch (state) {
    case "recruiting":
      stateValue = "모집중인";
      break;
    case "proceeding":
      stateValue = "진행중인";
      break;
    case "completed":
      stateValue = "완성된";
      break;
  }
  return Project === null ? (
    <ReactLoading type="spin" color="#a7bc5b" />
  ) : (
    <>
      {Project.length === 0 ? (
        <div className="noProject">{stateValue} 프로젝트가 없어요</div>
      ) : (
        <>
          <div className="project-grid">
            {Project.map((el, idx) => {
              return <Cards key={el["id"]} projectData={el} />;
            })}
          </div>
          <div className="project-pagination">
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
          </div>
        </>
      )}
    </>
  );
}
