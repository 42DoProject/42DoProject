import react from "react";
import { Icon } from "@iconify/react";
import "../../../SCSS/Common/Chat/UserNameCard.scss";

export default function UserNameCard({ idx, userInfo, userList, setUserList }) {
  const deleteUserList = (idx) => {
    userList.splice(idx, 1);
    setUserList([...userList]);
  };
  return (
    <div className="userNameCard">
      <div className="userProfile">
        <img src={userInfo.profile} />
        <Icon
          className="delete-icon"
          style={{ fontSize: "1rem", cursor: "pointer" }}
          icon="bi:x-circle-fill"
          onClick={() => {
            deleteUserList(idx);
          }}
        />
      </div>
      <div className="userName">{userInfo.name}</div>
    </div>
  );
}
