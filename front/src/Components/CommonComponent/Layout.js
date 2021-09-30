import React from "react";
import { useSelector } from "react-redux";
import Chat from "./Chat";
import Navbar from "./Navbar";

export default function Layout(props) {
  let loginState = useSelector((state) => state.loginReducer);
  return (
    <>
      <Navbar />
      {props.children}
      {loginState !== null && <Chat />}
    </>
  );
}
