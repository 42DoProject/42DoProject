// import logo from "./logo.svg";
import { Route, Switch } from "react-router-dom";
import Main from "./Components/Main";
import ProfilePage from "./Components/ProfilePage/ProfilePage";
import AllProjectPage from "./Components/AllProjectPage/AllProjectPage";

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
      </Switch>
    </div>
  );
}

export default App;
