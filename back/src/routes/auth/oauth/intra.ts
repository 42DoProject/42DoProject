import axios from "axios";
import { IOToken } from "../../../interface/token.interface";

export const requestIntraAccessToken = async (
  code: string
): Promise<boolean | IOToken> => {
  try {
    var res = await axios.post<IOToken>("https://api.intra.42.fr/oauth/token", {
      grant_type: "authorization_code",
      client_id: process.env.INTRA_CLIENT_ID,
      client_secret: process.env.INTRA_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.INTRA_REDIRECT_URI,
    });
    return res.data;
  } catch {
    return false;
  }
};

export const requestIntraUser = async (
  token: string
): Promise<boolean | object> => {
  try {
    var res = await axios.get("https://api.intra.42.fr/v2/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch {
    return false;
  }
};
