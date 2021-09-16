import React from "react";
import { useHistory, useLocation } from "react-router";
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
      const {
        user: { username: userName },
      } = Data;
      const {
        token: { accessToken, refreshToken },
      } = Data;
      console.log(Data);
      dispatch({ type: "LOGIN", payload: userName });
      localStorage.setItem("accessToken", accessToken);
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };
  getData();

  return (
    loginState.name === "guest" && <ReactLoading type="spin" color="#a7bc5b" />
  );
}
