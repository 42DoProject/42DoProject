import react, { useEffect } from "react";
import axios from "axios";

import "../../SCSS/LoginPage/LinkGoogleBtn.scss";




export default function LinkGoogleBtn() {

	const linkGoogle = (e, commentId) => {
		axios({
			method: "GET",
			url: `${process.env.REACT_APP_HTTP_ENV}://${process.env.REACT_APP_BACKEND_DOMAIN}/auth/linking/google`,
			headers: {
			Authorization: `Bearer ${loginState.accessToken}`,
			},
			data: {
			comment: editComment,
			},
		})
			.then((res) => {
			console.log(res);
			})
			.catch((e) => console.log(e));
		e.preventDefault();
		};

  return (
    <div className="link_google_btn"
		onClick={linkGoogle}>
	link google
    </div>
  );
}
