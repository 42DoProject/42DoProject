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
        refreshTime: Date.now() + 1000 * 60 * 25,
      };
      console.log(state);
      return loginState;
    case "LOGOUT":
      console.log("state-LOGOUT");
      clearInterval(localStorage.getItem("timerId"));
      socket.emit("signOut");
      console.log(state);
      return null;
    case "TOKEN_UPDATE":
      console.log("state-UPDATE");
      let updateState = {
        name: state.name,
        email: state.email,
        profileImage: state.profileImage,
        location: state.location,
        id: state.id,
        refreshTime: Date.now() + 1000 * 60 * 25,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
      console.log(state);
      return updateState;
    case "DM":
      let dmState = {
        name: state.name,
        email: state.email,
        profileImage: state.profileImage,
        location: state.location,
        id: state.id,
        refreshTime: state.refreshTime,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        dmid: action.payload.userId,
      };
      return dmState;
    case "PROFILE_UPDATE":
      let updateProfile = {
        name: state.name,
        email: state.email,
        profileImage: action.payload.profileImage,
        location: state.location,
        id: state.id,
        refreshTime: state.refreshTime,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      };
      // updateProfile.profileImage = action.payload.profileImage;
      console.log("LOGINSTATE PROFILE", updateProfile);
      return updateProfile;
    default:
      console.log("state-NULL");
      console.log(state);
      return null;
  }
}
