export default function DmReducer(state, action) {
  console.log(`-------------state ${action.type}-------------`);
  console.log(state);
  switch (action.type) {
    case "DM":
      return action.payload;
    default:
      console.log("state-NULL");
      console.log(state);
      return null;
  }
}
