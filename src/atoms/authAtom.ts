/* eslint-disable sort-keys */
import { atom } from "jotai";

import { IAuthAtom } from "@/types/auth/auth.types";

// Atom lưu danh sách auth
export const authAtom = atom<IAuthAtom>({
  zaloToken: "",
  accessToken: "",
  accessTokenExpiry: "",
  refreshToken: "",
  refreshTokenExpiry: "",
  phoneToken: "",
  user: null
});