// import logo from "./logo.svg";
import { Route, Switch } from "react-router-dom";
import Main from "./Components/Main";
import ProfilePage from "./Components/ProfilePage/ProfilePage";
import AllProjectPage from "./Components/AllProjectPage/AllProjectPage";
import { useSelector } from "react-redux";

function App(props) {
  return (
    <div>
      <Switch>
        <Route exact path="/">
          <Main />
        </Route>
        <Route path="/profile">
          <ProfilePage />
        </Route>
        <Route path="/allproject">
          <AllProjectPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
