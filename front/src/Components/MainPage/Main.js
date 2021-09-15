import React from "react";
import Navbar from "../CommonComponent/Navbar";
import Dashboard from "../MainPage/Dashboard";
import MainBody from "../MainPage/MainBody";
import Bottom from "../MainPage/Bottom";
import Chat from "../CommonComponent/Chat";
export default function Main() {
  return (
    <>
      <Navbar />
      <Dashboard />
      <MainBody />
      <Bottom />
      <Chat />
    </>
  );
}
