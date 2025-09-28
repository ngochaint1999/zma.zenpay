/* eslint-disable sort-keys */
import toast from "react-hot-toast";
import { useAtomValue, useSetAtom } from "jotai";

import authApis from "@/apis/authApis";
import { authAtom } from "@/atoms/authAtom";
import { commonAtom } from "@/atoms/commonAtom";
import { EAuthorizeZalo } from "@/types/auth/auth.enums";
import { IAuthAtom } from "@/types/auth/auth.types";
import { getSetting } from "zmp-sdk";
import { useEffect } from "react";
import jwtAxios from "@/services/jwt-api";

interface UseAuthResult {
  authData: IAuthAtom;
  setAuth: (dataAuth: IAuthAtom) => void;
  onLogin: () => Promise<void>;
}
/**
 * Auth hook
 */
export function useAuth(): UseAuthResult {
  const authData = useAtomValue(authAtom);
  const setAuth = useSetAtom(authAtom);
  const setLoading = useSetAtom(commonAtom);

  const onGetToken = async () => {
    setLoading({ loading: true });
    const resZaloToken = await authApis.getAccessTokenZalo();
    const resPhoneToken = await authApis.getPhoneToken();
    const res = await authApis.getPhoneNumberInternal({
      accessToken: resZaloToken?.data || "",
      phoneTokenCode: resPhoneToken?.data || ""
    });
    if (res.data?.userPhoneNumber) {
      jwtAxios.defaults.headers.common["Authorization"] = `Bearer ${res.data?.token?.accessToken || ""}`;
      setAuth({
        accessToken: res.data?.token?.accessToken || "",
        refreshToken: "",
        userPhoneNumber: res.data.userPhoneNumber,
        branches: res.data?.branches || [],
      });
    } else {
      toast.error(res?.message || "Lỗi hệ thống, vui lòng thử lại sau");
    }
    setLoading({ loading: false });
  }

  const onLogin = async () => {
    const ress = await authApis.authorizeUserZalo({
      scopes: [
        EAuthorizeZalo.UserInfo,
        EAuthorizeZalo.UserPhonenumber
      ]
    });
    if (ress.code === "000") {
      onGetToken();
    } else {
      toast.error(ress?.message || "Lỗi hệ thống, vui lòng thử lại sau");
    }
  }

  const onCheckLogin = async () => {
    if (authData?.accessToken) return;
    const { authSetting } = await getSetting();
    if (authSetting["scope.userInfo"] && authSetting["scope.userPhonenumber"]) {
      await onGetToken();
    } else {
      return;
      // const ress = await authApis.authorizeUserZalo({
      //   scopes: [
      //     EAuthorizeZalo.UserInfo,
      //     EAuthorizeZalo.UserPhonenumber
      //   ]
      // });
      // if (ress.code === "000") {
      //   onLogin();
      // } else {
      //   toast.error(ress?.message || "Lỗi hệ thống, vui lòng thử lại sau");
      // }
    }
  }

  useEffect(() => {
    onCheckLogin();
  }, [])
  return {
    authData,
    setAuth,
    onLogin,
  };
}