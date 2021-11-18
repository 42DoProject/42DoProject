import react, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import "../../../SCSS/Common/Chat/UserNameCard.scss";
import axios from "axios";

export default function UserNameCard({ idx, userInfo, userList, setUserList }) {
  const [profileUrl, setProfileUrl] = useState();
  useEffect(() => {
    const resizedImage = async (key, size) => {
      // 정상적으로 가져와지면 resized url반환, 아니면 원본이미지 url반환
      const url = key.split("/");
      url[url.length - 3] = size;
      const resized = url.join("/");
      try {
        await axios({
          method: "head",
          url: `${resized}?timestamp=${Date.now()}`,
        });
        setProfileUrl(resized);
      } catch (err) {
        console.log(err);
      }
    };
    resizedImage(userInfo.profile, "100");
  }, []);

  const deleteUserList = (idx) => {
    userList.splice(idx, 1);
    setUserList([...userList]);
  };
  return (
    <div className="userNameCard">
      <div className="userProfile">
        <img src={profileUrl} />
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
