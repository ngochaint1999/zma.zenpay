import React from "react";
import Logo from "../../static/icons/logo.svg";
import Gold from "../../static/images/gold.png";
import { useNavigate } from "react-router-dom";
import { openMediaPicker } from "zmp-sdk";
import { BaseAPI } from "@/services/jwt-api";
import toast from "react-hot-toast";
import { newStoreFormAtom } from "@/atoms/storeAtom";
import { useAtom } from "jotai";

/* ---------------- Sample data (replace with real images) ---------------- */

export default function CreateStoreDocumentsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useAtom(newStoreFormAtom);
  const [showBottomSheet, setShowBottomSheet] = React.useState(false);
  const [cccdFrontUrl, setCccdFrontUrl] = React.useState<string>(formData?.ownerIdCardFrontUrl || "");
  const [cccdBackUrl, setCccdBackUrl] = React.useState<string>(formData?.ownerIdCardBackUrl || "");
  const [businessLicenseUrls, setBusinessLicenseUrls] = React.useState<string[]>(formData?.businessRegistrationImageUrls || []);
  const [productImages, setProductImages] = React.useState<string[]>(formData?.interiorImagesUrl || []);
  const [storeImages, setStoreImages] = React.useState<string[]>(formData?.exteriorImagesUrl || []);
  const [currentUploadType, setCurrentUploadType] = React.useState<"cccd-front" | "cccd-back" | "business-license" | "product-images" | "store-images" | "other">("other");


  const getMaxSelectItems = (uploadType: string) => {
    switch (uploadType) {
      case "cccd-front":
      case "cccd-back":
        return 1; // CCCD chỉ chọn 1 ảnh
      case "business-license":
        return Math.max(0, 5 - businessLicenseUrls.length); // Tối đa 5 ảnh
      case "product-images":
        return Math.max(0, 5 - productImages.length); // Tối đa 5 ảnh
      case "store-images":
        return Math.max(0, 5 - storeImages.length); // Tối đa 5 ảnh
      default:
        return 1;
    }
  };

  const onNextPage = () => {
    // Tất cả loại hình ảnh ít nhất 1 hình
    if (!cccdFrontUrl) return toast.error("Vui lòng thêm ảnh CCCD mặt trước");
    if (!cccdBackUrl) return toast.error("Vui lòng thêm ảnh CCCD mặt sau");
    if (!businessLicenseUrls) return toast.error("Vui lòng thêm ảnh giấy phép kinh doanh");
    if (productImages.length === 0) return toast.error("Vui lòng thêm ảnh sản phẩm");
    if (storeImages.length === 0) return toast.error("Vui lòng thêm ảnh cửa hàng");

    setFormData(prev => ({
      ...prev,
      ownerIdCardFrontUrl: cccdFrontUrl,
      ownerIdCardBackUrl: cccdBackUrl,
      exteriorImagesUrl: storeImages,
      interiorImagesUrl: productImages,
      businessRegistrationImageUrls: businessLicenseUrls
    }));
    return navigate("/store/check-info");
  }
  const handleOpenMediaPicker = async (type: "photo" | "video" | "zcamera" | "zcamera_photo" | "zcamera_video" | "zcamera_scan" | "file", maxSelectItem: number, uploadType?: "cccd-front" | "cccd-back" | "business-license" | "product-images" | "store-images" | "other") => {
    try {
      const { data }: { data: any } = await openMediaPicker({
        maxSelectItem,
        serverUploadUrl: `${BaseAPI}/zalo/upload-media`,
        type,
        maxItemSize: 5 * 1024 * 1024, // 5MB
      });
      const result = JSON.parse(data);
      if (result?.data?.urls?.length > 0) {
        // Xử lý theo loại upload
        if (uploadType === "cccd-front") {
          const imageUrl = result.data.urls[0]; // Chỉ lấy ảnh đầu tiên
          setCccdFrontUrl(imageUrl);
        } else if (uploadType === "cccd-back") {
          const imageUrl = result.data.urls[0]; // Chỉ lấy ảnh đầu tiên
          setCccdBackUrl(imageUrl);
        } else if (uploadType === "business-license") {
          const imageUrls = result.data.urls; // Lấy tất cả ảnh
          setBusinessLicenseUrls(prev => {
            const remainingSlots = 5 - prev.length;
            if (remainingSlots <= 0) {
              console.warn("Đã đạt giới hạn tối đa 5 ảnh giấy phép kinh doanh");
              return prev;
            }
            return [...prev, ...imageUrls.slice(0, remainingSlots)];
          });
        } else if (uploadType === "product-images") {
          const imageUrls = result.data.urls; // Lấy tất cả ảnh
          setProductImages(prev => {
            const remainingSlots = 5 - prev.length;
            if (remainingSlots <= 0) {
              console.warn("Đã đạt giới hạn tối đa 5 ảnh sản phẩm");
              return prev;
            }
            return [...prev, ...imageUrls.slice(0, remainingSlots)];
          });
        } else if (uploadType === "store-images") {
          const imageUrls = result.data.urls; // Lấy tất cả ảnh
          setStoreImages(prev => {
            const remainingSlots = 5 - prev.length;
            if (remainingSlots <= 0) {
              console.warn("Đã đạt giới hạn tối đa 5 ảnh mặt tiền cửa hàng");
              return prev;
            }
            return [...prev, ...imageUrls.slice(0, remainingSlots)];
          });
        } console.log("Selected media:", result);
        console.log("Upload type:", uploadType, "URLs:", result.data.urls);
      }
    } catch (error) {
      console.error("Error opening media picker:", error);
    }
  }
  return (
    <div className="mx-auto w-full bg-white text-[#141518]">

      {/* Hero / Brand */}
      <div
        style={{
          background: `url(${Gold})`,
          backgroundRepeat: 'no-repeat',
          backgroundPositionY: -70,
          backgroundPositionX: 'right'
        }}
        className="relative overflow-hidden px-4 pt-5">
        <div className="mb-6">
          <img src={Logo} className="w-[108px] h-auto" />
        </div>
        <h1 className="mb-1 text-[34px] font-extrabold leading-tight tracking-tight">Tạo cửa hàng</h1>
        <p className="mb-6 max-w-[28ch] text-[15px] text-[#6b7280]">
          Cửa hàng sẽ được tạo theo thông tin bạn cung cấp
        </p>
        {/* Steps bubbles */}
        <div className="mb-3 flex items-start gap-4 overflow-hidden">
          <div className="w-[180px]">
            <StepPill active>3/4</StepPill>
            <div className="mb-2 text-[15px] font-semibold mt-3 text-nowrap">Tài liệu đính kèm</div>
            <div className="mb-3 text-[13px] text-[#6b7280]">Tài liệu, hình ảnh xác thực cửa hàng</div>
          </div>
          <div className="h-[1px] border-b border-dashed border-[#94A3B8] min-w-[56px] my-auto" />
          <div>
            <StepPill>4/4</StepPill>
            <div className="mb-2 text-[15px] font-semibold mt-3 text-nowrap">Kiểm tra thông tin</div>
            <div className="mb-3 text-[13px] text-[#6b7280]">Hãy chắc chắn mọi thông tin chính xác</div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-20 top-16 h-32 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(255,165,0,0.25),transparent)]" />
      </div>

      {/* Form */}
      <div className="space-y-3 px-4">

        <SectionTitle>CCCD mặt trước & mặt sau của người đại diện</SectionTitle>
        <div className="mb-6 grid grid-cols-2 gap-3">
          <UploadBox
            label="Chụp ảnh CC mặt trước"
            imageUrl={cccdFrontUrl}
            onPress={() => {
              setCurrentUploadType("cccd-front");
              setShowBottomSheet(true);
            }}
            onDelete={() => setCccdFrontUrl("")}
          />
          <UploadBox
            label="Chụp ảnh CC mặt sau"
            imageUrl={cccdBackUrl}
            onPress={() => {
              setCurrentUploadType("cccd-back");
              setShowBottomSheet(true);
            }}
            onDelete={() => setCccdBackUrl("")}
          />
        </div>


        {/* Section: Giấy phép kinh doanh */}
        <div className="mb-6 mt-5 flex items-center justify-between gap-1">
          <div className="text-[15px] font-semibold text-[#374151] pr-2">
            Hình gốc giấy phép kinh doanh
          </div>
          <UploadButton
            label={businessLicenseUrls.length >= 5 ? "Đã đủ 5 ảnh" : "Chụp ảnh giấy phép"}
            disabled={businessLicenseUrls.length >= 5}
            onPress={() => {
              setCurrentUploadType("business-license");
              setShowBottomSheet(true);
            }}
          />
        </div>
        {businessLicenseUrls.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-3">
            {businessLicenseUrls.map((url, index) => (
              <div key={index} className="relative h-32 rounded-2xl border-2 border-[#101828] bg-white overflow-hidden">
                <img src={url} alt="Giấy phép kinh doanh" className="h-full w-full object-cover" />
                <div className="absolute left-0 top-0 h-0 w-0 border-l-[14px] border-b-[14px] border-l-[#101828] border-b-transparent" />
                <button
                  className="absolute right-2 top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#EF4444] text-white shadow-md hover:bg-[#DC2626]"
                  onClick={() => setBusinessLicenseUrls(prev => prev.filter((_, i) => i !== index))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M13.7724 13.773C14.0653 13.4801 14.0653 13.0052 13.7724 12.7123L10.0606 9.00054L13.7735 5.28772C14.0664 4.99482 14.0664 4.51995 13.7735 4.22706C13.4806 3.93416 13.0057 3.93416 12.7128 4.22706L8.99999 7.93988L5.28717 4.22706C4.99427 3.93416 4.5194 3.93416 4.22651 4.22706C3.93361 4.51995 3.93361 4.99482 4.22651 5.28772L7.93933 9.00054L4.22752 12.7123C3.93463 13.0052 3.93463 13.4801 4.22752 13.773C4.52042 14.0659 4.99529 14.0659 5.28819 13.773L8.99999 10.0612L12.7118 13.773C13.0047 14.0659 13.4796 14.0659 13.7724 13.773Z" fill="white" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}


        {/* Section: Ảnh quầy hàng, sản phẩm */}
        <div className="mb-6 mt-5 flex items-center justify-between gap-1">
          <div className="text-[15px] font-semibold text-[#374151] pr-2">
            Ảnh quầy hàng, <br /> sản phẩm
          </div>
          <UploadButton
            label={productImages.length >= 5 ? "Đã đủ 5 ảnh" : "Chụp ảnh sản phẩm"}
            disabled={productImages.length >= 5}
            onPress={() => {
              setCurrentUploadType("product-images");
              setShowBottomSheet(true);
            }}
          />
        </div>
        {productImages.length > 0 && (
          <div className="mb-6 grid grid-cols-3 gap-3">
            {productImages.map((imageUrl, index) => (
              <div key={index} className="relative h-32 rounded-2xl border-2 border-[#101828] bg-white overflow-hidden">
                <img src={imageUrl} alt={`Sản phẩm ${index + 1}`} className="h-full w-full object-cover" />
                <div className="absolute left-0 top-0 h-0 w-0 border-l-[14px] border-b-[14px] border-l-[#101828] border-b-transparent" />
                <button
                  className="absolute right-2 top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#EF4444] text-white shadow-md hover:bg-[#DC2626]"
                  onClick={() => setProductImages(prev => prev.filter((_, i) => i !== index))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M13.7724 13.773C14.0653 13.4801 14.0653 13.0052 13.7724 12.7123L10.0606 9.00054L13.7735 5.28772C14.0664 4.99482 14.0664 4.51995 13.7735 4.22706C13.4806 3.93416 13.0057 3.93416 12.7128 4.22706L8.99999 7.93988L5.28717 4.22706C4.99427 3.93416 4.5194 3.93416 4.22651 4.22706C3.93361 4.51995 3.93361 4.99482 4.22651 5.28772L7.93933 9.00054L4.22752 12.7123C3.93463 13.0052 3.93463 13.4801 4.22752 13.773C4.52042 14.0659 4.99529 14.0659 5.28819 13.773L8.99999 10.0612L12.7118 13.773C13.0047 14.0659 13.4796 14.0659 13.7724 13.773Z" fill="white" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}


        {/* Section: Ảnh mặt tiền cửa hàng */}
        <div className="mb-6 mt-5 flex items-center justify-between gap-1">
          <div className="text-[15px] font-semibold text-[#374151] pr-2">
            Ảnh mặt tiền cửa hàng
          </div>
          <UploadButton
            label={storeImages.length >= 5 ? "Đã đủ 5 ảnh" : "Chụp ảnh mặt bằng"}
            disabled={storeImages.length >= 5}
            onPress={() => {
              setCurrentUploadType("store-images");
              setShowBottomSheet(true);
            }}
          />
        </div>
        <TipBanner text="Chụp ảnh có thể thấy rõ bảng hiệu và địa chỉ cửa hàng" />
        {storeImages.length > 0 && (
          <div className="mb-6 grid grid-cols-3 gap-3">
            {storeImages.map((imageUrl, index) => (
              <div key={index} className="relative h-32 rounded-2xl border-2 border-[#10B981] bg-white overflow-hidden">
                <img src={imageUrl} alt={`Mặt tiền cửa hàng ${index + 1}`} className="h-full w-full object-cover" />
                <div className="absolute left-0 top-0 h-0 w-0 border-l-[14px] border-b-[14px] border-l-[#10B981] border-b-transparent" />
                <button
                  className="absolute right-2 top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#EF4444] text-white shadow-md hover:bg-[#DC2626]"
                  onClick={() => setStoreImages(prev => prev.filter((_, i) => i !== index))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}


        <div className="h-16" />
      </div>

      {/* Spacer for bottom CTA */}
      <div className="h-28" />

      {/* Bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full bg-white/80 p-4 backdrop-blur pb-6">
        <button onClick={onNextPage} className="h-14 w-full rounded-2xl bg-gradient-to-r from-[#FF9F2E] to-[#FF4D00] text-base font-semibold text-white shadow-[0_8px_16px_rgba(255,125,0,0.35)] active:scale-[0.99]">
          Tiếp tục
        </button>
      </div>

      {/* Bottom Sheet */}
      {showBottomSheet && (
        <div className="fixed inset-0 z-50 flex items-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowBottomSheet(false)}
          />

          {/* Bottom Sheet Content */}
          <div className="relative w-full bg-white rounded-t-3xl p-6 pb-8 animate-in slide-in-from-bottom duration-300">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900">Chọn cách thêm ảnh</h3>
            </div>

            <div className="space-y-3">
              <button
                className="flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-left hover:bg-gray-50 active:bg-gray-100"
                onClick={() => {
                  const maxItems = getMaxSelectItems(currentUploadType);
                  if (maxItems === 0) {
                    console.warn("Đã đạt giới hạn tối đa 5 ảnh");
                    setShowBottomSheet(false);
                    return;
                  }
                  handleOpenMediaPicker("photo", maxItems, currentUploadType);
                  setShowBottomSheet(false);
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2.67004 18.9501L7.60004 15.6401C8.39004 15.1101 9.53004 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Chọn từ thư viện ảnh</div>
                  <div className="text-sm text-gray-500">Chọn ảnh có sẵn trong điện thoại</div>
                </div>
              </button>

              <button
                className="flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-left hover:bg-gray-50 active:bg-gray-100"
                onClick={() => {
                  const maxItems = getMaxSelectItems(currentUploadType);
                  if (maxItems === 0) {
                    console.warn("Đã đạt giới hạn tối đa 5 ảnh");
                    setShowBottomSheet(false);
                    return;
                  }
                  handleOpenMediaPicker("zcamera_photo", maxItems, currentUploadType);
                  setShowBottomSheet(false);
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path opacity="0.4" d="M7.26005 22H17.74C20.5 22 21.6 20.31 21.73 18.25L22.25 9.99C22.39 7.83 20.67 6 18.5 6C17.89 6 17.33 5.65 17.05 5.11L16.33 3.66C15.87 2.75 14.67 2 13.65 2H11.36C10.33 2 9.13005 2.75 8.67005 3.66L7.95005 5.11C7.67004 5.65 7.11005 6 6.50005 6C4.33005 6 2.61005 7.83 2.75005 9.99L3.27005 18.25C3.39005 20.31 4.50005 22 7.26005 22Z" fill="#101828" />
                    <path d="M14 8.75H11C10.59 8.75 10.25 8.41 10.25 8C10.25 7.59 10.59 7.25 11 7.25H14C14.41 7.25 14.75 7.59 14.75 8C14.75 8.41 14.41 8.75 14 8.75Z" fill="#101828" />
                    <path d="M12.5 18.13C14.3667 18.13 15.88 16.6167 15.88 14.75C15.88 12.8833 14.3667 11.37 12.5 11.37C10.6333 11.37 9.12 12.8833 9.12 14.75C9.12 16.6167 10.6333 18.13 12.5 18.13Z" fill="#101828" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Chụp ảnh mới</div>
                  <div className="text-sm text-gray-500">Mở camera để chụp ảnh mới</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------- UI atoms ----------------- */
function StepPill({ children, active = false }: React.PropsWithChildren<{ active?: boolean }>) {
  return (
    <div
      className={
        "inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold min-h-[42px] min-w-[42px] " +
        (active ? "bg-[#FABD0D] text-[#334155]" : "bg-[#F3F4F6] text-[#6b7280]")
      }
    >
      {children}
    </div>
  );
}


/* ----------------- UI Atoms ----------------- */
function SectionTitle({ children }: React.PropsWithChildren) {
  return <div className="mb-3 mt-5 text-[15px] font-semibold text-[#374151]">{children}</div>;
}


function UploadBox({ label, imageUrl, onPress, onDelete }: { label: string; imageUrl?: string; onPress: () => void; onDelete?: () => void }) {
  if (imageUrl) {
    return (
      <div className="relative h-32 rounded-2xl border-2 border-[#101828] bg-white overflow-hidden">
        {/* Ảnh đã chọn */}
        <img src={imageUrl} alt="CCCD" className="h-full w-full object-cover" />

        {/* Tick icon góc trái */}
        <div className="absolute left-0 top-0 h-0 w-0 border-l-[14px] border-b-[14px] border-l-[#101828] border-b-transparent" />

        {/* Nút xóa ảnh */}
        <button
          className="absolute right-2 top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#EF4444] text-white shadow-md hover:bg-[#DC2626]"
          onClick={onDelete || onPress}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M13.7724 13.773C14.0653 13.4801 14.0653 13.0052 13.7724 12.7123L10.0606 9.00054L13.7735 5.28772C14.0664 4.99482 14.0664 4.51995 13.7735 4.22706C13.4806 3.93416 13.0057 3.93416 12.7128 4.22706L8.99999 7.93988L5.28717 4.22706C4.99427 3.93416 4.5194 3.93416 4.22651 4.22706C3.93361 4.51995 3.93361 4.99482 4.22651 5.28772L7.93933 9.00054L4.22752 12.7123C3.93463 13.0052 3.93463 13.4801 4.22752 13.773C4.52042 14.0659 4.99529 14.0659 5.28819 13.773L8.99999 10.0612L12.7118 13.773C13.0047 14.0659 13.4796 14.0659 13.7724 13.773Z" fill="white" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <button
      className="flex h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#D1D5DB] bg-white text-[13px] text-[#6B7280] hover:border-[#101828] hover:bg-green-50/50 transition-colors"
      onClick={onPress}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
        <path opacity="0.4" d="M7.26005 22H17.74C20.5 22 21.6 20.31 21.73 18.25L22.25 9.99C22.39 7.83 20.67 6 18.5 6C17.89 6 17.33 5.65 17.05 5.11L16.33 3.66C15.87 2.75 14.67 2 13.65 2H11.36C10.33 2 9.13005 2.75 8.67005 3.66L7.95005 5.11C7.67004 5.65 7.11005 6 6.50005 6C4.33005 6 2.61005 7.83 2.75005 9.99L3.27005 18.25C3.39005 20.31 4.50005 22 7.26005 22Z" fill="#78726D" />
        <path d="M14 8.75H11C10.59 8.75 10.25 8.41 10.25 8C10.25 7.59 10.59 7.25 11 7.25H14C14.41 7.25 14.75 7.59 14.75 8C14.75 8.41 14.41 8.75 14 8.75Z" fill="#78726D" />
        <path d="M12.5 18.13C14.3667 18.13 15.88 16.6167 15.88 14.75C15.88 12.8833 14.3667 11.37 12.5 11.37C10.6333 11.37 9.12 12.8833 9.12 14.75C9.12 16.6167 10.6333 18.13 12.5 18.13Z" fill="#78726D" />
      </svg>
      <span className="px-2 text-center leading-snug">{label}</span>
    </button>
  );
}


function UploadButton({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <button
      className={`flex h-12 min-w-[192px] px-4 items-center justify-start gap-2 rounded-[28px] border border-dashed text-[13px] font-medium transition-colors ${disabled
          ? 'border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] cursor-not-allowed'
          : 'border-[#CBD5E1] bg-white text-[#374151] active:opacity-90 hover:border-[#10B981] hover:bg-green-50/50'
        }`}
      onClick={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
        <path opacity="0.4" d="M7.26005 22H17.74C20.5 22 21.6 20.31 21.73 18.25L22.25 9.99C22.39 7.83 20.67 6 18.5 6C17.89 6 17.33 5.65 17.05 5.11L16.33 3.66C15.87 2.75 14.67 2 13.65 2H11.36C10.33 2 9.13005 2.75 8.67005 3.66L7.95005 5.11C7.67004 5.65 7.11005 6 6.50005 6C4.33005 6 2.61005 7.83 2.75005 9.99L3.27005 18.25C3.39005 20.31 4.50005 22 7.26005 22Z" fill="#78726D" />
        <path d="M14 8.75H11C10.59 8.75 10.25 8.41 10.25 8C10.25 7.59 10.59 7.25 11 7.25H14C14.41 7.25 14.75 7.59 14.75 8C14.75 8.41 14.41 8.75 14 8.75Z" fill="#78726D" />
        <path d="M12.5 18.13C14.3667 18.13 15.88 16.6167 15.88 14.75C15.88 12.8833 14.3667 11.37 12.5 11.37C10.6333 11.37 9.12 12.8833 9.12 14.75C9.12 16.6167 10.6333 18.13 12.5 18.13Z" fill="#78726D" />
      </svg>
      {label}
    </button>
  );
}

function TipBanner({ text }: { text: string }) {
  return (
    <div className="mb-3 flex items-center gap-2 rounded-2xl bg-[#FFF6EB] px-3 py-2 text-[12px] text-[#1A1A1A70] font-bold">
      <div className="min-w-[16px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M11.5267 2.76003L11.48 5.28669C11.4733 5.63336 11.6934 6.09336 11.9734 6.30003L13.6267 7.55336C14.6867 8.35336 14.5133 9.33337 13.2467 9.73337L11.0934 10.4067C10.7334 10.52 10.3534 10.9134 10.26 11.28L9.74668 13.24C9.34001 14.7867 8.32667 14.94 7.48667 13.58L6.31333 11.68C6.09999 11.3334 5.59333 11.0734 5.19333 11.0934L2.96669 11.2067C1.37336 11.2867 0.920016 10.3667 1.96002 9.15336L3.28 7.62002C3.52667 7.33336 3.64 6.80003 3.52667 6.44003L2.85337 4.28669C2.46003 3.02002 3.16669 2.32003 4.42669 2.73337L6.39336 3.38003C6.7267 3.4867 7.22669 3.41336 7.50669 3.20669L9.56003 1.72669C10.6667 0.926694 11.5533 1.39336 11.5267 2.76003Z" fill="#F79D23" />
          <path opacity="0.4" d="M14.2933 13.6467L12.2733 11.6267C12.08 11.4334 11.76 11.4334 11.5666 11.6267C11.3733 11.82 11.3733 12.14 11.5666 12.3334L13.5867 14.3534C13.6867 14.4534 13.8133 14.5 13.94 14.5C14.0666 14.5 14.1933 14.4534 14.2933 14.3534C14.4866 14.16 14.4866 13.84 14.2933 13.6467Z" fill="#F79D23" />
        </svg>
      </div>
      <span>{text}</span>
    </div>
  );
}

function ImageGrid({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {images.map((src, idx) => (
        <div key={idx} className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#F1F5F9] shadow-sm">
          {/* góc tick */}
          <div className="pointer-events-none absolute left-0 top-0 h-0 w-0 border-l-[14px] border-b-[14px] border-l-[#101828] border-b-transparent" />
          {/* thumbnail có nền xám để nổi PNG */}
          <div className="aspect-square w-full">
            <img src={src} alt="upload" className="h-full w-full object-cover mix-blend-normal" />
          </div>
          {/* nút xoá */}
          <button className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-[#EF4444] text-white shadow-md">
            <XIcon />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ----------------- Icons ----------------- */
function ChevronLeft() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#111827]">
      <path d="M15 19L8 12L15 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-[#9CA3AF]">
      <path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}
function Sparkle() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#FDBA74]">
      <path d="M12 2l1.8 4.5L18 8.2l-4.2 1.6L12 14l-1.8-4.2L6 8.2l4.2-1.7L12 2z" />
    </svg>
  );
}


/* ----------------- Sample Data (mock) ----------------- */
const sampleProducts = [
  "https://via.placeholder.com/300x300.png?text=PNG+1",
  "https://via.placeholder.com/300x300.png?text=PNG+2",
  "https://via.placeholder.com/300x300.png?text=PNG+3",
  "https://via.placeholder.com/300x300.png?text=PNG+4",
  "https://via.placeholder.com/300x300.png?text=PNG+5",
  "https://via.placeholder.com/300x300.png?text=PNG+6",
];


const sampleStores = [
  "https://via.placeholder.com/300x300.png?text=Store+1",
  "https://via.placeholder.com/300x300.png?text=Store+2",
  "https://via.placeholder.com/300x300.png?text=Store+3",
  "https://via.placeholder.com/300x300.png?text=Store+4",
  "https://via.placeholder.com/300x300.png?text=Store+5",
  "https://via.placeholder.com/300x300.png?text=Store+6",
];