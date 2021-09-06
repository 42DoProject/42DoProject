import axios from "axios";

export const accessToken = async (code: string): Promise<boolean | object> => {
  try {
    var res = await axios.post(`${process.env.FT_OAUTH}`, {
      grant_type: "authorization_code",
      client_id: process.env.FT_OAUTH_CLIENT_ID,
      client_secret: process.env.FT_OAUTH_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.FT_OAUTH_REDIRECT_URI,
    });
    return res.data;
  } catch {
    return false;
  }
};

export const refreshToken = async (
  token: string
): Promise<boolean | object> => {
  try {
    var res = await axios.post(`${process.env.FT_OAUTH}`, {
      grant_type: "refresh_token",
      client_id: process.env.FT_OAUTH_CLIENT_ID,
      client_secret: process.env.FT_OAUTH_CLIENT_SECRET,
      refresh_token: token,
    });
    return res.data;
  } catch {
    return false;
  }
};

export const request = () => {};
