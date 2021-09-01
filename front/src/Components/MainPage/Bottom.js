import React from "react";
import Cadet from "./Cadet";
import Lounge from "./Lounge";
import "../../SCSS/MainPage/Bottom.scss";
export default function Bottom() {
  return (
    <div className="bottom">
      <Cadet />
      <Lounge />
    </div>
  );
}
