import { createCookie } from "react-router";
import { CSRF } from "remix-utils/csrf/server";

if (!process.env.VITE_CSRF_COOKIE_SECRET || !process.env.VITE_CSRF_SECRET) {
  throw new Error("VITE_CSRF_COOKIE_SECRET and VITE_CSRF_SECRET must be set");
}

export const cookie = createCookie("csrf", {
  path: "/",
  httpOnly: true,
  secure: process.env.VITE_NODE_ENV === "production",
  sameSite: "lax",
  secrets: [process.env.VITE_CSRF_COOKIE_SECRET!],
});

export const csrf = new CSRF({
  cookie,
  // what key in FormData objects will be used for the token, defaults to `csrf`
  formDataKey: "csrf",
  // an optional secret used to sign the token, recommended for extra safety
  secret: process.env.VITE_CSRF_SECRET,
});
