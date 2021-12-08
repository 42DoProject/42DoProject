import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ReactLoading from "../CommonComponent/Loading";
import socket from "../../socket";

export default function AuthMain() {
  const location = useLocation().search;
  const code = new URLSearchParams(location).get("code");
  let dispatch = useDispatch();
  let history = useHistory();
  let loginState = useSelector((state) => state.loginReducer);
  useEffect(() => {
    const getData = async () => {
      try {
        // 42API에서 User Data 받아오기.
        const { data } = await axios.get(
          `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/auth/signin?code=${code}`
        );
        const {
          token: { accessToken, refreshToken },
        } = data;
        // socket 인증
        socket.emit("authorization", {
          token: accessToken,
        });
        // loginReducer state 변경
        dispatch({ type: "LOGIN", payload: data });
        history.go(-2);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);
  return loginState === null && <ReactLoading type="spin" color="#a7bc5b" />;
}
