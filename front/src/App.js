import { Route, Switch } from "react-router-dom";
import Main from "./Components/MainPage/Main";
import ProfilePage from "./Components/ProfilePage/ProfilePage";
import AllProjectPage from "./Components/AllProjectPage/AllProjectPage";
import RecruitCadet from "./Components/CadetPage/RecruitCadet";
import LoungePage from "./Components/LoungePage/LoungePage";
import AuthMain from "./Components/AuthMain/AuthMain";
import ProfileEditPage from "./Components/ProfileEditPage/ProfileEditPage";
import Layout from "./Components/CommonComponent/Layout";
import "./SCSS/init.scss";

function App(props) {
  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/auth" component={AuthMain} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route path="/allproject" component={AllProjectPage} />
        <Route path="/cadet/recruit" component={RecruitCadet} />
        <Route exact path="/lounge" component={LoungePage} />
        <Route path="/profile/edit" component={ProfileEditPage} />
      </Switch>
    </Layout>
  );
}

export default App;
