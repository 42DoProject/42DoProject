import React from "react";
import Cards from "../MainPage/Cards";
import "../../SCSS/AllProjectPage/ProjectGrid.scss";

export default function ProjectContents() {
	return (
	  <>
	  	<div className="project-grid">
			  {/* 나중에는 데이터가져와서 있는만큼 Cards생성해야함. */}
			<Cards/>
			<Cards/>
			<Cards/>
			<Cards/>
			<Cards/>
			<Cards/>
			<Cards/>
			<Cards/>
			<Cards/>
			<Cards/>
			<Cards/>
			<Cards/>
		</div>
	  </>
	);
  }
