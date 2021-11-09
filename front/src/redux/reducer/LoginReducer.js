import socket from "../../socket";
export default function loginReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      let loginState = {
        name: action.payload.user.username,
        email: action.payload.user.email,
        profileImage: action.payload.user.profileImage,
        location: action.payload.user.location,
        id: action.payload.user.id,
        accessToken: action.payload.token.accessToken,
        refreshToken: action.payload.token.refreshToken,
      };
      return loginState;
    case "LOGOUT":
      clearInterval(localStorage.getItem("timerId"));
      socket.emit("signOut");
      return null;
    case "TOKEN_UPDATE":
      let updateState = {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
      return updateState;
    default:
      return null;
  }
}
