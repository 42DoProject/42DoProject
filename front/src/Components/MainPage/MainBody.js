import React, { useEffect, useState } from "react";
import "../../SCSS/MainPage/MainBody.scss";
import RecruitList from "./RecruitList";
import PubilcList from "./PubilcList";
import axios from "axios";
import ReactLoading from "./MainLoading";
export default function MainBody() {
  let [recruitingProject, setRecruitingProject] = useState(false);
  let [completedProject, setCompletedProject] = useState(false);
  // console.log("mainbody");
  const getData = async () => {
    try {
      let {
        data: { project: recruitingData },
      } = await axios.get(
        `http://localhost:5000/project?state=recruiting&pageSize=20&page=1`
      );
      let {
        data: { project: completedData },
      } = await axios.get(
        `http://localhost:5000/project?state=completed&pageSize=20&page=1`
      );
      setRecruitingProject(recruitingData);
      setCompletedProject(completedData);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
    // console.log("mainbodyuseEff");
  }, []);
  return (
    <div className="recruit__wrap">
      <div className="recruit">
        <div className="recruit__title">모집중인 프로젝트</div>
        {recruitingProject ? (
          <RecruitList recruitingProject={recruitingProject} />
        ) : (
          <ReactLoading type="spin" color="#a7bc5b" />
        )}
      </div>
      <div className="public">
        <div className="public__title">완료된 프로젝트</div>
        {completedProject ? (
          <PubilcList completedProject={[completedProject]} />
        ) : (
          <ReactLoading type="spin" color="#a7bc5b" />
        )}
      </div>
    </div>
  );
}
