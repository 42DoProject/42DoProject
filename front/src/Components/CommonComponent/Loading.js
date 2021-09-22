import React from "react";
import ReactLoading from "react-loading";
import "../../SCSS/Loading.scss";
const Example = ({ type, color }) => (
  <div className="loading-wrap">
    <ReactLoading type={type} color={color} height={"5%"} width={"5%"} />
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
