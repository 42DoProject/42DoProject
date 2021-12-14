import react, { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { Redirect } from "react-router";
import "../../SCSS/Common/Unauthorized.scss";

export default function Unauthorized() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "LOGOUT" });
  }, []);

  return (
    <div className="unauth__wrap">
      <div className="unauth__header">
        <span className="unauth__code">401</span> Unauthorized
      </div>
      <div className="unauth__body">
        로그인 토큰이 만료되어 로그아웃 되었습니다. 다시 로그인 해주세요.
      </div>
      <button className="Nav__user__login">
        <a
          href={`${process.env.REACT_APP_HTTP_ENV}://api.intra.42.fr/oauth/authorize?client_id=${process.env.REACT_APP_API_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_API_REDIRECT_URI}&response_type=code`}>
          SIGN IN
        </a>
      </button>
    </div>
  );
}
