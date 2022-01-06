import React, { useEffect } from "react";
import { Editor } from "@toast-ui/react-editor";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import axios from "axios";
import { useSelector } from "react-redux";

export default function ProjectEditRight({ projectData, editorRef }) {
  const loginState = useSelector((state) => state.loginReducer);

  useEffect(() => {
    if (projectData) {
      editorRef?.current
        .getInstance()
        .setMarkdown(projectData?.content.content);
    }
  }, [projectData]);

  useEffect(() => {
    if (editorRef?.current) {
      editorRef.current.getInstance().removeHook("addImageBlobHook");
      editorRef.current
        .getInstance()
        .addHook("addImageBlobHook", (blob, callback) => {
          (async () => {
            let formData = new FormData();
            formData.append("image", blob);
            let altText = document.getElementById("toastuiAltTextInput")?.value;

            const res = await axios({
              method: "post",
              url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/project/content/image`,
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${loginState.accessToken}`,
              },
              data: formData,
            });
            callback(res.data.url, altText);
          })();

          return false;
        });
    }
  }, [editorRef, loginState]);

  return (
    <div className="project-edit__right">
      <label>
        프로젝트명<span className="project-edit__asterisk">*</span>
      </label>
      <input
        className="project-edit__name"
        placeholder="프로젝트명을 입력해 주세요. (ex. 식재료에 따른 요리 추천 앱)"
        maxLength="30"
        defaultValue={projectData?.title}
      />
      <label>
        프로젝트 소개<span className="project-edit__asterisk">*</span>
      </label>
      <div className="project-edit__introduction">
        {/* <EditorRef /> */}
        <Editor
          ref={editorRef}
          height="40rem"
          plugins={[colorSyntax]}
          useCommandShortcut={true}
          placeholder={`프로젝트에 대해 자유롭게 소개해 주세요.
(ex. 초기 아이디어 및 프로젝트의 목적, 필요성, 출시 플랫폼, 타겟 유저 등)`}
        />
      </div>
    </div>
  );
}
