import React from "react";
import Cadet from "./Cadet";
import Lounge from "./Lounge";
import "../SCSS/Footer.scss";
export default function Footer() {
  return (
    <div className="footer">
      <Cadet />
      <Lounge />
    </div>
  );
}
