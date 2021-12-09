import react, { useEffect, useState } from "react";
// import default_intra from "../../../default_intra.png";
import blankImg from "../../../blankImg.png";
import axios from "axios";
import { Link } from "react-router-dom";

export default function UserCard({ name, profile, id, setSearchRes }) {
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
    if (profile) resizedImage(profile, "100");
  }, []);

  return (
    <Link className="link-color" to={`/profile/${id}`}>
      <div
        className="res__userCard"
        onClick={() => {
          const inputEl = document.querySelector(".Nav__input input");
          inputEl.value = "";
          setSearchRes([]);
        }}>
        <div className="profile">
          <img src={profileUrl || blankImg} alt={`profile${id}`}></img>
        </div>
        <div className="name">{name}</div>
      </div>
    </Link>
  );
}
