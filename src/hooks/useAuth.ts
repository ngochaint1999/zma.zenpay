/* eslint-disable sort-keys */
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAtomValue, useSetAtom } from "jotai";

import authApis from "@/apis/authApis";
import { authAtom } from "@/atoms/authAtom";
import { commonAtom } from "@/atoms/commonAtom";
import { locationZaloMasterConfigState, phoneTokenMasterConfigState, settingMasterConfigState, tokenMasterConfigState } from "@/atoms/masterAtom";
import { EAuthorizeZalo } from "@/types/auth/auth.enums";
import { IAuthAtom } from "@/types/auth/auth.types";
import { getUserInfo, getLocation } from "zmp-sdk";
import { locationZaloAtom } from "@/atoms/landAtom";

interface UseAuthResult {
  authData: IAuthAtom;
  locationZalo?: boolean;
  onLoginZalo: () => Promise<void>;
  setAuth: (dataAuth: IAuthAtom) => void;
  onGetLocation: () => Promise<void>;
}
/**
 * Auth hook
 */
export function useAuth(): UseAuthResult {
  const setAuth = useSetAtom(authAtom);
  const setLoading = useSetAtom(commonAtom);
  const authData = useAtomValue(authAtom);
  const masterSettingZalo = useAtomValue(settingMasterConfigState);
  const masterTokenZalo = useAtomValue(tokenMasterConfigState);
  const masterPhoneTokenZalo = useAtomValue(phoneTokenMasterConfigState);
  const locationZalo = useAtomValue(locationZaloMasterConfigState);
  const setLocationZaloAtom = useSetAtom(locationZaloAtom);

  const setAuthData = (phoneToken: string, zaloToken: string) => {
    setAuth({
      ...authData,
      phoneToken,
      zaloToken,
    });
  };

  const handleError = (code: string, message: string, api: string) => {
    // Lưu thông tin mã lỗi và API vào thông báo lỗi
    toast.error(`Mã lỗi: ${code} - API: ${api} - ${message}`);
  };

  const onGetPhoneAndZaloToken = async () => {
    setLoading({ loading: true });
    try {
      const [resZaloToken, resPhoneToken] = await Promise.all([
        authApis.getAccessTokenZalo(),
        authApis.getPhoneToken(),
      ]);
      if (resZaloToken.code !== '000') {
        handleError('Z-001', resZaloToken.message, 'getAccessTokenZalo');
      }
      if (resPhoneToken.code !== '000') {
        handleError('Z-002', resPhoneToken.message, 'getPhoneToken');
      }

      setAuthData(resPhoneToken?.data || '', resZaloToken?.data || '');
      await onGetUserInfo(resZaloToken?.data || '', resPhoneToken?.data || '');
    } catch (err: any) {
      handleError('A-ERR', err?.message, 'onGetPhoneAndZaloToken');
    } finally {
      setLoading({ loading: false });
    }
  };

  const onGetUserInfo = async (zaloToken: string, phoneToken: string) => {
    setLoading({ loading: true });
    try {
      const { code, data, message } = await authApis.createZaloProfile({
        accessToken: zaloToken,
        code: phoneToken,
      });

      if (code !== '00' || !data?.number) {
        handleError('I', message, 'createZaloProfile');
        return;
      }

      const { userInfo } = await getUserInfo({ autoRequestPermission: true });
      const { code: codeCheckCustomer, data: dataCheckCustomer } =
        await authApis.checkCustomerExits({
          phone: data?.number,
          zaloId: userInfo.id,
        });

      if (codeCheckCustomer === '00') {
        localStorage.setItem("token", dataCheckCustomer.token);
        setAuth({
          ...authData,
          accessToken: dataCheckCustomer.token,
          refreshToken: dataCheckCustomer.refreshToken,
          user: {
            id: dataCheckCustomer.id,
            phoneNumber: data?.number,
          },
        });
        toast.success('Đăng nhập thành công, bạn hãy tiếp tục!');
      } else {
        const { code, data: dataCus, message } = await authApis.createCustomer({
          address: '',
          avatar: userInfo.avatar,
          fullName: userInfo.name,
          phone: data?.number,
          zaloId: userInfo.id,
        });

        if (code === '00' && dataCus.token) {
          localStorage.setItem("token", dataCus.token);
          setAuth({
            ...authData,
            accessToken: dataCus.token,
            refreshToken: dataCus.refreshToken,
            user: {
              id: dataCus.id,
              phoneNumber: data?.number,
            },
          });
          toast.success('Đăng nhập thành công, bạn hãy tiếp tục!');
        } else {
          handleError('I', message, 'createCustomer');
        }
      }
    } catch (err: any) {
      handleError('A-ERR', err?.message, 'onGetUserInfo');
    } finally {
      setLoading({ loading: false });
    }
  };

  const onLoginZalo = async () => {
    const res = await authApis.authorizeUserZalo({
      scopes: [EAuthorizeZalo.UserInfo, EAuthorizeZalo.UserPhonenumber],
    });
    if (res.code === '000') {
      await onGetPhoneAndZaloToken();
    } else {
      toast.error(res.message);
    }
  };

  const onGetLocation = async () => {
    setLoading({ loading: true });
    const { data: dataAccess } = await authApis.getAccessTokenZalo();
    if (!dataAccess) return setLoading({ loading: false });;
    const { token } = await getLocation();
    if (!token) return setLoading({ loading: false });;
    const { code, data, message } = await authApis.postZaloLocation({
      accessToken: dataAccess,
      code: token,
    });
    if (code === '00') {
      setLocationZaloAtom(data);
    } else {
      handleError('L-ERR', message, 'getLocationZalo');
    }
    setLoading({ loading: false });
  }

  useEffect(() => {
    if (
      masterSettingZalo?.authSetting?.['scope.userInfo'] &&
      masterTokenZalo &&
      masterPhoneTokenZalo &&
      !authData?.user?.id
    ) {
      void onGetUserInfo(masterTokenZalo, masterPhoneTokenZalo);
    }
  }, [authData, masterSettingZalo, masterTokenZalo, masterPhoneTokenZalo]);

  return {
    authData,
    locationZalo,
    onLoginZalo,
    setAuth,
    onGetLocation
  };
}