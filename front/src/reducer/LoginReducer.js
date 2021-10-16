export default function loginReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      let copy = {
        name: action.payload.username,
        email: action.payload.email,
        profileImage: action.payload.profileImage,
        location: action.payload.location,
        id: action.payload.id,
      };
      return copy;
    case "LOGOUT":
      clearInterval(localStorage.getItem("timerId"));
      return null;
    default:
      return null;
  }
}
