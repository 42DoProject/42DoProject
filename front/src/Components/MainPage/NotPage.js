import react from "react";
import { Redirect } from "react-router";
import { useHistory } from "react-router";

export default function NotPage() {
  const history = useHistory();

  return (
    <div className="unauth__wrap">
      <div className="unauth__header">
        <span className="unauth__code">404</span> Not Found
      </div>
      <div className="unauth__body">요청하신 페이지를 찾을 수 없습니다.</div>
      <button className="Nav__user__login" onClick={() => history.push("/")}>
        홈으로
      </button>
    </div>
  );
}
