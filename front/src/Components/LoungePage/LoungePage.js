import React, { useEffect, useState } from "react";
import LoungeBody from "./LoungeBody";
import "../../SCSS/LoungePage/LoungePage.scss";
import LoungePaginate from "./LoungePaginate";
import { useLocation } from "react-router";

export default function LoungePage() {
  const [loungeData, setLoungeData] = useState();
  const [refreshFlag, setRefreshFlag] = useState(0);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="lounge-wrap">
      <LoungeBody
        status="base"
        loungeData={loungeData}
        refreshFlag={refreshFlag}
        setRefreshFlag={setRefreshFlag}
      />
      <LoungePaginate
        status="base"
        setLoungeData={setLoungeData}
        refreshFlag={refreshFlag}
      />
    </div>
  );
}
