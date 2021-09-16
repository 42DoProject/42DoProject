import React from "react";
import { useLocation } from "react-router";
import Navbar from "../CommonComponent/Navbar";
import Bottom from "../MainPage/Bottom";
import Dashboard from "../MainPage/Dashboard";
import MainBody from "../MainPage/MainBody";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ReactLoading from "../CommonComponent/Loading";

export default function AuthMain() {
  const location = useLocation().search;
  const code = new URLSearchParams(location).get("code");
  let loginState = useSelector((state) => state.loginReducer);
  let dispatch = useDispatch();

  axios
    .get(`http://localhost:5000/auth/signin?code=${code}`)
    .then((res) => {
      dispatch({ type: "LOGIN", payload: res.data });
    })
    .catch((err) => console.log(err));
  console.log("loginState", loginState);
  /*
  login = {
    token:{accessToken:},
    user:{username:}
  }
*/
  return loginState.name === "guest" ? (
    <ReactLoading type="spin" color="grey" />
  ) : (
    <>
      <Navbar />
      <Dashboard />
      <MainBody />
      <Bottom />
    </>
  );
}
