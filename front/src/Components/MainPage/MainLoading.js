import React from "react";
import ReactLoading from "react-loading";
import "../../SCSS/MainPage/MainLoading.scss";
const Example = ({ type, color }) => (
  <div className="mainLoading-wrap">
    <ReactLoading type={type} color={color} height={"3%"} width={"3%"} />
  </div>
);

export default Example;

// blank
// balls
// bars
// bubbles
// cubes
// cylon
// spin
// spinningBubbles
// spokes
