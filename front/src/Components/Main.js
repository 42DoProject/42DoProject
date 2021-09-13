import React from "react";
import Navbar from "../Components/CommonComponent/Navbar";
import Dashboard from "../Components/MainPage/Dashboard";
import MainBody from "../Components/MainPage/MainBody";
import Bottom from "../Components/MainPage/Bottom";
export default function Main() {
  return (
    <>
      <Navbar />
      <Dashboard />
      <MainBody />
      <Bottom />
    </>
  );
}
