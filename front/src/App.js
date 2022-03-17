import { Route, Switch } from "react-router-dom";
import Main from "./Components/MainPage/Main";
import ProfilePage from "./Components/ProfilePage/ProfilePage";
import RecruitProjects from "./Components/AllProjectPage/RecruitProjects";
import ProceedProjects from "./Components/AllProjectPage/ProceedProjects";
import CompleteProjects from "./Components/AllProjectPage/CompleteProjects";
import RecruitCadet from "./Components/CadetPage/RecruitCadet";
import LoungePage from "./Components/LoungePage/LoungePage";
import LoungePopularPage from "./Components/LoungePage/LoungePopularPage";
import AuthMain from "./Components/AuthMain/AuthMain";
import ProfileEditPage from "./Components/ProfileEditPage/ProfileEditPage";
import Layout from "./Components/CommonComponent/Layout";
import ProjectEditPage from "./Components/ProjectEditPage/ProjectEditPage";
import "./SCSS/init.scss";
import AllCadet from "./Components/CadetPage/AllCadet";
import axios from "axios";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "./socket";
import ProjectDetail from "./Components/ProjectDetail/ProjectDetail";
import Unauthorized from "./Components/CommonComponent/Unauthorized";
import NotPage from "./Components/MainPage/NotPage";
import { useHistory, useLocation } from "react-router";
import IntraSignin from "./Components/AuthMain/IntraSignin";
import LoginErrorPage from "./Components/LoginPage/LoginErrorPage";
import AuthGoogle from "./Components/AuthMain/AuthGoogle";
import LinkGoogle from "./Components/AuthMain/LinkGoogle";
import LoginPage from "./Components/LoginPage/LoginPage";

function App(props) {
  let loginState = useSelector((state) => state.loginReducer);
  let dispatch = useDispatch();
  const history = useHistory();
  // const location = useLocation();
  // 새로운 Token 발급
  useEffect(() => {
    const getToken = async () => {
      try {
        if (loginState) {
          const { data } = await axios.get(
            `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/auth/signin?refresh_token=${loginState.refreshToken}`
          );
          dispatch({ type: "TOKEN_UPDATE", payload: data });
        }
      } catch (err) {
        dispatch({ type: "LOGOUT" });
        console.log(err);
      }
      console.log("App.js2", loginState);
    };
    socket.emit("authorization", {
      token: loginState?.accessToken,
    });
    const refreshLogin = () => {
      if (loginState?.refreshTime < Date.now()) {
        console.log("loginState", loginState.refreshTime);
        console.log("date", Date.now());
        getToken();
      }
    };
    clearInterval(localStorage.getItem("timerId"));
    // const timerId = setInterval(getToken, 1000 * 60 * 25);
    const timerId = setInterval(refreshLogin, 1000 * 60 * 4);
    localStorage.setItem("timerId", timerId);
    if (loginState?.refreshTime < Date.now()) {
      console.log("loginState", loginState.refreshTime);
      console.log("date", Date.now());
      getToken();
    }
    // console.log("location changed, accessToken update");

    axios.interceptors.request.use(
      function (config) {
        // Do something before request is sent
        return config;
      },
      function (error) {
        // Do something with request error
        console.log("request error");
        return Promise.reject(error);
      }
    );

    // Add a response interceptor
    axios.interceptors.response.use(
      function (response) {
        // Do something with response data
        return response;
      },
      function (error) {
        // Do something with response error
        if (error.response.status === 401) {
          history.push("/unauthorized");
        }
        return Promise.reject(error);
      }
    );
  }, [loginState]);

  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={Main} />
		<Route exact path="/auth/signin/intra" component={IntraSignin} />
        <Route exact path="/auth/signin/google" component={AuthGoogle} />
        <Route exact path="/auth/linking/google" component={LinkGoogle} />
		<Route exact path="/login" component={LoginPage} />
        <Route exact path="/login/error" component={LoginErrorPage}/>
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/profile/edit" component={ProfileEditPage} />
        <Route exact path="/profile/:id" component={ProfilePage} />
        <Route path="/projectlist/recruit" component={RecruitProjects} />
        <Route path="/projectlist/proceed" component={ProceedProjects} />
        <Route path="/projectlist/complete" component={CompleteProjects} />
        <Route path="/cadet/recruit" component={RecruitCadet} />
        <Route path="/cadet/all" component={AllCadet} />
        <Route path="/lounge/popular" component={LoungePopularPage} />
        <Route path="/lounge" component={LoungePage} />
        <Route exact path="/project/edit" component={ProjectEditPage} />
        <Route exact path="/project/edit/:id" component={ProjectEditPage} />
        <Route exact path="/project/:id" component={ProjectDetail} />
        <Route exact path="/unauthorized" component={Unauthorized} />
        <Route path="/" component={NotPage} />
      </Switch>
    </Layout>
  );
}

export default App;
