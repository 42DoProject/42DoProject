import React from "react";
import Chat from "./Chat";
import Navbar from "./Navbar";

export default function Layout(props) {
  return (
    <>
      <Navbar />
      {props.children}
      <Chat />
    </>
  );
}
