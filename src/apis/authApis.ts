/* eslint-disable sort-keys */

import { authorize, getAccessToken, getPhoneNumber, getSetting, getUserInfo } from "zmp-sdk/apis";

import { IReqAuthorize, IResAuthorize, IResCatchAuthorize, IResCreateZaloProfile, IResCreateCustomer, IResGetPhoneToken, IResGetSetting, IResGetToken, IResUserInfoZalo, IResLocationZalo, IResGetPhoneInternal } from "@/types/auth/auth.types";
import { getErrorMessageZalo } from "@/utils/error";
import jwtAxios from "@/services/jwt-api";

const authApis = {
  // Api xin quyền người dùng, qua api của Zalo
  authorizeUserZalo: async (data: IReqAuthorize): Promise<IResAuthorize> => {
    try {
      const response = await authorize({ scopes: data.scopes });
      return {
        code: "000",
        message: "Thành công!",
        data: response
      }
    } catch (error) {
      // xử lý khi gọi api thất bại
      const err = error as IResCatchAuthorize;
      return {
        code: err?.code.toString() || "999",
        message: getErrorMessageZalo(err?.code),
        data: null
      }
    }
  },
  // Api lấy token sau khi đã có quyền từ người dùng, qua api của Zalo
  getAccessTokenZalo: async (): Promise<IResGetToken> => {
    try {
      const response = await getAccessToken();
      return {
        code: "000",
        message: "Thành công!",
        data: response
      }
    } catch (error) {
      // xử lý khi gọi api thất bại
      const err = error as IResCatchAuthorize;
      return {
        code: err?.code.toString() || "999",
        message: getErrorMessageZalo(err?.code),
        data: null
      }
    }
  },
  // Api lấy token sau khi đã có quyền từ người dùng, qua api của Zalo
  getSettingsZalo: async (): Promise<IResGetSetting> => {
    try {
      const response = await getSetting({});
      return {
        code: "000",
        message: "Thành công!",
        data: response
      }
    } catch (error) {
      // xử lý khi gọi api thất bại
      const err = error as IResCatchAuthorize;
      return {
        code: err?.code.toString() || "999",
        message: getErrorMessageZalo(err?.code),
        data: null
      }
    }
  },
  // Api lấy token số điện thoại, qua api của Zalo
  getPhoneToken: async (): Promise<IResGetPhoneToken> => {
    try {
      const response = await getPhoneNumber({});
      return {
        code: "000",
        message: "Thành công!",
        data: response.token
      }
    } catch (error) {
      // xử lý khi gọi api thất bại
      const err = error as IResCatchAuthorize;
      return {
        code: err?.code.toString() || "999",
        message: getErrorMessageZalo(err?.code),
        data: null
      }
    }
  },
  // Api lấy thông tin người dùng từ Zalo sau khi đã có quyền lấy thông tin
  getUserInfoZalo: async (): Promise<IResUserInfoZalo> => {
    try {
      const response = await getUserInfo();
      return {
        code: "000",
        message: "Thành công!",
        data: response
      }
    } catch (error) {
      // xử lý khi gọi api thất bại
      const err = error as IResCatchAuthorize;
      return {
        code: err?.code.toString() || "999",
        message: getErrorMessageZalo(err?.code),
        data: null
      }
    }
  },
  createZaloProfile: async (data: { accessToken: string; code: string }): Promise<IResCreateZaloProfile> => {
    const response = await jwtAxios.post<IResCreateZaloProfile>("/thirdParty/zalo/zalo-profile", data);
    return response.data;
  },
  createCustomer: async (data: {
    zaloId: string;
    fullName: string;
    phone: string;
    avatar: string;
    address: string;
  }): Promise<IResCreateCustomer> => {
    const response = await jwtAxios.post<IResCreateCustomer>("/customers/customer", data);
    return response.data;
  },
  checkCustomerExits: async (data: {
    zaloId: string;
    phone: string;
  }): Promise<IResCreateCustomer> => {
    const response = await jwtAxios.post<IResCreateCustomer>("/customers/check-customer-exits", data);
    return response.data;
  },
  postZaloLocation: async (data: { accessToken: string; code: string }): Promise<IResLocationZalo> => {
    const response = await jwtAxios.post<IResLocationZalo>("/thirdParty/zalo/zalo-location", data);
    return response.data;
  },
  getPhoneNumberInternal: async (data: { accessToken: string, phoneTokenCode: string }): Promise<IResGetPhoneInternal> => {
    try {
      const response = await jwtAxios.post<IResGetPhoneInternal>("/zalo/auth/get-phone-number", data);
      return response.data;
    } catch (error) {
      const err = error as IResCatchAuthorize;
      return {
        code: err?.code.toString() || "999",
        message: getErrorMessageZalo(err?.code),
        data: undefined
      }
    }
  }
};

export default authApis;
