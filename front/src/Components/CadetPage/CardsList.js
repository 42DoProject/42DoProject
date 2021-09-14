import React from "react";
import CadetCards from "../MainPage/CadetCards";
import "../../SCSS/CadetPage/CardsList.scss";
export default function CardsList() {
  return (
    <div className="cadetCardsList">
      <CadetCards />
      <CadetCards />
      <CadetCards />
      <CadetCards />
    </div>
  );
}
