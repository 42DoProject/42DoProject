import React, { useState } from "react";
import Navbar from "../CommonComponent/Navbar";
import Chat from "../CommonComponent/Chat";
import LoungeBody from "./LoungeBody";
import "../../SCSS/LoungePage/LoungePage.scss";
import ProjectPaginate from "./ProjectPaginate";

export default function LoungePage() {
  let [restart, setRestart] = useState(0);
  return (
    <>
      <Navbar restart={restart} setRestart={setRestart} />
      <div className="lounge-wrap">
        <LoungeBody />
        <Chat />
        <ProjectPaginate />
      </div>
    </>
  );
}
