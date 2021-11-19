import React, { useEffect, useState } from "react";
import LoungeBody from "./LoungeBody";
import "../../SCSS/LoungePage/LoungePage.scss";
import LoungePaginate from "./LoungePaginate";
import { useLocation } from "react-router";

export default function LoungePoPularPage() {
  const [loungeData, setLoungeData] = useState();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="lounge-wrap">
      <LoungeBody status="popular" loungeData={loungeData} />
      <LoungePaginate status="popular" setLoungeData={setLoungeData} />
    </div>
  );
}
