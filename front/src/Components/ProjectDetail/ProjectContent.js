import React from "react";
import "../../SCSS/ProjectDetail/ProjectContent.scss";
import { InlineIcon } from "@iconify/react";

import "@toast-ui/editor/dist/toastui-editor.css";
import { Viewer } from "@toast-ui/react-editor";

export default function ProjectContent({ content }) {
  const urlList = [];

  const parseLink = () => {
    for (var i in content.content.reference) {
      urlList[i] = {
        url: content.content.reference[i],
        src:
          "http://www.google.com/s2/favicons?sz=36&domain=" +
          content.content.reference[i],
      };
    }
  };
  parseLink();
  return (
    <>
      <div className="project_content">
        <div className="project_content_row1">
          <InlineIcon
            icon="ri:file-paper-2-line"
            color="#565656"
            fontSize="1.5rem"
          />
          <div className="project_address">프로젝트 소개</div>
        </div>
        {content.content?.content && (
          <>
            <div className="md_viewer">
              <Viewer initialValue={content.content.content} />
            </div>
            <div className="link_list">
              {/* TODO: http://가 없는 링크면 상대경로로 간다.  */}
              {urlList.map((elm, idx) => (
                <div className="link_wrap">
                  <a href={elm.url}>
                    <img height="24" width="24" src={elm.src} />
                  </a>
                  <a href={elm.url}>{elm.url}</a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
