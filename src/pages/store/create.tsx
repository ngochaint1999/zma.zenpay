import React, { useState, useEffect, useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import { Building, ChevronDown, IdCard, Location, Mail, Other, Phone, Pin, ShopHouse, Sparkle, Stars, StoreFront, Warehouse, } from "./icons";
import Logo from "../../static/icons/logo.svg";
import Gold from "../../static/images/gold.png";
import { useNavigate } from "react-router-dom";
import { newStoreFormAtom } from "../../atoms/storeAtom";
import { getBusinessTypes, getMerchantCategories, getProvinceWithCommunes, getTaxInfo } from "@/services/home";
import { BusinessType, IProvinceData, MerchantCategory } from "@/types/home.types";
import { commonAtom } from "@/atoms/commonAtom";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { ProvinceSheet } from "./components/ProvinceSheet";
import { CommuneSheet } from "./components/CommuneSheet";
import { MerchantCategorySheet } from "./components/MerchantCategorySheet";
import authApis from "@/apis/authApis";
import { EAuthorizeZalo } from "@/types/auth/auth.enums";
import { Button, Modal } from "zmp-ui";
import { authAtom } from "@/atoms/authAtom";

// Constants cho validation mã số thuế
const TAX_MIN_LENGTH = 10;
const TAX_NUMBER_REGEX = /^[0-9]{10,14}$/;

// Array icon cho business types
const BUSINESS_TYPE_ICONS = [
  <StoreFront />,
  <Warehouse />,
  <Stars />,
  <ShopHouse />,
  <Other />
];

// Function để get icon cho business type
const getIconForBusinessType = (businessTypeCode: string) => {
  // Tạo hash từ businessTypeCode để icon luôn consistent cho cùng 1 code
  let hash = 0;
  for (let i = 0; i < businessTypeCode.length; i++) {
    const char = businessTypeCode.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % BUSINESS_TYPE_ICONS.length;
  return BUSINESS_TYPE_ICONS[index];
};

export default function CreateStorePage() {
  const navigate = useNavigate();
  const setLoading = useSetAtom(commonAtom);
  const [formData, setFormData] = useAtom(newStoreFormAtom);
  const setAuth = useSetAtom(authAtom);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [merchantCategories, setMerchantCategories] = useState<MerchantCategory[]>([]);
  const [provinceWithCommunes, setprovinceWithCommunes] = useState<IProvinceData[]>([]);

  // State cho tax info lookup
  const [taxInfoLoading, setTaxInfoLoading] = useState(false);
  const [taxInfoLoaded, setTaxInfoLoaded] = useState(false);
  const [taxInfoError, setTaxInfoError] = useState(false);
  const prevTaxNumber = useRef("");

  // State cho province/commune selection
  const [showProvinceSheet, setShowProvinceSheet] = useState(false);
  const [showCommuneSheet, setShowCommuneSheet] = useState(false);
  const [showMerchantCategorySheet, setShowMerchantCategorySheet] = useState(false);
  const [searchProvinceText, setSearchProvinceText] = useState("");
  const [searchMerchantCategoryText, setSearchMerchantCategoryText] = useState("");

  // State cho form
  const [businessRegistrationNo, setBusinessRegistrationNo] = useState(formData.businessRegistrationNo || "");
  const [merchantName, setMerchantName] = useState(formData.merchantName || "");
  const [ownerName, setOwnerName] = useState(formData.ownerName || "");
  const [phone, setPhone] = useState(formData.phone || "");
  const [zaloPhone, setZaloPhone] = useState(formData.zaloPhone || "");
  const [email, setEmail] = useState(formData.email || "");
  const [provinceName, setProvinceName] = useState(formData.provinceName || "");
  const [provinceCode, setProvinceCode] = useState(formData.provinceCode || "");
  const [communeName, setCommuneName] = useState(formData.communeName || "");
  const [communeCode, setCommuneCode] = useState(formData.communeCode || "");
  const [streetAddress, setStreetAddress] = useState(formData.streetAddress || "");
  const [businessTypeCode, setBusinessTypeCode] = useState(formData.businessTypeCode || ""); // Thay đổi từ businessType thành businessTypeCode
  const [merchantCategoryCode, setMerchantCategoryCode] = useState(formData.merchantCategoryCode || "");
  const [merchantCategoryName, setMerchantCategoryName] = useState(""); // Local state for display name

  const [openDev, setOpenDev] = useState({ open: false, zaloToke: "", phoneToken: "" });
  const onGetPhoneAndZaloToken = async () => {
    // Lấy token Zalo và Phone
    setLoading({ loading: true });
    const resZaloToken = await authApis.getAccessTokenZalo();
    const resPhoneToken = await authApis.getPhoneToken();
    // setOpenDev({ open: true, zaloToke: resZaloToken?.data || "", phoneToken: resPhoneToken?.data || "" });
    const res = await authApis.getPhoneNumberInternal({
      accessToken: resZaloToken?.data || "",
      phoneTokenCode: resPhoneToken?.data || ""
    });
    setLoading({ loading: false });
    if (res.data?.userPhoneNumber) {
      // res.data.userPhoneNumber có format +84xxxx, chuyển thành 0xxxx
      const formattedPhone = res.data.userPhoneNumber.startsWith("+84")
        ? "0" + res.data.userPhoneNumber.slice(3)
        : res.data.userPhoneNumber;
      // Nếu người dùng chưa nhập số điện thoại thì mới set
      if (!formData.phone) {
        setPhone(formattedPhone);
      }
      setZaloPhone(res.data.userPhoneNumber);
      setAuth({
        accessToken: res.data?.token?.accessToken || "",
        refreshToken: "",
        userPhoneNumber: res.data.userPhoneNumber,
        branches: res.data?.branches || [],
      });
      setFormData({ ...formData, phone: formattedPhone, zaloPhone: res.data.userPhoneNumber });
      navigate("/store/bank-info");
    } else {
      toast.error(res?.message || "Không lấy được số điện thoại từ Zalo");
    }
  }

  const onLoginZalo = async () => {
    // 1. Lấy scopes from Zalo
    const res = await authApis.authorizeUserZalo({
      scopes: [
        EAuthorizeZalo.UserInfo,
        EAuthorizeZalo.UserPhonenumber
      ]
    });
    if (res.code === "000") {
      await onGetPhoneAndZaloToken();
      return;
    }
    toast.error(res.message);
  }
  // Cập nhật atom khi có thay đổi
  useEffect(() => {
    setFormData({
      ...formData,
      businessRegistrationNo,
      merchantName,
      ownerName,
      phone,
      zaloPhone,
      email,
      provinceName,
      provinceCode,
      communeName,
      communeCode,
      streetAddress,
      merchantCategoryCode,
      businessTypeCode,
      businessTypeName: businessTypes.find(bt => bt.businessTypeCode === businessTypeCode)?.businessTypeName || "",
      businessAddress: `${streetAddress}, ${communeName}, ${provinceName}`.trim().replace(/^,\s*|,\s*$/g, '')
    });
  }, [businessTypeCode, businessRegistrationNo, merchantName, ownerName, phone, zaloPhone, email, provinceName, provinceCode, communeName, communeCode, streetAddress, merchantCategoryCode]);

  // Auto-fill thông tin từ mã số thuế
  useEffect(() => {
    if (
      businessRegistrationNo &&
      businessRegistrationNo !== prevTaxNumber.current &&
      (businessRegistrationNo.length === TAX_MIN_LENGTH ||
        businessRegistrationNo.length === 12 ||
        businessRegistrationNo.length === 13 ||
        businessRegistrationNo.length === 14) &&
      TAX_NUMBER_REGEX.test(businessRegistrationNo)
    ) {
      setTaxInfoLoading(true);
      setTaxInfoLoaded(false);
      setTaxInfoError(false);

      getTaxInfo(businessRegistrationNo)
        .then((res) => {
          console.log('Tax info response:', res);
          if (res) {
            // Auto fill các trường
            if (res.companyName || res.merchantName) {
              setMerchantName(res.companyName || res.merchantName || "");
            }
            if (res.companyAddress || res.businessAddress) {
              const fullAddress = res.companyAddress || res.businessAddress || "";
              // Có thể parse địa chỉ để tách streetAddress, commune, province nếu cần
              setStreetAddress(fullAddress);
            }
            if (res.ownerName) {
              setOwnerName(res.ownerName);
            }
          }
          setTaxInfoLoaded(true);
          setTaxInfoError(false);
          setTaxInfoLoading(false);
        })
        .catch((err) => {
          console.error('Tax info lookup error:', err);
          setTaxInfoLoaded(false);
          setTaxInfoError(true);
          setTaxInfoLoading(false);
          toast.error(err?.message || "Không tìm thấy thông tin mã số thuế");
        });

      prevTaxNumber.current = businessRegistrationNo;
    }

    // Nếu user xoá số, reset lại trạng thái
    if (!businessRegistrationNo || businessRegistrationNo.length < TAX_MIN_LENGTH) {
      setTaxInfoLoaded(false);
      setTaxInfoError(false);
      setTaxInfoLoading(false);
      prevTaxNumber.current = "";
    }
  }, [businessRegistrationNo]);

  // Hàm gọi API lấy loại hình kinh doanh
  const onFetchBusinessTypes = async () => {
    // Lấy danh sách loại hình kinh doanh khi component mount
    if (businessTypes.length > 0) return; // Nếu đã có loại hình thì
    setLoading({ loading: true });
    getBusinessTypes()
      .then((types) => {
        setBusinessTypes(types);
        setBusinessTypeCode(types[0]?.businessTypeCode || ""); // Mặc định chọn loại hình đầu tiên
        setLoading({ loading: false });
      })
      .catch((err) => {
        setBusinessTypes([]);
        toast.error(err?.message || "Không lấy được loại hình kinh doanh");
      })
  }
  // Hàm gọi API lấy Ngành nghề kinh doanh
  const onFetchMerchantCategories = async () => {
    // Lấy danh sách ngành nghề kinh doanh khi component mount
    if (merchantCategories.length > 0) return; // Nếu đã có ngành nghề thì
    setLoading({ loading: true });
    getMerchantCategories()
      .then((sectors) => {
        setMerchantCategories(sectors);
        setLoading({ loading: false });
      })
      .catch((err) => {
        setMerchantCategories([]);
        toast.error(err?.message || "Không lấy được ngành nghề kinh doanh");
      })
  }
  // Hàm gọi API lấy danh sách tỉnh thành
  const onGetProvinceWithCommunes = async () => {
    // Lấy danh sách tỉnh thành khi component mount
    if (provinceWithCommunes.length > 0) return; // Nếu đã có tỉnh thành thì
    setLoading({ loading: true });
    getProvinceWithCommunes()
      .then((sectors) => {
        setprovinceWithCommunes(sectors);
        setLoading({ loading: false });
      })
      .catch((err) => {
        setprovinceWithCommunes([]);
        setLoading({ loading: false });
        toast.error(err?.message || "Không lấy được danh sách tỉnh thành");
      })
  }

  useEffect(() => {
    onFetchBusinessTypes();
    onFetchMerchantCategories();
    onGetProvinceWithCommunes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect để cập nhật merchantCategoryName khi có merchantCategoryCode và merchantCategories
  useEffect(() => {
    if (merchantCategoryCode && merchantCategories.length > 0) {
      const category = merchantCategories.find(cat => cat.merchantCategoryCode === merchantCategoryCode);
      if (category) {
        setMerchantCategoryName(category.merchantCategoryName);
      }
    }
  }, [merchantCategoryCode, merchantCategories]);

  // Hàm validation và xử lý nút tiếp tục
  const handleContinue = async () => {
    // Kiểm tra validation cho tất cả các trường bắt buộc
    const validationErrors: string[] = [];

    // Kiểm tra mã số thuế
    if (!businessRegistrationNo.trim()) {
      validationErrors.push("Vui lòng nhập mã số thuế doanh nghiệp");
    } else if (!TAX_NUMBER_REGEX.test(businessRegistrationNo)) {
      validationErrors.push("Mã số thuế không đúng định dạng");
    }

    // Kiểm tra tên doanh nghiệp
    if (!merchantName.trim()) {
      validationErrors.push("Vui lòng nhập tên doanh nghiệp");
    }

    // Kiểm tra tên chủ doanh nghiệp
    if (!ownerName.trim()) {
      validationErrors.push("Vui lòng nhập tên chủ doanh nghiệp");
    }

    // Kiểm tra email
    if (!email.trim()) {
      validationErrors.push("Vui lòng nhập email liên hệ");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        validationErrors.push("Email không đúng định dạng");
      }
    }

    // Kiểm tra địa chỉ
    if (!provinceName) {
      validationErrors.push("Vui lòng chọn Tỉnh/Thành phố");
    }

    if (!communeName) {
      validationErrors.push("Vui lòng chọn Phường/Xã");
    }

    // Kiểm tra loại hình kinh doanh
    if (!businessTypeCode) {
      validationErrors.push("Vui lòng chọn loại hình kinh doanh");
    }

    // Kiểm tra ngành nghề kinh doanh
    if (!merchantCategoryCode) {
      validationErrors.push("Vui lòng chọn ngành nghề kinh doanh");
    }

    // Nếu có lỗi validation, hiển thị lỗi đầu tiên
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }
    if (!zaloPhone.trim()) {
      await onLoginZalo();
      return;
    }
    // Nếu tất cả validation đều pass, chuyển sang trang tiếp theo
    navigate("/store/bank-info");
  };
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
            <StepPill active>1/4</StepPill>
            <div className="mb-2 text-[15px] font-semibold mt-3 text-nowrap">Thông tin cơ bản</div>
            <div className="mb-3 text-[13px] text-[#6b7280]">Thông tin cơ bản của đối tác</div>
          </div>
          <div className="h-[1px] border-b border-dashed border-[#94A3B8] min-w-[56px] my-auto" />
          <div>
            <StepPill>2/4</StepPill>
            <div className="mb-2 text-[15px] font-semibold mt-3 text-nowrap">Tài khoản ngân hàng</div>
            <div className="mb-3 text-[13px] text-[#6b7280]">Thông tin cấu hình ghi nhận báo có</div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-20 top-16 h-32 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(255,165,0,0.25),transparent)]" />
      </div>

      {/* Form */}
      <div className="space-y-3 px-4">
        <Field
          label="Mã số thuế doanh nghiệp"
          placeholder="Mã số thuế doanh nghiệp"
          leading={<IdCard />}
          value={businessRegistrationNo}
          onChange={(e) => setBusinessRegistrationNo(e.target.value)}
        />
        {/* Dynamic TipBanner based on tax lookup status */}
        {taxInfoLoading && (
          <TipBanner text="Đang tìm kiếm thông tin mã số thuế..." type="loading" />
        )}
        {taxInfoLoaded && !taxInfoLoading && (
          <TipBanner text="Đã tìm thấy và điền thông tin từ mã số thuế" type="success" />
        )}
        {taxInfoError && !taxInfoLoading && (
          <TipBanner text="ZenPay chưa có dữ liệu MST này, hãy điền thủ công nhé!" type="error" />
        )}
        {!taxInfoLoading && !taxInfoLoaded && !taxInfoError && (
          <TipBanner text="Hệ thống sẽ tự tìm thông tin theo MST để nhập nhanh" type="info" />
        )}
        <Field
          label="Tên doanh nghiệp"
          placeholder="Tên doanh nghiệp"
          leading={<Building />}
          value={merchantName}
          onChange={(e) => setMerchantName(e.target.value)}
        />
        <Field
          label="Tên chủ doanh nghiệp"
          placeholder="Tên chủ doanh nghiệp"
          leading={<Building />}
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
        />
        <Field
          label="Số điện thoại liên hệ"
          placeholder="Số điện thoại liên hệ"
          inputMode="tel"
          leading={<Phone />}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Field
          label="Email liên hệ"
          placeholder="Email liên hệ"
          inputMode="email"
          leading={<Mail />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Dropdown
            label={provinceName || "Chọn tỉnh"}
            isColor={!!provinceName}
            leading={<span className="min-w-[24px]"><Pin /></span>}
            onClick={() => {
              if (provinceWithCommunes.length === 0) {
                onGetProvinceWithCommunes();
              }
              setShowProvinceSheet(true);
            }}
          />
          <Dropdown
            label={communeName || "Chọn xã"}
            isColor={!!communeName}
            leading={<span className="min-w-[24px]"><Pin /></span>}
            onClick={() => {
              if (!provinceName) {
                toast.error("Vui lòng chọn tỉnh/thành phố trước");
                return;
              }
              setShowCommuneSheet(true);
            }}
          />
        </div>

        <Field
          label="Số nhà, tên đường"
          placeholder="Số nhà, tên đường"
          leading={<Location />}
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
        />
      </div>

      {/* Business Type */}
      <div className="mt-6 px-4">
        <div className="mb-3 text-[15px] font-medium text-[#374151]">Loại hình kinh doanh của bạn là gì?</div>
        <div className="mb-3 flex items-start overflow-scroll gap-3">
          {businessTypes.map((businessType) => (
            <TypeChip
              key={businessType.businessTypeCode}
              icon={getIconForBusinessType(businessType.businessTypeCode)}
              label={businessType.businessTypeName}
              active={businessTypeCode === businessType.businessTypeCode}
              onClick={() => setBusinessTypeCode(businessType.businessTypeCode)}
            />
          ))}
        </div>
        <Dropdown
          label={merchantCategoryName || "Ngành nghề kinh doanh"}
          isColor={!!merchantCategoryName}
          leading={<Building />}
          chevron
          onClick={() => {
            if (merchantCategories.length === 0) {
              onFetchMerchantCategories();
            }
            setShowMerchantCategorySheet(true);
          }}
        >
          {/* Options would render in a real select */}
        </Dropdown>
      </div>

      {/* Spacer for bottom CTA */}
      <div className="h-28" />

      {/* Bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full bg-white/80 p-4 backdrop-blur pb-6">
        <button onClick={handleContinue} className="h-14 w-full rounded-2xl bg-gradient-to-r from-[#FF9F2E] to-[#FF4D00] text-base font-semibold text-white shadow-[0_8px_16px_rgba(255,125,0,0.35)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100">
          Tiếp tục
        </button>
      </div>

      {/* Province Selection Sheet */}
      {showProvinceSheet && (
        <ProvinceSheet
          provinces={provinceWithCommunes}
          searchText={searchProvinceText}
          onSearchChange={setSearchProvinceText}
          onSelectProvince={(province) => {
            setProvinceName(province.name);
            setProvinceCode(province.code);
            setCommuneName(""); // Reset commune khi đổi tỉnh
            setCommuneCode("");
            setShowProvinceSheet(false);
            setSearchProvinceText("");
            setShowCommuneSheet(true);
          }}
          onClose={() => {
            setShowProvinceSheet(false);
            setSearchProvinceText("");
          }}
        />
      )}

      {/* Commune Selection Sheet */}
      {showCommuneSheet && (
        <CommuneSheet
          communes={provinceWithCommunes.find(p => p.name === provinceName)?.communes || []}
          searchText={searchProvinceText}
          onSearchChange={setSearchProvinceText}
          onSelectCommune={(commune) => {
            setCommuneName(commune.name);
            setCommuneCode(commune.code);
            setShowCommuneSheet(false);
            setSearchProvinceText("");
          }}
          onClose={() => {
            setShowCommuneSheet(false);
            setSearchProvinceText("");
          }}
          onBack={() => {
            setShowCommuneSheet(false);
            setSearchProvinceText("");
            setShowProvinceSheet(true);
          }}
        />
      )}

      {/* Merchant Category Selection Sheet */}
      {showMerchantCategorySheet && (
        <MerchantCategorySheet
          categories={merchantCategories}
          searchText={searchMerchantCategoryText}
          onSearchChange={setSearchMerchantCategoryText}
          onSelectCategory={(category) => {
            setMerchantCategoryCode(category.merchantCategoryCode);
            setMerchantCategoryName(category.merchantCategoryName);
            setShowMerchantCategorySheet(false);
            setSearchMerchantCategoryText("");
          }}
          onClose={() => {
            setShowMerchantCategorySheet(false);
            setSearchMerchantCategoryText("");
          }}
        />
      )}
      <Modal visible={openDev.open} title="Dev info" onClose={() => setOpenDev({ open: false, zaloToke: "", phoneToken: "" })}>
        <div className="space-y-3">
          <div>
            <strong>Zalo Token:</strong> {openDev.zaloToke}
          </div>
          <div>
            <strong>Phone Token:</strong> {openDev.phoneToken}
          </div>

          {/* Sao chép 2 token */}
          <Button
            onClick={() => {
              navigator.clipboard.writeText(`Zalo Token: ${openDev.zaloToke}\nPhone Token: ${openDev.phoneToken}`);
            }}
          >
            Sao chép 2 token
          </Button>
        </div>
      </Modal>
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

function Field({ label, placeholder, inputMode, leading, value, disabled = false, onChange }: {
  label: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  leading?: React.ReactNode;
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <div className="sr-only">{label}</div>
      <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 focus-within:border-[#FF7A00]">
        {leading}
        <input
          className="w-full appearance-none bg-transparent text-[15px] placeholder:text-[#9CA3AF] focus:outline-none"
          placeholder={placeholder ?? label}
          inputMode={inputMode}
          value={value}
          disabled={disabled}
          onChange={onChange}
        />
      </div>
    </label>
  );
}

function Dropdown({ label, leading, isColor = false, chevron = true, onClick, children }: {
  label: string;
  leading?: React.ReactNode;
  isColor?: boolean;
  chevron?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center gap-1 line-clamp-1 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 cursor-pointer"
      onClick={onClick}
    >
      {leading}
      <span className={cn("flex-1 text-[15px] text-[#9CA3AF] text-nowrap overflow-hidden w-full", isColor ? "text-black" : "")}>{label}</span>
      {chevron && (
        <span className="min-w-[24px]">
          <ChevronDown />
        </span>
      )}
    </div>
  );
}

function TipBanner({ text, type = "info" }: { text: string; type?: "info" | "loading" | "success" | "error" }) {
  const getBannerStyles = () => {
    switch (type) {
      case "loading":
        return "bg-[#EFF6FF] text-[#1E40AF]"; // Blue
      case "success":
        return "bg-[#F0FDF4] text-[#166534]"; // Green
      case "error":
        return "bg-[#FEF2F2] text-[#DC2626]"; // Red
      default:
        return "bg-[#FFF6EB] text-[#92400E]"; // Orange (default)
    }
  };

  return (
    <div className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-2xs text-[13px] ${getBannerStyles()}`}>
      <Sparkle />
      <span>{text}</span>
    </div>
  );
}

function TypeChip({ icon, label, active = false, onClick }: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "flex min-h-[124px] h-full min-w-[100px] max-w-[100px] px-2 py-3 flex-col items-center justify-start gap-2 rounded-2xl border text-[13px] font-medium " +
        (active ? "border-[#FF7A00] bg-[#FFF7ED]" : "border-[#E5E7EB] bg-white")
      }
    >
      <div className="h-12 w-12">{icon}</div>
      <span>{label}</span>
    </button>
  );
}
