// import logo from "./logo.svg";
import { Route, Switch } from "react-router-dom";
import Main from "./Components/MainPage/Main";
import ProfilePage from "./Components/ProfilePage/ProfilePage";
import AllProjectPage from "./Components/AllProjectPage/AllProjectPage";
import RecruitCadet from "./Components/CadetPage/RecruitCadet";

function App(props) {
  return (
    <div>
      <Switch>
        <Route exact path="/">
          <Main />
        </Route>
        <Route exact path="/profile">
          <ProfilePage />
        </Route>
        <Route path="/allproject">
          <AllProjectPage />
        </Route>
        <Route path="/cadet/recruit">
          <RecruitCadet />
        </Route>
        <Route path="/auth">
          <RecruitCadet />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
