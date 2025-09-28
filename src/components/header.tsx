/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable consistent-return */
import { useMemo } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { BackIcon, BellNotificationIcon, ChevronDown, ChevronLeftIcon, CloseIcon } from "./vectors";

import { useRouteHandle } from "@/hooks";
import { cn } from "@/lib/utils";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [handle, match] = useRouteHandle();

  const title = useMemo(() => {
    if (handle) {
      if (typeof handle.title === "function") {
        return handle.title({ params: match.params });
      }
      return handle.title;

    }
  }, [handle]);

  if (handle?.hide) return null;

  const showBack = location.key !== "default" && handle?.back !== false;
  const showClose = location.key !== "default" && handle?.close !== false;

  if (handle?.logo) {
    return (
      <div className="h-20 pb-2 w-full flex flex-col justify-end items-start gap-y-2 px-4 pr-[106px]">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-200">
              <span className="text-xs">◎</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium">Chi nhánh Cầu Giấy</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </div>
          </div>

          <BellNotificationIcon />
        </div>

        <div className="h-[32px] bg-[#F2F3F5] py-1 px-2 rounded-full flex items-center gap-x-1">
          <img src="/icons/rank-base.svg" alt="rank" className="size-6" />
          <div className="min-w-[1px] min-h-[18px] bg-[#D1D6D6]" />
          <p className="text-[#2E3231] text-2xs font-semibold">128,254</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-12 w-full flex flex-col justify-end pl-4 pr-[106px] py-2 space-x-1">
      <div className="w-full flex items-center">
        {showBack && (
          <div className="p-2 cursor-pointer" onClick={() => handle?.isBackHome === true ? void navigate("/home", { replace: true }) : void navigate(-1)}>
            <ChevronLeftIcon />
          </div>
        )}
        {showClose && (
          <div className="p-2 cursor-pointer" onClick={() => handle?.isBackHome === true ? void navigate("/home", { replace: true }) : void navigate(-1)}>
            <CloseIcon />
          </div>
        )}
        <div
          className={
            cn("font-medium truncate",
              handle?.titleSize ? "" : "text-4xl"
            )}
          style={{ fontSize: handle?.titleSize }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}
