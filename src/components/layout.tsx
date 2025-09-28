import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import Footer from "./footer";
import Header from "./header";
import { ScrollRestoration } from "./scroll-restoration";
import { PageSkeleton } from "./skeleton";
import AppLoading from "./app-loading";
import { useAtomValue } from "jotai";
import { commonAtom } from "@/atoms/commonAtom";

export default function Layout() {
  const { loading } = useAtomValue(commonAtom);

  return (
    <div className="w-screen h-screen flex flex-col bg-background text-foreground overflow-hidden relative">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
      <Toaster
        containerClassName="toast-container"
        containerStyle={{
          top: "calc(5%)",
        }}
      />
      
      <ScrollRestoration />
      {loading ? <AppLoading /> : null}
    </div>
  );
}
