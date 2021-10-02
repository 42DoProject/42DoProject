export default function loginReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      let copy = {
        name: action.payload.username,
        email: action.payload.email,
        profileImage: action.payload.profileImage,
        location: action.payload.location,
      };
      return copy;
    case "LOGOUT":
      return null;
    default:
      return null;
  }
}
