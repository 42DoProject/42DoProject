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
import NotPage from "./Components/MainPage/NotPage";
function App(props) {
  let loginState = useSelector((state) => state.loginReducer);
  let dispatch = useDispatch();
  // 새로운 Token 발급
  useEffect(() => {
    const getToken = async () => {
      try {
        if (loginState) {
          const { data } = await axios.get(
            `https://${process.env.REACT_APP_BACKEND_DOMAIN}/auth/signin?refresh_token=${loginState.refreshToken}`
          );
          socket.emit("authorization", {
            token: data.accessToken,
          });
          dispatch({ type: "TOKEN_UPDATE", payload: data });
        }
      } catch (err) {
        dispatch({ type: "LOGOUT" });
        console.log(err);
      }
      console.log("App.js2", loginState);
    };
    if (loginState?.refreshTime < Date.now()) {
      console.log("loginState", loginState.refreshTime);
      console.log("date", Date.now());
      getToken();
      clearInterval(localStorage.getItem("timerId"));
      const timerId = setInterval(getToken, 1000 * 60 * 25);
      localStorage.setItem("timerId", timerId);
    }
  }, [loginState]);

  console.log(loginState?.accessToken);

  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/auth" component={AuthMain} />
        {/* <Route path="/auth" render={() => <AuthMain props={props} />} /> */}
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
        <Route path="/" component={NotPage} />
      </Switch>
    </Layout>
  );
}

export default App;
