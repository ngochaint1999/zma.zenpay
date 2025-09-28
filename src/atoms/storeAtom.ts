// Lưu trữ thông tin cửa hàng khi tạo
import { atom } from "jotai";
import type { PayloadNewStore } from "@/types/home.types";

export const newStoreAtom = atom<PayloadNewStore | null>(null);

// Lưu trữ thông tin đã điền trong form tạo cửa hàng
export const newStoreFormAtom = atom<Partial<PayloadNewStore>>({});