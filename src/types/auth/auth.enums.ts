export enum EUserServiceUserStatus {
  Active,
  Inactive,
  Pending,
  Suspended
}

export enum EUserServiceUserType {
  Admin,
  User,
  Zalo
}

export enum EAuthorizeZalo {
  UserInfo = "scope.userInfo",
  UserLocation = "scope.userLocation",
  UserPhonenumber = "scope.userPhonenumber",
}