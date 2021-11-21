import React from "react";
import "../../SCSS/ProjectDetail/ProjectContent.scss";
import { InlineIcon } from "@iconify/react";
import { Icon } from "@iconify/react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Viewer } from "@toast-ui/react-editor";

export default function ProjectContent({ content }) {
  const urlList = [];

  const parseLink = () => {
    for (var i in content.content.reference) {
      urlList[i] = {
        url: content.content.reference[i],
        src:
          "http://www.google.com/s2/favicons?sz=32&domain=" +
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
              <div className="link_title">
                <Icon icon="akar-icons:link-chain" fontSize="1.5rem" />
                <span>참고 링크</span>
              </div>
              {/* TODO: http://가 없는 링크면 상대경로로 간다.  */}
              {urlList.map((elm, idx) => (
                <div className="link_wrap">
                  <div className="link_favicon">
                    <a href={elm.url} target="_blank">
                      <img src={elm.src} />
                    </a>
                  </div>
                  <div className="link_url">
                    <a href={elm.url} target="_blank">
                      {elm.url}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
