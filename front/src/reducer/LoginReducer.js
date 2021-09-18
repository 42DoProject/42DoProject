let guest = {
  name: "guest",
};

export default function loginReducer(state = guest, action) {
  switch (action.type) {
    case "LOGIN":
      let copy = { name: action.payload };
      return copy;
    default:
      return state;
  }
}
