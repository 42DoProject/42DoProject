import React from "react";
import { useLocation } from "react-router";
import Navbar from "../CommonComponent/Navbar";
import Bottom from "../MainPage/Bottom";
import Dashboard from "../MainPage/Dashboard";
import MainBody from "../MainPage/MainBody";
import axios from "axios";

async function getApi(code) {
  try {
    let data = await axios.get(
      `http://localhost:5000/auth/signin?code=${code}`
    );
    console.log(data);
  } catch (e) {
    console.log(e);
  }
}
export default function AuthMain() {
  const location = useLocation().search;
  const code = new URLSearchParams(location).get("code");
  console.log(code, code);
  getApi(code);
  return (
    <>
      <Navbar />
      <Dashboard />
      <MainBody />
      <Bottom />
    </>
  );
}
