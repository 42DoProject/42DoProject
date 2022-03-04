import react, { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { Redirect } from "react-router";

import GoogleLogin from 'react-google-login';
import "../../SCSS/LoginPage/LoginPage.scss";


const onSuccess = (response) => {
	console.log(response);

}

const onFailure = (response) => {
	console.log(response);
}

export default function GoogleLoginBtn() {
  return (
	<GoogleLogin
    //   clientId="822951444741-07pfgjl3sl4lfkqu6ja3anoghnsmubee.apps.googleusercontent.com"
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      buttonText="Login"
      onSuccess={onSuccess}
      onFailure={onFailure}
	/>

  );
}
