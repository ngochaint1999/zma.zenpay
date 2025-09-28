import React from "react";
import Logo from "../../static/icons/logo.svg";
import Gold from "../../static/images/gold.png";
import GoldFull from "../../static/images/gold-full.png";
import { Building, Code, IdCard, Location, Phone, StoreFront } from "./icons";
import { useNavigate } from "react-router-dom";
import { useAtom, useSetAtom } from "jotai";
import { newStoreFormAtom } from "@/atoms/storeAtom";
import { postNewStore } from "@/services/home";
import toast from "react-hot-toast";
import { commonAtom } from "@/atoms/commonAtom";

/* ---------------- Sample data (replace with real images) ---------------- */

export default function CreateStoreCheckInfoPage() {
  const navigate = useNavigate();
  const setLoading = useSetAtom(commonAtom);
  const [formData] = useAtom(newStoreFormAtom);
  const [openIsReceived, setOpenIsReceived] = React.useState(false);

  const onSubmit = async () => {

    // Tạo payload
    const payload = {
      merchantName: formData?.merchantName || "",
      businessRegistrationNo: formData.businessRegistrationNo || "",
      businessRegistrationImageUrls: formData.businessRegistrationImageUrls || [],
      ownerIdCardNumber: formData.ownerIdCardNumber || "",
      ownerName: formData.ownerName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      merchantType: formData.merchantType || "",
      provinceName: formData.provinceName || "",
      provinceCode: formData.provinceCode || "",
      communeName: formData.communeName || "",
      communeCode: formData.communeCode || "",
      streetAddress: formData.streetAddress || "",
      latitude: "",
      longitude: "",
      exteriorImagesUrl: formData.exteriorImagesUrl || [],
      interiorImagesUrl: formData.interiorImagesUrl || [],
      bankAccountNumber: formData.bankAccountNumber || formData.settlementBankAccountNumber || "",
      bankName: formData.bankName || formData.settlementBankName || "",
      bankAccountHolder: formData.bankAccountHolder || formData.settlementBankAccountHolder || "",
      ownerIdCardFrontUrl: formData.ownerIdCardFrontUrl || "",
      ownerIdCardBackUrl: formData.ownerIdCardBackUrl || "",
      signedForm01AUrl: formData.signedForm01AUrl || "",
      merchantCategoryCode: formData?.merchantCategoryCode || "", // bổ sung nếu có
      zaloPhone: formData.zaloPhone || "",
      settlementBankAccountNumber: formData.settlementBankAccountNumber || formData.bankAccountNumber || "",
      settlementBankName: formData.settlementBankName || formData.bankName || "",
      settlementBankAccountHolder: formData.settlementBankAccountHolder || formData.bankAccountHolder || "",
      businessTypeCode: formData.businessTypeCode || "",
      businessAddress: formData.businessAddress || ""
    };
    // Gửi API tạo yêu cầu

    setLoading({ loading: true });
    try {
      const res = await postNewStore(payload);
      if (res.code === "00") {
        setOpenIsReceived(true);
        setLoading({ loading: false });
      } else {
        toast.error("Có lỗi khi gửi đăng ký: " + res.message);
        setLoading({ loading: false });
      }
    } catch (error: any) {
      console.log(error)
      toast.error("Có lỗi khi gửi đăng ký: " + error?.message);
      setLoading({ loading: false });
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
            <div className="max-w-[42px] min-h-[42px] bg-[#0CAF60] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <rect width="30" height="30" rx="15" fill="#0CAF60" />
                <g clipPath="url(#clip0_1899_2570)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M23.0149 9.12721C23.6007 9.71299 23.6007 10.6627 23.0149 11.2485L13.5352 20.7282C13.2539 21.0095 12.8724 21.1676 12.4745 21.1676C12.0767 21.1676 11.6952 21.0095 11.4139 20.7282L7.61683 16.9312C7.03104 16.3454 7.03104 15.3956 7.61683 14.8099C8.20262 14.2241 9.15236 14.2241 9.73815 14.8099L12.4745 17.5462L20.8936 9.12721C21.4794 8.54142 22.4291 8.54142 23.0149 9.12721Z" fill="white" />
                </g>
                <defs>
                  <clipPath id="clip0_1899_2570">
                    <rect width="17" height="13" fill="white" transform="translate(6.5 8.5)" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="mb-2 text-[15px] font-semibold mt-3 text-nowrap">Tài liệu đính kèm</div>
            <div className="mb-3 text-[13px] text-[#6b7280]">Tài liệu, hình ảnh xác thực cửa hàng</div>
          </div>
          <div className="h-[1px] border-b border-dashed border-[#94A3B8] min-w-[56px] my-auto" />
          <div>
            <StepPill active>4/4</StepPill>
            <div className="mb-2 text-[15px] font-semibold mt-3 text-nowrap">Kiểm tra thông tin</div>
            <div className="mb-3 text-[13px] text-[#6b7280]">Hãy chắc chắn mọi thông tin chính xác</div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-20 top-16 h-32 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(255,165,0,0.25),transparent)]" />
      </div>
      <div className="px-4 space-y-3">
        {/* Thông tin cơ bản */}
        <SectionTitle>Thông tin cơ bản</SectionTitle>
        <InfoRow icon={<Building />} text={formData.merchantName || "Chưa có tên cửa hàng"} />
        <InfoRow icon={<IdCard />} text={formData.ownerName || "Chưa có tên chủ sở hữu"} />
        <InfoRow icon={<Code />} text={formData.businessRegistrationNo || "Chưa có mã số thuế"} />
        <InfoRow icon={<Phone />} text={formData.phone || "Chưa có số điện thoại"} />
        <InfoRow icon={<Location />} text={formData.businessAddress || "Chưa có địa chỉ"} />
        {/* Hiển thị email nếu có */}
        {formData.email && (
          <InfoRow icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          } text={formData.email} />
        )}
        {/* Hiển thị CCCD nếu có */}
        {formData.ownerIdCardNumber && (
          <InfoRow icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          } text={`CCCD: ${formData.ownerIdCardNumber}`} />
        )}
        <div className="my-3 h-px w-full bg-gray-200" />


        {/* Loại hình kinh doanh */}
        <div className="flex items-center gap-3">
          <BusinessTypeChip
            icon={<StoreFront />}
            label={"Loại hình kinh doanh"}
            description={formData.businessTypeName || "Chưa chọn loại hình"}
          />
        </div>


        {/* Ngân hàng liên kết */}
        <SectionTitle>Ngân hàng liên kết</SectionTitle>
        <BankCard
          bank={formData.bankName || "Chưa chọn ngân hàng"}
          owner={formData.bankAccountHolder || "Chưa có tên chủ tài khoản"}
          number={formData.bankAccountNumber ? `**** **** ${formData.bankAccountNumber.slice(-4)}` : "Chưa có số tài khoản"}
        />


        {/* Hình ảnh */}
        <SectionTitle>Hình ảnh CCCD</SectionTitle>
        {formData.ownerIdCardFrontUrl || formData.ownerIdCardBackUrl ? (
          <ImageGrid images={[
            ...(formData.ownerIdCardFrontUrl ? [formData.ownerIdCardFrontUrl] : []),
            ...(formData.ownerIdCardBackUrl ? [formData.ownerIdCardBackUrl] : [])
          ]} />
        ) : (
          <div className="text-gray-500 text-sm">Chưa có ảnh CCCD</div>
        )}

        <SectionTitle>Hình giấy phép kinh doanh</SectionTitle>
        {formData.businessRegistrationImageUrls && formData.businessRegistrationImageUrls.length > 0 ? (
          <ImageGrid images={formData.businessRegistrationImageUrls} />
        ) : (
          <div className="text-gray-500 text-sm">Chưa có ảnh giấy phép kinh doanh</div>
        )}

        <SectionTitle>Hình sản phẩm kinh doanh</SectionTitle>
        {formData.interiorImagesUrl && formData.interiorImagesUrl.length > 0 ? (
          <ImageGrid images={formData.interiorImagesUrl} />
        ) : (
          <div className="text-gray-500 text-sm">Chưa có ảnh sản phẩm</div>
        )}

        <SectionTitle>Hình ảnh mặt bằng kinh doanh</SectionTitle>
        {formData.exteriorImagesUrl && formData.exteriorImagesUrl.length > 0 ? (
          <ImageGrid images={formData.exteriorImagesUrl} />
        ) : (
          <div className="text-gray-500 text-sm">Chưa có ảnh mặt bằng</div>
        )}
      </div>

      {/* Spacer for bottom CTA */}
      <div className="h-28" />

      {/* Bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full bg-white/80 p-4 backdrop-blur pb-6">
        <button onClick={() => onSubmit()} className="h-14 w-full rounded-2xl bg-gradient-to-r from-[#FF9F2E] to-[#FF4D00] text-base font-semibold text-white shadow-[0_8px_16px_rgba(255,125,0,0.35)] active:scale-[0.99]">
          Xác nhận thông tin
        </button>
      </div>
      {openIsReceived && <PopupReceived setOpenIsReceived={setOpenIsReceived} navigate={navigate} />}
    </div>
  );
}
function PopupReceived({ setOpenIsReceived, navigate }: { setOpenIsReceived: React.Dispatch<React.SetStateAction<boolean>>, navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white text-center shadow-xl">
        {/* Top illustration */}
        <div className="relative h-28 w-full bg-gradient-to-b from-[#FFE9C6] to-white">
          <div className="absolute left-1/2 -translate-x-1/2">
            <img src={GoldFull} className="w-[219px] h-auto" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-4">
          <h2 className="mb-2 text-[17px] font-bold text-gray-800">ZenShop đã nhận hồ sơ</h2>
          <p className="mb-6 text-[14px] text-gray-500 leading-relaxed">
            ZenShop sẽ thông tin đến bạn tình trạng hồ sơ trong thời gian sớm nhất
            thông qua email và thông báo ứng dụng
          </p>

          <div className="space-y-3">
            <button onClick={() => navigate("/home", { replace: true })} className="h-12 w-full rounded-2xl bg-gradient-to-r from-[#FF9F2E] to-[#FF4D00] text-base font-semibold text-white shadow-[0_8px_16px_rgba(255,125,0,0.35)]">
              Xem hồ sơ
            </button>
            <button onClick={() => navigate("/home", { replace: true })} className="h-12 w-full rounded-2xl border border-gray-300 bg-white text-base font-medium text-gray-700">
              Thoát
            </button>
          </div>
        </div>
      </div>
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
  return <div className="pt-3 mb-3 text-[15px] font-semibold text-[#374151]">{children}</div>;
}

function ImageGrid({ images }: { images: string[] }) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${images.length > 4 ? "grid-cols-3" : ""} mb-3`}>
      {images.map((src, idx) => (
        <div key={idx} className="group relative overflow-hidden rounded-2xl border border-[#101828] bg-[#F1F5F9] shadow-sm">
          {/* góc tick */}
          <div className="pointer-events-none absolute left-0 top-0 h-0 w-0 pl-[2px] pt-[2px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
              <path d="M0 16L6.99382e-07 8C1.08564e-06 3.58172 3.58172 -1.43533e-06 8 -1.04907e-06L20 0L0 16Z" fill="#101828" />
              <path d="M0 16L6.99382e-07 8C1.08564e-06 3.58172 3.58172 -1.43533e-06 8 -1.04907e-06L20 0L0 16Z" fill="white" fill-opacity="0.1" />
              <g clipPath="url(#clip0_2298_1018)">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.77174 2.17745C10.0474 2.45312 10.0474 2.90006 9.77174 3.17572L5.31071 7.63675C5.17833 7.76913 4.99879 7.8435 4.81157 7.8435C4.62436 7.8435 4.44482 7.76913 4.31244 7.63675L2.5256 5.84991C2.24993 5.57425 2.24993 5.12731 2.5256 4.85164C2.80126 4.57598 3.2482 4.57598 3.52386 4.85164L4.81157 6.13935L8.77347 2.17745C9.04914 1.90179 9.49608 1.90179 9.77174 2.17745Z" fill="white" />
              </g>
              <defs>
                <clipPath id="clip0_2298_1018">
                  <rect width="8" height="6.11765" fill="white" transform="translate(2 1.88232)" />
                </clipPath>
              </defs>
            </svg>
          </div>
          {/* thumbnail có nền xám để nổi PNG */}
          <div className="aspect-square w-full">
            <img src={src} alt="upload" className="h-full w-full object-cover mix-blend-normal" />
          </div>
        </div>
      ))}
    </div>
  );
}

function BusinessTypeChip({ icon, label, description }: { icon: React.ReactNode; label: string; description: string }) {
  return (
    <div className="flex items-center gap-3 bg-white px-3 py-1 text-sm font-medium text-gray-700">
      {icon}
      <div>
        <p className="font-bold">{label}</p>
        <p className="text-gray-500 pt-1">{description}</p>
      </div>
    </div>
  );
}


function BankCard({ bank, owner, number }: { bank: string; owner: string; number: string }) {
  return (
    <div className="relative overflow-hidden min-h-[148px] flex flex-col justify-center items-start rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 p-6 shadow">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-[2] bottom-0 right-0 w-full">
        <div className="mb-2 flex items-center gap-2 text-[15px] font-semibold text-[#1A1A1A]">
          {bank}
        </div>
        <div className="mt-1 text-[20px] font-semibold text-gray-900">{owner}</div>
        <div className="mt-3 text-[17px] text-gray-700">{number}</div>
      </div>
      <div className="absolute z-[1] bottom-0 right-0 h-[128px] min-w-[126px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="127" height="128" viewBox="0 0 127 128" fill="none">
          <path d="M28.1001 15.9723C38.6608 37.3118 63.21 35.7255 81.6311 45.7172L80.8021 41.6544L74.5725 33.7257C79.6926 35.1372 85.8809 37.728 89.7979 41.3671C92.4825 43.8581 98.1168 55.5498 101.231 53.3258L99.5979 45.7254C111.279 54.32 103.158 67.9409 117.245 74.9861C121.646 77.1867 123.033 73.8806 125.731 81.659C127.959 88.0944 127.031 93.9093 124.664 100.151C121.149 90.9615 115.959 91.7506 109.579 88.0282C106.298 86.1182 103.905 81.738 100.542 79.6481C95.9888 76.8253 90.2032 75.8992 84.9306 76.2172C89.1517 79.7599 94.4097 80.9789 98.9905 84.466C104.333 88.5352 107.257 94.8775 115.381 94.7668C116.03 100.094 111.24 106.363 105.622 105.617C105.982 76.1511 68.237 93.9621 58.7971 72.967C62.8525 73.4514 65.1823 75.6347 69.459 74.4444C81.9912 70.9557 66.7421 61.7029 56.0722 68.6087C42.8554 77.1625 47.8492 100.55 55.5305 111.609C59.3483 117.116 65.65 122.378 71.0185 128H22.6994C19.9015 120.479 19.9618 111.633 22.8389 103.418C16.0457 106.989 15.2799 114.415 10.8802 119.743C8.81964 102.972 14.6608 90.9464 27.1973 80.5674C18.0224 80.9005 10.9403 86.2416 5.972 93.6177C6.13809 80.7874 15.5328 70.0145 27.3943 66.056C30.3143 65.0746 35.6357 66.5849 34.8223 63.1423C22.6297 60.181 10.8226 59.8331 1.60547 69.6592C0.792371 69.8216 0.914304 68.6173 1.08018 68.0505C3.82114 59.1238 15.0647 52.4158 23.9224 51.1425C22.9676 47.1712 19.3533 45.7421 17.5121 41.7857C16.0865 38.7131 15.258 34.958 15.2304 31.567L21.8048 39.6763C29.8175 41.5593 36.044 48.1672 42.7838 51.3642C55.3092 57.301 71.2842 52.6186 81.6229 65.3091C75.2284 48.4549 55.0643 50.7925 41.7086 43.7227C25.9032 35.3495 19.5605 16.9404 23.947 0L28.1001 15.9723ZM83.8226 125.751C87.6013 124.492 99.2179 121.107 101.798 124.118C102.326 125.378 102.724 126.683 103.012 128H83.9047C83.8869 127.971 83.865 127.939 83.8472 127.91C83.2238 126.89 82.0115 127.147 83.8226 125.751ZM74.7941 105.782C80.0942 104.647 92.4119 113.835 96.8565 117.56L79.9896 122.632C77.7365 121.168 63.7171 112.115 65.3059 109.959C68.9157 110.192 72.0551 106.365 74.7941 105.782ZM72.9309 103.401L61.5796 107.817C57.3167 103.236 54.4631 98.2624 53.3144 91.9926L61.8422 90.5398L72.9309 103.401ZM58.7561 87.0679L53.2077 86.4359L54.4224 76.2008L58.7561 87.0679Z" fill="url(#paint0_linear_1419_4223)" />
          <defs>
            <linearGradient id="paint0_linear_1419_4223" x1="0.99999" y1="7.50448e-06" x2="202.5" y2="226" gradientUnits="userSpaceOnUse">
              <stop stop-color="#D9D9D9" />
              <stop offset="1" stop-color="#D9D9D9" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
/* ----------------- Icons ----------------- */
function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-[14px] text-gray-800">
      <span className="h-6 w-6 text-gray-500">{icon}</span>
      <span>{text}</span>
    </div>
  );
}