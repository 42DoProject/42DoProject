import React, { useEffect, useState } from "react";
import Dashboard from "../MainPage/Dashboard";
import MainBody from "../MainPage/MainBody";
import Bottom from "../MainPage/Bottom";
export default function Main() {
  let [progressPr, setProgressPr] = useState(0);
  let [finishPr, setFinishPr] = useState(0);
  // console.log("prpr", progressPr);
  // console.log("fipr", finishPr);

  return (
    <>
      <Dashboard progressPr={progressPr} finishPr={finishPr} />
      <MainBody setProgressPr={setProgressPr} setFinishPr={setFinishPr} />
      <Bottom />
    </>
  );
}
