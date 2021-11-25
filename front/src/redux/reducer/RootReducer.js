import { combineReducers } from "redux";
import loginReducer from "./LoginReducer";

const rootReducer = combineReducers({
  loginReducer,
});

export default rootReducer;
