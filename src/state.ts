/* eslint-disable no-promise-executor-return */
/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { Cart, Category, Product } from "./types";

import { requestWithFallback } from "@/utils/request";


export const cartState = atom<Cart>([]);

export const categoriesState = atom(() =>
  requestWithFallback<Category[]>("/categories", [])
);
export const productState = atomFamily((id: number) =>
  atom(async (get) => {
    const products = await get(productsState);
    return products.find((product) => product.id === id);
  })
);

export const productsState = atom(async (get) => {
  const categories = await get(categoriesState);
  const products = await requestWithFallback<
    (Product & { categoryId: number })[]
  >("/products", []);
  return products.map((product) => ({
    ...product,
    category: categories.find(
      (category) => category.id === product.categoryId
    )!,
  }));
});

export const tabsState = atom(["Đơn hàng", "Đặt lịch"]);
export const selectedTabIndexState = atom(0);
export const keywordState = atom("");
export const recommendedProductsState = atom((get) => get(productsState));


export const searchResultState = atom(async (get) => {
  const keyword = get(keywordState);
  const products = await get(productsState);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return products.filter((product) =>
    product.name.toLowerCase().includes(keyword.toLowerCase())
  );
});