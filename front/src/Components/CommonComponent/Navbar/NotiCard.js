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
        `http://${process.env.REACT_APP_DOMAIN_NAME}:5000/user/profile/${userId}`
      );
      setUserName(data.username);
    } catch (err) {
      console.log(err);
    }
  };
  if (type === 30 || type === 20) searchUser(args[0].userId);
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
          <span className="userName">{userName}</span>님이 팔로우
          신청하였습니다.
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
          <span className="userName">{userName}</span>님이 프로젝트 찾는 중으로
          상태를 변경하였습니다.
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
            <div className="title">Project 신청</div>
            <div className="date">{relativeTime(date)}</div>
          </div>
          <span className="projectName">{args[0].project}</span>에
          참여신청되었습니다.
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
            <div className="title">Project 승인</div>
            <div className="date">{relativeTime(date)}</div>
          </div>
          <span className="projectName">{args[0].project}</span>에
          참여되었습니다.
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
            <div className="title">Project 거절</div>
            <div className="date">{relativeTime(date)}</div>
          </div>
          <span className="projectName">{args[0].project}</span>에 참여하지
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
            <div className="title">Project 지원</div>
            <div className="date">{relativeTime(date)}</div>
          </div>
          <span className="projectName">{args[1].project}</span>
          {`에 `}
          <span className="projectName">{args[0].username}</span>가
          참여신청했습니다.
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
            <div className="title">Project</div>
            <div className="date">{relativeTime(date)}</div>
          </div>
          <span className="projectName">{args[0].project}</span>가
          {args[1].status === 0 && (
            <>
              <span className="projectName"> 모집 중</span>
              <span>으</span>
            </>
          )}
          {args[1].status === 1 && (
            <>
              <span className="projectName"> 진행 중</span>
              <span>으</span>
            </>
          )}
          {args[1].status === 2 && (
            <span className="projectName"> 완료 상태</span>
          )}
          로 변경되었습니다.
        </div>
      )}
    </div>
  );
}
