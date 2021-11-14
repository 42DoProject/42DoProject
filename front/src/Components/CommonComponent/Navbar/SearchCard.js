import react from "react";
import default_intra from "../../../default_intra.png";

export default function UserCard({ name, profile, id, setSearchRes }) {
  return (
    <a className="link-color" href={`/profile/${id}`}>
      <div
        className="res__userCard"
        onClick={() => {
          const inputEl = document.querySelector(".Nav__input input");
          inputEl.value = "";
          setSearchRes([]);
        }}>
        <div className="profile">
          <img src={profile || default_intra} alt={`profile${id}`}></img>
        </div>
        <div className="name">{name}</div>
      </div>
    </a>
  );
}
