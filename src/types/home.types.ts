// 1. Loại hình kinh doanh
export interface BusinessType {
  businessTypeCode: string;
  businessTypeName: string;
}
export interface BusinessTypeApiResponse {
  code: string;
  message: string;
  data: BusinessType[];
  traceId: string;
  timestamp: string;
  isSuccess: boolean;
}

// 2. ngành nghề kinh doanh
export interface MerchantCategory {
  merchantCategoryCode: string;
  merchantCategoryName: string;
}
export interface MerchantCategoryApiResponse {
  code: string;
  message: string;
  data: MerchantCategory[];
  traceId: string;
  timestamp: string;
  isSuccess: boolean;
}

// 3. Thông tin ngân hàng
export interface BankData {
  bankName: string;
  bankCode: string;
  bin: number;
}

export interface IBanksResponse {
  code: string;
  message: string;
  data: BankData[];
}

export interface PayloadNewStore {
  merchantName: string;
  businessRegistrationNo: string;
  businessRegistrationImageUrls: string[];
  businessAddress: string;
  ownerIdCardNumber: string;
  ownerName: string;
  email: string;
  phone: string;
  merchantType: string;
  provinceName: string;
  provinceCode: string;
  communeName: string;
  communeCode: string;
  streetAddress: string;
  latitude: string;
  longitude: string;
  exteriorImagesUrl: string[];
  interiorImagesUrl: string[];
  bankAccountNumber?: string;
  bankName?: string;
  bankAccountHolder?: string;
  ownerIdCardFrontUrl: string;
  ownerIdCardBackUrl: string;
  signedForm01AUrl: string;
  merchantCategoryCode: string;
  businessTypeCode: string;
  businessTypeName?: string;
  // Thêm
  zaloPhone?: string;
  settlementBankAccountNumber?: string;
  settlementBankName?: string;
  settlementBankAccountHolder?: string;
}
export interface INewStoreResponse {
  code: string;
  message: string;
  data: {
    merchantId: string;
    merchantCode: string;
    merchantBranchId: string;
    merchantBranchCode: string;
    isMerchantBranchActive: boolean;
  },
  traceId: string;
  timestamp: string;
  isSuccess: boolean
}

export interface IProvinceData {
  id: string;
  code: string;
  name: string;
  divisionType: string;
  communes: ICommunesData[];
}

export interface ICommunesData {
  id: string;
  code: string;
  name: string;
  divisionType: string;
}

export interface IProvinceWithCommunesRes {
  code: string;
  message: string;
  data: IProvinceData[];
}