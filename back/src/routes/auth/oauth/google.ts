import axios from "axios";
import { IOToken } from "../../../interface/token.interface";

export const requestGoogleAccessToken = async (
  code: string,
  redirect_uri: string
): Promise<boolean | IOToken> => {
  try {
    var res = await axios.post<IOToken>(
      "https://accounts.google.com/o/oauth2/token",
      {
        grant_type: "authorization_code",
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: code,
        redirect_uri: redirect_uri,
      }
    );
    res.data.created_at = Math.floor(Date.now() / 1000);
    return res.data;
  } catch {
    return false;
  }
};

export const requestGoogleUser = async (
  token: string
): Promise<boolean | object> => {
  try {
    var res = await axios.get("https://www.googleapis.com/userinfo/v2/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch {
    return false;
  }
};
