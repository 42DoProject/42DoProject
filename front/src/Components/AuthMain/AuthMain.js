import React from "react";
import { useHistory, useLocation } from "react-router";
import axios from "axios";
import { useDispatch } from "react-redux";
import ReactLoading from "../CommonComponent/Loading";

export default function AuthMain() {
  const location = useLocation().search;
  const code = new URLSearchParams(location).get("code");
  let dispatch = useDispatch();
  let history = useHistory();
  let checkLogin = JSON.parse(localStorage.getItem("user"));
  // 42API에서 User Data 받아오기.
  const getData = async () => {
    try {
      const { data: Data } = await axios.get(
        `http://localhost:5000/auth/signin?code=${code}`
      );
      const {
        user: { username: userName },
      } = Data;
      const {
        token: { accessToken, refreshToken },
      } = Data;
      // loginReducer state 변경
      dispatch({ type: "LOGIN", payload: userName });
      // localStorage user이름 저장
      localStorage.setItem("user", JSON.stringify(Data.user));
      checkLogin = JSON.parse(localStorage.getItem("user"));
      // token 저장
      // localStorage.setItem("accessToken", accessToken);
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };
  // getData();
  return checkLogin === null && <ReactLoading type="spin" color="#a7bc5b" />;
}
