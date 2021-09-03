import React from "react";
import Navbar from "../CommonComponent/Navbar";
import ProjectContents from "./ProjectContents";
import ProjectTypeBar from "./ProjectTypeBar";
import "../../SCSS/AllProjectPage/ProjectTypeBar.scss"
export default function AllProjectPage() {
	return (
	  <>
		<Navbar />
		<ProjectTypeBar />
		<ProjectContents />
	  </>
	);
  }
