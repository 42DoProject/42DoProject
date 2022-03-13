import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ReactLoading from "../CommonComponent/Loading";
import socket from "../../socket";

export default function LinkGoogle() {
  const location = useLocation().search;
  const code = new URLSearchParams(location).get("code");
  let dispatch = useDispatch();
  let history = useHistory();
  let loginState = useSelector((state) => state.loginReducer);

  useEffect(() => {
    const getData = async () => {
      try {
		let tmp = decodeURI(code);
        const { data } = await axios.get(
          `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/auth/linking/google?code=${tmp}`,
		  {headers: {Authorization: `Bearer ${loginState.accessToken}`}}
        );
        history.push("/profile");
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);
  return loginState === null && <ReactLoading type="spin" color="#a7bc5b" />;
}
