import { combineReducers } from "redux";
import loginReducer from "./LoginReducer";
import DmReducer from "./DmReducer";

const rootReducer = combineReducers({
  loginReducer,
  DmReducer,
});

export default rootReducer;
