import React, { useState } from "react";
import Dashboard from "../MainPage/Dashboard";
import MainBody from "../MainPage/MainBody";
import Bottom from "../MainPage/Bottom";
export default function Main() {
  return (
    <>
      <Dashboard />
      <MainBody />
      <Bottom />
    </>
  );
}
