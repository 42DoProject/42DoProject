import { Route, Switch } from "react-router-dom";
import Main from "./Components/MainPage/Main";
import ProfilePage from "./Components/ProfilePage/ProfilePage";
import RecruitProjects from "./Components/AllProjectPage/RecruitProjects";
import ProceedProjects from "./Components/AllProjectPage/ProceedProjects";
import CompleteProjects from "./Components/AllProjectPage/CompleteProjects";
import RecruitCadet from "./Components/CadetPage/RecruitCadet";
import LoungePage from "./Components/LoungePage/LoungePage";
import AuthMain from "./Components/AuthMain/AuthMain";
import ProfileEditPage from "./Components/ProfileEditPage/ProfileEditPage";
import Layout from "./Components/CommonComponent/Layout";
import ProjectEditPage from "./Components/ProjectEditPage/ProjectEditPage";
import "./SCSS/init.scss";
import AllCadet from "./Components/CadetPage/AllCadet";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "./socket";
import ProjectDetail from "./Components/ProjectDetail/ProjectDetail";

function App(props) {
  // 새로운 Token 발급
  let loginState = useSelector((state) => state.loginReducer);
  let dispatch = useDispatch();
  const getToken = async () => {
    try {
      if (loginState) {
        const prevRefreshToken = localStorage.getItem("refreshToken");
        const {
          data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
        } = await axios.get(
          `http://localhost:5000/auth/signin?refresh_token=${prevRefreshToken}`
        );
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        socket.emit("authorization", {
          token: newAccessToken,
        });
      }
    } catch (err) {
      dispatch({ type: "LOGOUT" });
      console.log(err);
    }
  };
  useEffect(() => {
    getToken();
  }, []);
  // 25분마다 요청
  useEffect(() => {
    const timerId = setInterval(getToken, 1000 * 60 * 25);
    localStorage.setItem("timerId", timerId);
  }, [loginState]);
  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/auth" component={AuthMain} />
        {/* <Route path="/auth" render={()=><AuthMain props={props}/>} /> */}
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/profile/edit" component={ProfileEditPage} />
        <Route exact path="/profile/:id" component={ProfilePage} />
        <Route path="/projectlist/recruit" component={RecruitProjects} />
        <Route path="/projectlist/proceed" component={ProceedProjects} />
        <Route path="/projectlist/complete" component={CompleteProjects} />
        <Route path="/cadet/recruit" component={RecruitCadet} />
        <Route path="/cadet/all" component={AllCadet} />
        <Route path="/lounge" component={LoungePage} />
        <Route path="/project/edit" component={ProjectEditPage} />
        <Route exact path="/project/:id" component={ProjectDetail} />
      </Switch>
    </Layout>
  );
}

export default App;
