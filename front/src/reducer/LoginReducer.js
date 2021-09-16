let guest = {
  name: "guest",
};

export default function loginReducer(state = guest, action) {
  switch (action.type) {
    case "LOGIN":
      const {
        payload: {
          user: { username: userName },
        },
      } = action;
      let copy = { name: userName };
      return copy;
    default:
      return state;
  }
}
