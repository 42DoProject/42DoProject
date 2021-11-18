import react, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ProjectCard({ title, image, id, setSearchRes }) {
  const [imageUrl, setImageUrl] = useState();
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
        setImageUrl(resized);
      } catch (err) {
        console.log(err);
      }
    };
    resizedImage(image, "500");
  }, []);
  return (
    <Link className="link-color" to={`/project/${id}`}>
      <div
        className="res__projectCard"
        onClick={() => {
          const inputEl = document.querySelector(".Nav__input input");
          inputEl.value = "";
          setSearchRes([]);
        }}
      >
        <div className="image">
          <img src={imageUrl} alt={`image${id}`}></img>
        </div>
        <div className="title">{title}</div>
      </div>
    </Link>
  );
}
