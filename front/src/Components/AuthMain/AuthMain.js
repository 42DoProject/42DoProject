import React from "react";
import { useHistory, useLocation } from "react-router";
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
  let history = useHistory();
  const getData = async () => {
    try {
      const { data: Data } = await axios.get(
        `http://localhost:5000/auth/signin?code=${code}`
      );
      console.log("Data", Data);
      dispatch({ type: "LOGIN", payload: Data });
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };
  getData();
  // console.log("loginState", loginState);

  return (
    loginState.name === "guest" && <ReactLoading type="spin" color="grey" />
  );
}
