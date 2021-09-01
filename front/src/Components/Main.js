import React from "react";
import "../SCSS/Main.scss";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import Recruit from "./Recruit";
import Footer from "./Footer";
export default function Main() {
  return (
    <>
      <Navbar />
      <Dashboard />
      <Recruit />
      <Footer />
    </>
  );
}
