import react from "react";
import { Icon } from "@iconify/react";

export default function UserNameCard({
  name,
  idx,
  userIdList,
  userNameList,
  setUserIdList,
  setUserNameList,
}) {
  const deleteUserList = (idx) => {
    userIdList.splice(idx, 1);
    userNameList.splice(idx, 1);
    setUserIdList([...userIdList]);
    setUserNameList([...userNameList]);
  };
  return (
    <div className="userNameCard">
      <div className="textCard-userName">{name}</div>
      <Icon
        style={{ fontSize: "1.3rem", cursor: "pointer" }}
        icon="bx:bx-x"
        onClick={() => {
          deleteUserList(idx);
        }}
      />
    </div>
  );
}
