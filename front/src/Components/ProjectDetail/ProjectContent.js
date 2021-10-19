import React from "react";
import "../../SCSS/ProjectDetail/ProjectContent.scss";
import { InlineIcon } from "@iconify/react";

import "@toast-ui/editor/dist/toastui-editor.css";
import { Viewer } from "@toast-ui/react-editor";

export default function ProjectContent(props) {
  return (
    <>
      <div className="project_content">
        <div className="project_content_row1">
          <InlineIcon icon="ri:file-paper-2-line" color="#565656" height="25" />
          <div className="project_address">프로젝트 소개</div>
        </div>
        {props.content.content?.content && (
          <div className="md_viewer">
            <Viewer initialValue={props.content.content.content} />
          </div>
        )}
      </div>
    </>
  );
}
