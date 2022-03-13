import react, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Icon } from "@iconify/react";
import "../../SCSS/LoginPage/LoginPage.scss";

export default function LoginPage() {
  return (
    <div className="login__wrap">
      <div className="login__header">
	      <Icon className="title-icon" icon="simple-icons:42" />
          <div className="title-text">DoProject</div>
      </div>
	  <button className="intra__login__btn">
        <a
		  className="login__btn__tag"
          href={`${process.env.REACT_APP_HTTP_ENV}://api.intra.42.fr/oauth/authorize?client_id=${process.env.REACT_APP_INTRA_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_INTRA_SIGNIN_REDIRECT_URI}&response_type=code`}>
		  <Icon className="btn-icon" icon="simple-icons:42" />
          <div className="btn-text">Sign in with 42 Intra</div>
        </a>
      </button>
	  <button className="google__login__btn">
        <a
		  className="login__btn__tag"
          href={`https://accounts.google.com/o/oauth2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_GOOGLE_CLIENT_SIGNIN_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email`}>
		  <Icon className="btn-icon" icon="flat-color-icons:google" />
          <div className="btn-text">Sign in with Google</div>
        </a>
      </button>
	  <div className="google__text">
		  구글 로그인은 인트라 계정 연동이 필요합니다.
	  </div>
    </div>
  );
}
