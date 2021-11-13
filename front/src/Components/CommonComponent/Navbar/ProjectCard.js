import react from "react";

export default function ProjectCard({ title, image, id, setSearchRes }) {
  return (
    <a className="link-color" href={`/project/${id}`}>
      <div
        className="res__projectCard"
        onClick={() => {
          const inputEl = document.querySelector(".Nav__input input");
          inputEl.value = "";
          setSearchRes([]);
        }}
      >
        <div className="image">
          <img src={image} alt={`image${id}`}></img>
        </div>
        <div className="title">{title}</div>
      </div>
    </a>
  );
}
