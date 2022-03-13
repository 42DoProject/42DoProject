import react, { useEffect } from "react";
import "../../SCSS/Common/Unauthorized.scss";

export default function LoginErrorPage() {
  return (
    <div className="unauth__wrap">
      <div className="unauth__header">
        <span className="unauth__code">401</span> Unauthorized
      </div>
      <div className="unauth__body">
        연결된 Intra 계정이 없습니다. Intra 계정으로 로그인 후 프로필에서 구글계정을 연동해주세요.
      </div>
      <button className="Nav__user__login">
        <a
          href={`${process.env.REACT_APP_HTTP_ENV}://api.intra.42.fr/oauth/authorize?client_id=${process.env.REACT_APP_INTRA_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_INTRA_SIGNIN_REDIRECT_URI}&response_type=code`}>
          Intra 로그인
        </a>
      </button>
    </div>
  );
}
