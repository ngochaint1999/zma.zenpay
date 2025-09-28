/* eslint-disable @typescript-eslint/no-explicit-any */
import { BankData, BusinessType, BusinessTypeApiResponse, IBanksResponse, INewStoreResponse, IProvinceData, IProvinceWithCommunesRes, ISummaryRes, MerchantCategory, MerchantCategoryApiResponse, PayloadNewStore } from "@/types/home.types";
import jwtAxios from "./jwt-api";

// 1. Loại hình kinh doanh
export const getBusinessTypes = async (): Promise<BusinessType[]> => {
  const res = await jwtAxios.get<BusinessTypeApiResponse>("/merchants/business-types"); // đổi URL thật
  if (res.data.isSuccess && Array.isArray(res.data.data)) {
    return res.data.data;
  }
  throw new Error(res.data.message || "API lỗi");
};

// 2. Ngành nghề kinh doanh
export const getMerchantCategories = async (): Promise<MerchantCategory[]> => {
  const res = await jwtAxios.get<MerchantCategoryApiResponse>("/merchants/merchant-categories"); // đổi URL thật
  if (res.data.isSuccess && Array.isArray(res.data.data)) {
    return res.data.data;
  }
  throw new Error(res.data.message || "API lỗi");
};

export async function getTaxInfo(taxNumber: string): Promise<any> {
  // Thay url thật của bạn
  const res = await jwtAxios.get(`/merchants/tax-info/lookup/${taxNumber}`);
  if (res.data.isSuccess && res.data.data) {
    return res.data.data; // object: { merchantName, ownerName, businessAddress, ...}
  }
  throw new Error(res.data.message || "Không tìm thấy thông tin");
}

export const getBanks = async (): Promise<BankData[]> => {
  const res = await jwtAxios.get<IBanksResponse>("/merchants/bank-info"); // đổi URL thật
  if (res.data.code === "00" && Array.isArray(res.data.data)) {
    return res.data.data;
  }
  throw new Error(res.data.message || "API lỗi");
};
export const postNewStore = async (payload: PayloadNewStore) => {
  const res = await jwtAxios.post<INewStoreResponse>("/merchants/register", payload);
  return res.data; // Trả về phần data đã login thành công
};

// Upload single file
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await jwtAxios.post<{ data: { fileKey: string, fileUrl: string } }>("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log(res)
  if (res?.data?.data?.fileUrl) return res?.data?.data.fileUrl;
  throw new Error("Lỗi upload file");
}

// Upload array of files, trả về array url
export async function uploadFiles(files: File[]): Promise<string[]> {
  return Promise.all(files.map(uploadFile));
}

// Lấy danh sách tỉnh thành
export const getProvinceWithCommunes = async (): Promise<IProvinceData[]> => {
  const res = await jwtAxios.get<IProvinceWithCommunesRes>("/administrative-units/province-with-communes"); // đổi URL thật
  if (res.data.code === "00" && Array.isArray(res.data.data)) {
    return res.data.data;
  }
  throw new Error(res.data.message || "API lỗi");
};

// Lấy thống kê Dashboard
export const getDashboardStatistics = async (
  dataQuery: { fromDate: string; toDate: string }
): Promise<ISummaryRes> => {
  const res = await jwtAxios.get<ISummaryRes>("/order/summary", { params: dataQuery }); // đổi URL thật
  if (res.data.isSuccess) {
    return res.data;
  }
  throw new Error(res.data.message || "API lỗi");
};
