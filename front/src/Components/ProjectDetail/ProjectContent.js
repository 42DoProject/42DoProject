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
      var urlTmp = content.content.reference[i];
      var faviconUrl = "https://icons.duckduckgo.com/ip2/";
      //http or https로 시작하는지 검사 (정규표현식)
      let regex = new RegExp("^(http|https):");
      if (regex.test(urlTmp) === false) urlTmp = "http://" + urlTmp;

      var urlParse = new URL(urlTmp);
      var hostName = urlParse.hostname;

      //notion주소만 예외처리
      let regexForNotion = new RegExp(".notion.site$");
      if (regexForNotion.test(hostName) === true) hostName = "www.notion.so";

      urlList[i] = {
        url: urlTmp,
        src: faviconUrl + hostName + ".ico",
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
            {urlList.length !== 0 ? (
              <div className="link_list">
                <div className="link_title">
                  <Icon icon="akar-icons:link-chain" fontSize="1.5rem" />
                  <span>참고 링크</span>
                </div>
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
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
