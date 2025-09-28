import { EAuthorizeZalo, EUserServiceUserStatus, EUserServiceUserType } from "./auth.enums";

// Data Interfaces
export interface IUser {
  id?: string;
  phoneNumber?: string;
}
interface ICatchAuthorize {
  api: string;
  code: number;
  message: string;
}

// Request Interfaces
export interface IReqAuthorize {
  scopes: EAuthorizeZalo[];
}
export interface IReqZaloLogin {
  tenantId: string;
  token: string;
}

// Response Interfaces
export interface IResBase {
  code: string;
  message: string;
}
export interface IResAuthorize extends IResBase {
  data: Partial<Record<EAuthorizeZalo, boolean>> | null;
}
export interface IResGetToken extends IResBase {
  data: string | null;
}
export interface IResGetPhoneToken extends IResBase {
  data?: string | null;
}
export interface IResGetPhoneInternal extends IResBase {
  data?: {
    userPhoneNumber: string;
  } | null
}
export interface IResGetSetting extends IResBase {
  data: {
    authSetting: Partial<Record<EAuthorizeZalo, boolean>>;
  } | null;
}
export interface IResUserInfoZalo extends IResBase {
  data: {
    userInfo: {
      id: string;
      name: string;
      avatar: string;
      idByOA?: string;
      isSensitive?: boolean;
      followedOA?: boolean;
    }
  } | null;
}
export interface IResCatchAuthorize extends ICatchAuthorize { };
export interface IResZaloLogin {
  accessToken: string;
  accessTokenExpiry: string;
  refreshToken: string;
  refreshTokenExpiry: string;
  user: IUser | null;
}

// Atom Data
export interface IAuthAtom extends IResZaloLogin {
  zaloToken: string;
  phoneToken: string;
}
export interface IResCreateZaloProfile {
  code: string;
  message: string;
  data: { number: string };
}
export interface IResCreateCustomer {
  code: string;
  message: string;
  data: {
    id: string;
    fullName: string;
    phone: string;
    address: string;
    customerId: string;
    customerType: string;
    token: string;
    refreshToken: string;
  };
}
export interface IResLocationZalo {
  code: string;
  message: string;
  data: {
    provider: string,
    latitude: string,
    longitude: string,
    timestamp: string
  };
}