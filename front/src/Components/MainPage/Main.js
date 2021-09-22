import React, { useState } from "react";
import Navbar from "../CommonComponent/Navbar";
import Dashboard from "../MainPage/Dashboard";
import MainBody from "../MainPage/MainBody";
import Bottom from "../MainPage/Bottom";
import Chat from "../CommonComponent/Chat";
export default function Main() {
  let [restart, setRestart] = useState(0);
  return (
    <>
      <Navbar restart={restart} setRestart={setRestart} />
      <Dashboard />
      <MainBody />
      <Bottom />
      <Chat />
    </>
  );
}
