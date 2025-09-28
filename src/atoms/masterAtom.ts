/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-promise-executor-return */
import { atom } from "jotai";

// import { atomFamily } from "jotai/utils";
import authApis from "@/apis/authApis";

export const settingZaloState = atom(async () => {
  const settingZalo = await authApis.getSettingsZalo();

  return settingZalo.data;
});

export const tokenZaloState = atom(async () => {
  const tokenZalo = await authApis.getAccessTokenZalo();

  return tokenZalo.data;
});

export const phoneTokenZaloState = atom(async () => {
  const phoneTokenZalo = await authApis.getPhoneToken();

  return phoneTokenZalo.data;
});

export const userInfoZaloConfigState = atom(async () => {
  const userInfo = await authApis.getUserInfoZalo();

  return userInfo.data;
});

// ======================
export const settingMasterConfigState = atom(async (get) => {
  const settingZalo = await get(settingZaloState);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return settingZalo
})
export const tokenMasterConfigState = atom(async (get) => {
  const settingZalo = await get(settingMasterConfigState);
  if (settingZalo?.authSetting["scope.userInfo"] === true) {
    const tokenZalo = await get(tokenZaloState);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    return tokenZalo
  }
  return null;
})
export const phoneTokenMasterConfigState = atom(async (get) => {
  const settingZalo = await get(settingMasterConfigState);
  if (settingZalo?.authSetting["scope.userPhonenumber"] === true) {
    const phoneTokenZalo = await get(phoneTokenZaloState);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return phoneTokenZalo
  }
  return null;
})
export const userInfoZaloMasterConfigState = atom(async (get) => {
  const settingZalo = await get(settingMasterConfigState);
  if (settingZalo?.authSetting["scope.userInfo"] === true) {
    const userInfo = await get(userInfoZaloConfigState);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return userInfo
  }
  return null
})

export const locationZaloMasterConfigState = atom(async (get) => {
  const settingZalo = await get(settingMasterConfigState);
  return settingZalo?.authSetting["scope.userLocation"]
})