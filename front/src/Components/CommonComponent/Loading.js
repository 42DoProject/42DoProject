import React from "react";
import ReactLoading from "react-loading";
import "../../SCSS/Loading.scss";
const Example = ({
  type = "spin",
  color = "#a7bc5b",
  height = "5%",
  width = "5%",
}) => (
  <div className="loading-wrap">
    <ReactLoading type={type} color={color} height={height} width={width} />
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
