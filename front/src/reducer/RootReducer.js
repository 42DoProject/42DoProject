import { combineReducers } from "redux";
import userReducer from "./UserReducer";
import loginReducer from "./LoginReducer";

const rootReducer = combineReducers({
  userReducer,
  loginReducer,
});

export default rootReducer;
