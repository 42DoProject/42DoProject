import socket from "../../socket";
export default function loginReducer(state, action) {
  console.log(`-------------state ${action.type}-------------`);
  console.log(state);
  switch (action.type) {
    case "LOGIN":
      console.log("state-LOGIN");
      let loginState = {
        name: action.payload.user.username,
        email: action.payload.user.email,
        profileImage: action.payload.user.profileImage,
        location: action.payload.user.location,
        id: action.payload.user.id,
        accessToken: action.payload.token.accessToken,
        refreshToken: action.payload.token.refreshToken,
      };
      console.log(state);
      return loginState;
    case "LOGOUT":
      console.log("state-LOGOUT");
      clearInterval(localStorage.getItem("timerId"));
      socket.emit("signOut");
      console.log(state);
      return null;
    case "DM":
      console.log("state-DM");
      let DmState = {
        ...state,
        dmid: action.payload,
      };
      console.log(state);
      return DmState;
    case "TOKEN_UPDATE":
      console.log("state-UPDATE");
      let updateState = {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
      console.log(state);
      return updateState;
    default:
      console.log("state-NULL");
      console.log(state);
      return null;
  }
}
