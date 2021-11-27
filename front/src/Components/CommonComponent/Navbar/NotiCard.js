import react, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import relativeTime from "../../../relativeTime";

export default function NotiCard({ date, type, args }) {
  const [userName, setUserName] = useState();
  const history = useHistory();

  const searchUser = async (userId) => {
    try {
      const { data } = await axios.get(
        `https://${process.env.REACT_APP_BACKEND_DOMAIN}/user/profile/${userId}`
      );
      setUserName(data.username);
    } catch (err) {
      console.log(err);
    }
  };
  if (type === 30 || type === 20) searchUser(args[0].userId);
  console.log("args", args);

  return (
    <div className="card-wrap">
      {type === 30 && (
        <div
          className="type"
          onClick={() => {
            history.push(`/profile/${args[0].userId}`);
          }}
        >
          <div className="row1">
            <div className="title">팔로우</div>
            <div className="date">{relativeTime(date)}</div>
          </div>
          <span className="userName">{userName}</span>님이 팔로우하기
          시작했어요.
        </div>
      )}
      {type === 20 && (
        <div
          className="type"
          onClick={() => {
            history.push(`/profile/${args[0].userId}`);
          }}
        >
          <div className="row1">
            <div className="title">팔로워</div>
            <div className="date">{relativeTime(date)}</div>
          </div>
          <span className="userName">{userName}</span>님이 프로젝트를 찾기
          시작했어요.{" "}
        </div>
      )}
      {type === 40 && (
        <div
          className="type"
          onClick={() => {
            history.push(`/project/${args[0].projectId}`);
          }}
        >
          <div className="row1">
            <div className="title">프로젝트 신청</div>
            <div className="date">{relativeTime(date)}</div>
          </div>
          <span className="projectName">{args[0].projectName}</span>에 참여를
          신청했어요.
        </div>
      )}
      {type === 41 && (
        <div
          className="type"
          onClick={() => {
            history.push(`/project/${args[0].projectId}`);
          }}
        >
          <div className="row1">
            <div className="title">프로젝트 참여 승인</div>
            <div className="date">{relativeTime(date)}</div>
          </div>
          <span className="projectName">{args[0].projectName}</span>의 멤버가
          되었어요.
        </div>
      )}
      {type === 42 && (
        <div
          className="type"
          onClick={() => {
            history.push(`/project/${args[0].projectId}`);
          }}
        >
          <div className="row1">
            <div className="title">프로젝트 참여 거절</div>
            <div className="date">{relativeTime(date)}</div>
          </div>
          <span className="projectName">{args[0].projectName}</span>에 참여하지
          못했어요.
        </div>
      )}
      {type === 50 && (
        <div
          className="type"
          onClick={() => {
            history.push(`/project/${args[1].projectId}`);
          }}
        >
          <div className="row1">
            <div className="title">프로젝트 참여 요청</div>
            <div className="date">{relativeTime(date)}</div>
          </div>
          <span className="projectName">{args[1].projectName}</span>
          {`에 `}
          <span className="projectName">{args[0].username}</span>님이 참여를
          요청했어요.
        </div>
      )}
      {type === 60 && (
        <div
          className="type"
          onClick={() => {
            history.push(`/project/${args[0].projectId}`);
          }}
        >
          <div className="row1">
            <div className="title">프로젝트 상태</div>
            <div className="date">{relativeTime(date)}</div>
          </div>
          <span className="projectName">{args[0].projectName}</span>의 상태가
          {args[1].projectStatus === "recruiting" && (
            <span className="projectName"> 모집중</span>
          )}
          {args[1].projectStatus === "proceeding" && (
            <span className="projectName"> 진행중</span>
          )}
          {args[1].projectStatus === "completed" && (
            <span className="projectName"> 완성됨</span>
          )}
          으로 변경되었어요.
        </div>
      )}
      {type === 70 && (
        <div
          className="type"
          onClick={() => {
            history.push("/lounge");
          }}
        >
          <div className="row1">
            <div className="title">라운지 댓글</div>
            <div className="date">{relativeTime(date)}</div>
          </div>
          <span>
            내 글(
            {args[1].comment}
            )에 댓글이 달렸어요.
          </span>
        </div>
      )}
    </div>
  );
}
