/** @format */

import { get, has } from "lodash";

import { Config, Languages } from "@common";

import { request, error } from "../Omni";

const url = Config.WooCommerce.url;
const isSecured = url.startsWith("https");
const secure = isSecured ? "" : "&insecure=cool";
const cookieLifeTime = 120960000000;

const WPUserAPI = {
  login: async (username, password) => {
    const _url = `${url}/wp-json/api/flutter_user/generate_auth_cookie`;

    return request(_url, {
      method: "POST",
      body: JSON.stringify({
        second: cookieLifeTime,
        username,
        password,
      }),
    });
  },
  loginFacebook: async (token) => {
    const _url = `${url}/wp-json/api/flutter_user/fb_connect/?second=${cookieLifeTime}&access_token=${token}${secure}`;

    return request(_url);
  },
  loginSMS: async (token) => {
    const _url = `${url}/wp-json/api/flutter_user/sms_login/?access_token=${token}${secure}`;

    return request(_url);
  },
  appleLogin: async (email, fullName, username) => {
    const _url = `${url}/wp-json/api/flutter_user/apple_login?email=${email}&display_name=${fullName}&user_name=${username}${secure}`;

    return request(_url);
  },
  register: async ({
    username,
    email,
    firstName,
    lastName,
    password = undefined,
  }) => {
    try {
      const _url = `${url}/wp-json/api/flutter_user/register/`;

      const resp = await request(_url, {
        method: "POST",
        body: JSON.stringify({
          username,
          user_login: username,
          user_email: email,
          email,
          display_name: `${firstName} ${lastName}`,
          first_name: firstName,
          last_name: lastName,
          password,
          user_pass: password,
        }),
      });

      if (has(resp, "user_id")) {
        return resp;
      }

      return { error: get(resp, "message") || Languages.CanNotRegister };
    } catch (err) {
      error(err);
      return { error: err };
    }
  },
};

export default WPUserAPI;
