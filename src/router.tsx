/* eslint-disable sort-keys */

import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/layout";
import HomePage from "./pages/home";
import { getBasePath } from "./utils/zma";
import CreateStorePage from "./pages/store/create";
import CreateStoreBankInfoPage from "./pages/store/bank-info";
import CreateStoreDocumentsPage from "./pages/store/documents";
import CreateStoreCheckInfoPage from "./pages/store/check-info";
import OrderCreatePage from "./pages/order/create";
import PayPage from "./pages/pay";
import OrderListPage from "./pages/order/list";
import SettingPage from "./pages/setting";
import ProductsPage from "./pages/products";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Navigate to="/store/create" replace />,
        },
        {
          path: "/home",
          element: <HomePage />,
          handle: {
            title: "ZenShop",
            logo: false,
            back: false,
            close: false,
            titleSize: 18,
          },
        },
        // Bước 1 tạo cửa hàng
        {
          path: "/store/create",
          element: <CreateStorePage />,
          handle: {
            title: "ZenShop",
            logo: false,
            back: true,
            close: false,
            footer: false,
            titleSize: 18,
          },
        },
        // Bước 2 thông tin ngân hàng
        {
          path: "/store/bank-info",
          element: <CreateStoreBankInfoPage />,
          handle: {
            title: "ZenShop",
            logo: false,
            back: true,
            close: false,
            footer: false,
            titleSize: 18,
          },
        },
        // Bước 3 tài liệu đính kèm
        {
          path: "/store/documents",
          element: <CreateStoreDocumentsPage />,
          handle: {
            title: "ZenShop",
            logo: false,
            back: true,
            close: false,
            footer: false,
            titleSize: 18,
          },
        },
        // Bước 4 kiểm tra thông tin
        {
          path: "/store/check-info",
          element: <CreateStoreCheckInfoPage />,
          handle: {
            title: "ZenShop",
            logo: false,
            back: true,
            close: false,
            footer: false,
            titleSize: 18,
          },
        },
        {
          path: "/order/create",
          element: <OrderCreatePage />,
          handle: {
            title: "Tạo đơn hàng",
            logo: false,
            back: true,
            close: false,
            footer: false,
            titleSize: 18,
          },
        },
        {
          path: "/pay",
          element: <PayPage />,
          handle: {
            title: "Thanh toán",
            logo: false,
            back: true,
            close: false,
            footer: false,
            titleSize: 18,
          },
        },
        {
          path: "/orders",
          element: <OrderListPage />,
          handle: {
            title: "Danh sách đơn hàng",
            logo: false,
            back: false,
            close: false,
            titleSize: 18,
          },
        },
        {
          path: "/products",
          element: <ProductsPage />,
          handle: {
            title: "Danh sách sản phẩm",
            logo: false,
            back: false,
            close: false,
            titleSize: 18,
          },
        },
        {
          path: "/setting",
          element: <SettingPage />,
          handle: {
            title: "Cài đặt",
            logo: false,
            back: false,
            close: false,
            titleSize: 18,
          },
        },
      ]
    }
  ],
  { basename: getBasePath() }
)

export default router;