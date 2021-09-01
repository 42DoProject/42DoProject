import React from "react";
import Navbar from "../Components/CommonComponent/Navbar";
import Dashboard from "../Components/MainPage/Dashboard";
import Recruit from "../Components/MainPage/Recruit";
import Bottom from "../Components/MainPage/Bottom";
export default function Main() {
  return (
    <>
      <Navbar />
      <Dashboard />
      <Recruit />
      <Bottom />
    </>
  );
}
