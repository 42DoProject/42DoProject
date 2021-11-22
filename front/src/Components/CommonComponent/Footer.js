import React from "react";
import "../../SCSS/Common/Footer.scss";
import { Icon } from "@iconify/react";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-icons">
        <a
          className="footer-icons__white"
          href="https://github.com/42DoProject"
          rel="noreferrer noopener"
          target="_blank">
          <Icon icon="akar-icons:github-fill" fontSize="1.5rem" />
        </a>
        <a className="footer-icons__white" href="mailto:42doteam@gmail.com">
          <Icon icon="fluent:mail-48-filled" fontSize="1.7rem" />
        </a>
      </div>
      <div>djeon | jiylee | seojeong | seuyu | yahong</div>
      <div>ⓒ 2021 42DoProject </div>
    </div>
  );
}
