import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { ChevronDown } from "./icons";
import Logo from "../../static/icons/logo.svg";
import Gold from "../../static/images/gold.png";
import { useNavigate } from "react-router-dom";
import { BankData } from "@/types/home.types";
import { getBanks } from "@/services/home";
import { BankSheet } from "./components/BankSheet";
import { newStoreFormAtom } from "@/atoms/storeAtom";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function CreateStoreBankInfoPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useAtom(newStoreFormAtom);
  const [dataBanks, setDataBanks] = useState<BankData[]>([]);
  const [showBankSheet, setShowBankSheet] = useState(false);
  const [searchBankText, setSearchBankText] = useState("");
  const [selectedBank, setSelectedBank] = useState<BankData | null>(null);
  const [typeAccount, setTypeAccount] = useState<"personal" | "business">("business");

  // State cho form fields
  const [bankAccountNumber, setBankAccountNumber] = useState(formData?.bankAccountNumber || formData?.settlementBankAccountNumber || "");
  const [bankAccountHolder, setBankAccountHolder] = useState(formData?.bankAccountHolder || formData?.settlementBankAccountHolder || "");

  useEffect(() => {
    getBanks().then((info) => {
      setDataBanks(info || [])
    })
  }, [])

  // Load existing bank info from formData
  useEffect(() => {
    if ((formData?.bankName || formData?.settlementBankName) && dataBanks.length > 0) {
      const existingBank = dataBanks.find(bank => (bank.bankName === formData.bankName) || (bank.bankName === formData.settlementBankName));
      if (existingBank) {
        setSelectedBank(existingBank);
      }
      setTypeAccount(formData?.bankName ? "business" : "personal");
    }
  }, [formData?.bankName, formData?.settlementBankName, dataBanks]);

  // Hàm validation và xử lý nút tiếp tục
  const handleContinue = () => {
    // Kiểm tra validation cho tất cả các trường bắt buộc
    const validationErrors: string[] = [];

    // Kiểm tra ngân hàng đã chọn
    if (!selectedBank) {
      validationErrors.push("Vui lòng chọn ngân hàng");
    }

    // Kiểm tra số tài khoản
    if (!bankAccountNumber.trim()) {
      validationErrors.push("Vui lòng nhập số tài khoản");
    } else if (!/^[0-9]{6,20}$/.test(bankAccountNumber.trim())) {
      validationErrors.push("Số tài khoản phải từ 6-20 chữ số");
    }

    // Kiểm tra chủ tài khoản
    if (!bankAccountHolder.trim()) {
      validationErrors.push("Vui lòng nhập tên chủ tài khoản");
    } else if (bankAccountHolder.trim().length < 2) {
      validationErrors.push("Tên chủ tài khoản phải có ít nhất 2 ký tự");
    }

    // Nếu có lỗi validation, hiển thị lỗi đầu tiên
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }
    let fmt = { ...formData };
    //personal là tài khoản báo có
    //business là tài khoản doanh nghiệp
    if (typeAccount === "personal") {
      fmt = {
        ...fmt,
        bankName: "",
        bankAccountNumber: "",
        bankAccountHolder: "",
        settlementBankName: selectedBank!.bankName,
        settlementBankAccountNumber: bankAccountNumber.trim(),
        settlementBankAccountHolder: bankAccountHolder.trim(),
      }
    } else {
      fmt = {
        ...fmt,
        bankName: selectedBank!.bankName,
        bankAccountNumber: bankAccountNumber.trim(),
        bankAccountHolder: bankAccountHolder.trim(),
        settlementBankName: "",
        settlementBankAccountNumber: "",
        settlementBankAccountHolder: "",
      }
    }
    // Nếu tất cả validation đều pass, lưu vào atom và chuyển sang trang tiếp theo
    setFormData({ ...fmt });

    navigate("/store/documents");
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
            <StepPill active>2/4</StepPill>
            <div className="mb-2 text-[15px] font-semibold mt-3 text-nowrap">Tài khoản ngân hàng</div>
            <div className="mb-3 text-[13px] text-[#6b7280]">Thông tin cấu hình ghi nhận báo có</div>
          </div>
          <div className="h-[1px] border-b border-dashed border-[#94A3B8] min-w-[56px] my-auto" />
          <div>
            <StepPill>3/4</StepPill>
            <div className="mb-2 text-[15px] font-semibold mt-3 text-nowrap">Tài liệu đính kèm</div>
            <div className="mb-3 text-[13px] text-[#6b7280]">Tài liệu, hình ảnh xác thực cửa hàng</div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-20 top-16 h-32 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(255,165,0,0.25),transparent)]" />
      </div>

      <div className="px-4 mb-4">
        <p className="mb-2 text-[15px] font-semibold text-nowrap">Thông tin cơ bản</p>
        <div className="grid grid-cols-2 rounded-t-2xl overflow-hidden">
          <button
            className={
              cn("flex items-center text-xs gap-2 py-3 px-2 text-[#1A1A1A70] font-bold border-b border-[#E1E1E2]", typeAccount === "business" && "bg-[#FFF6EB] text-[#F67416] border-[#F67416]")
            }
            onClick={() => setTypeAccount("business")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
              <path d="M22 21.1875H19.5625V2.8125H20.5C20.6492 2.8125 20.7923 2.75324 20.8977 2.64775C21.0032 2.54226 21.0625 2.39918 21.0625 2.25C21.0625 2.10082 21.0032 1.95774 20.8977 1.85225C20.7923 1.74676 20.6492 1.6875 20.5 1.6875H4C3.85082 1.6875 3.70774 1.74676 3.60225 1.85225C3.49676 1.95774 3.4375 2.10082 3.4375 2.25C3.4375 2.39918 3.49676 2.54226 3.60225 2.64775C3.70774 2.75324 3.85082 2.8125 4 2.8125H4.9375V21.1875H2.5C2.35082 21.1875 2.20774 21.2468 2.10225 21.3523C1.99676 21.4577 1.9375 21.6008 1.9375 21.75C1.9375 21.8992 1.99676 22.0423 2.10225 22.1477C2.20774 22.2532 2.35082 22.3125 2.5 22.3125H22C22.1492 22.3125 22.2923 22.2532 22.3977 22.1477C22.5032 22.0423 22.5625 21.8992 22.5625 21.75C22.5625 21.6008 22.5032 21.4577 22.3977 21.3523C22.2923 21.2468 22.1492 21.1875 22 21.1875ZM6.0625 2.8125H18.4375V21.1875H15.0625V17.25C15.0625 17.1008 15.0032 16.9577 14.8977 16.8523C14.7923 16.7468 14.6492 16.6875 14.5 16.6875H10C9.85082 16.6875 9.70774 16.7468 9.60225 16.8523C9.49676 16.9577 9.4375 17.1008 9.4375 17.25V21.1875H6.0625V2.8125ZM13.9375 21.1875H10.5625V17.8125H13.9375V21.1875ZM8.6875 6C8.6875 5.85082 8.74676 5.70774 8.85225 5.60225C8.95774 5.49676 9.10082 5.4375 9.25 5.4375H10.75C10.8992 5.4375 11.0423 5.49676 11.1477 5.60225C11.2532 5.70774 11.3125 5.85082 11.3125 6C11.3125 6.14918 11.2532 6.29226 11.1477 6.39775C11.0423 6.50324 10.8992 6.5625 10.75 6.5625H9.25C9.10082 6.5625 8.95774 6.50324 8.85225 6.39775C8.74676 6.29226 8.6875 6.14918 8.6875 6ZM13.1875 6C13.1875 5.85082 13.2468 5.70774 13.3523 5.60225C13.4577 5.49676 13.6008 5.4375 13.75 5.4375H15.25C15.3992 5.4375 15.5423 5.49676 15.6477 5.60225C15.7532 5.70774 15.8125 5.85082 15.8125 6C15.8125 6.14918 15.7532 6.29226 15.6477 6.39775C15.5423 6.50324 15.3992 6.5625 15.25 6.5625H13.75C13.6008 6.5625 13.4577 6.50324 13.3523 6.39775C13.2468 6.29226 13.1875 6.14918 13.1875 6ZM8.6875 9.75C8.6875 9.60082 8.74676 9.45774 8.85225 9.35225C8.95774 9.24676 9.10082 9.1875 9.25 9.1875H10.75C10.8992 9.1875 11.0423 9.24676 11.1477 9.35225C11.2532 9.45774 11.3125 9.60082 11.3125 9.75C11.3125 9.89918 11.2532 10.0423 11.1477 10.1477C11.0423 10.2532 10.8992 10.3125 10.75 10.3125H9.25C9.10082 10.3125 8.95774 10.2532 8.85225 10.1477C8.74676 10.0423 8.6875 9.89918 8.6875 9.75ZM13.1875 9.75C13.1875 9.60082 13.2468 9.45774 13.3523 9.35225C13.4577 9.24676 13.6008 9.1875 13.75 9.1875H15.25C15.3992 9.1875 15.5423 9.24676 15.6477 9.35225C15.7532 9.45774 15.8125 9.60082 15.8125 9.75C15.8125 9.89918 15.7532 10.0423 15.6477 10.1477C15.5423 10.2532 15.3992 10.3125 15.25 10.3125H13.75C13.6008 10.3125 13.4577 10.2532 13.3523 10.1477C13.2468 10.0423 13.1875 9.89918 13.1875 9.75ZM9.25 14.0625C9.10082 14.0625 8.95774 14.0032 8.85225 13.8977C8.74676 13.7923 8.6875 13.6492 8.6875 13.5C8.6875 13.3508 8.74676 13.2077 8.85225 13.1023C8.95774 12.9968 9.10082 12.9375 9.25 12.9375H10.75C10.8992 12.9375 11.0423 12.9968 11.1477 13.1023C11.2532 13.2077 11.3125 13.3508 11.3125 13.5C11.3125 13.6492 11.2532 13.7923 11.1477 13.8977C11.0423 14.0032 10.8992 14.0625 10.75 14.0625H9.25ZM13.1875 13.5C13.1875 13.3508 13.2468 13.2077 13.3523 13.1023C13.4577 12.9968 13.6008 12.9375 13.75 12.9375H15.25C15.3992 12.9375 15.5423 12.9968 15.6477 13.1023C15.7532 13.2077 15.8125 13.3508 15.8125 13.5C15.8125 13.6492 15.7532 13.7923 15.6477 13.8977C15.5423 14.0032 15.3992 14.0625 15.25 14.0625H13.75C13.6008 14.0625 13.4577 14.0032 13.3523 13.8977C13.2468 13.7923 13.1875 13.6492 13.1875 13.5Z" fill={typeAccount === "business" ? "#F67416" : "#56524E"} />
            </svg>
            <p>Tài khoản công ty</p>
          </button>

          <button
            className={
              cn("flex items-center text-xs gap-2 py-3 px-2 text-[#1A1A1A70] font-bold border-b border-[#E1E1E2]", typeAccount === "personal" && "bg-[#FFF6EB] text-[#F67416] border-[#F67416]")
            }
            onClick={() => setTypeAccount("personal")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill={typeAccount === "personal" ? "#F67416" : "#56524E"}>
              <path d="M3.75 16.5C3.34 16.5 3 16.16 3 15.75V8.25C3 7.84 3.34 7.5 3.75 7.5C4.16 7.5 4.5 7.84 4.5 8.25V15.75C4.5 16.16 4.16 16.5 3.75 16.5Z" />
              <path d="M8.25 19C7.84 19 7.5 18.66 7.5 18.25V5.75C7.5 5.34 7.84 5 8.25 5C8.66 5 9 5.34 9 5.75V18.25C9 18.66 8.66 19 8.25 19Z" />
              <path d="M12.75 21.5C12.34 21.5 12 21.16 12 20.75V3.25C12 2.84 12.34 2.5 12.75 2.5C13.16 2.5 13.5 2.84 13.5 3.25V20.75C13.5 21.16 13.16 21.5 12.75 21.5Z" />
              <path d="M17.25 19C16.84 19 16.5 18.66 16.5 18.25V5.75C16.5 5.34 16.84 5 17.25 5C17.66 5 18 5.34 18 5.75V18.25C18 18.66 17.66 19 17.25 19Z" />
              <path d="M21.75 16.5C21.34 16.5 21 16.16 21 15.75V8.25C21 7.84 21.34 7.5 21.75 7.5C22.16 7.5 22.5 7.84 22.5 8.25V15.75C22.5 16.16 22.16 16.5 21.75 16.5Z" />
            </svg>
            <p>Tài khoản báo có</p>
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-3 px-4">
        <Dropdown
          label={selectedBank ? selectedBank.bankName : "Ngân hàng"}
          leading={(
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 11.75H3C2.04 11.75 1.25 10.96 1.25 10V6.68001C1.25 6.00001 1.71998 5.31001 2.34998 5.06001L11.35 1.46003C11.73 1.31003 12.27 1.31003 12.65 1.46003L21.65 5.06001C22.28 5.31001 22.75 6.01 22.75 6.68001V10C22.75 10.96 21.96 11.75 21 11.75ZM12 2.84004C11.96 2.84004 11.92 2.83999 11.9 2.84999L2.90997 6.45002C2.84997 6.48002 2.75 6.61 2.75 6.68001V10C2.75 10.14 2.86 10.25 3 10.25H21C21.14 10.25 21.25 10.14 21.25 10V6.68001C21.25 6.61 21.16 6.48002 21.09 6.45002L12.09 2.84999C12.07 2.83999 12.04 2.84004 12 2.84004Z" fill="#A8A29F" />
              <path d="M22 22.75H2C1.59 22.75 1.25 22.41 1.25 22V19C1.25 18.04 2.04 17.25 3 17.25H21C21.96 17.25 22.75 18.04 22.75 19V22C22.75 22.41 22.41 22.75 22 22.75ZM2.75 21.25H21.25V19C21.25 18.86 21.14 18.75 21 18.75H3C2.86 18.75 2.75 18.86 2.75 19V21.25Z" fill="#A8A29F" />
              <path d="M4 18.75C3.59 18.75 3.25 18.41 3.25 18V11C3.25 10.59 3.59 10.25 4 10.25C4.41 10.25 4.75 10.59 4.75 11V18C4.75 18.41 4.41 18.75 4 18.75Z" fill="#A8A29F" />
              <path d="M8 18.75C7.59 18.75 7.25 18.41 7.25 18V11C7.25 10.59 7.59 10.25 8 10.25C8.41 10.25 8.75 10.59 8.75 11V18C8.75 18.41 8.41 18.75 8 18.75Z" fill="#A8A29F" />
              <path d="M12 18.75C11.59 18.75 11.25 18.41 11.25 18V11C11.25 10.59 11.59 10.25 12 10.25C12.41 10.25 12.75 10.59 12.75 11V18C12.75 18.41 12.41 18.75 12 18.75Z" fill="#A8A29F" />
              <path d="M16 18.75C15.59 18.75 15.25 18.41 15.25 18V11C15.25 10.59 15.59 10.25 16 10.25C16.41 10.25 16.75 10.59 16.75 11V18C16.75 18.41 16.41 18.75 16 18.75Z" fill="#A8A29F" />
              <path d="M20 18.75C19.59 18.75 19.25 18.41 19.25 18V11C19.25 10.59 19.59 10.25 20 10.25C20.41 10.25 20.75 10.59 20.75 11V18C20.75 18.41 20.41 18.75 20 18.75Z" fill="#A8A29F" />
              <path d="M23 22.75H1C0.59 22.75 0.25 22.41 0.25 22C0.25 21.59 0.59 21.25 1 21.25H23C23.41 21.25 23.75 21.59 23.75 22C23.75 22.41 23.41 22.75 23 22.75Z" fill="#A8A29F" />
              <path d="M12 9.25C10.76 9.25 9.75 8.24 9.75 7C9.75 5.76 10.76 4.75 12 4.75C13.24 4.75 14.25 5.76 14.25 7C14.25 8.24 13.24 9.25 12 9.25ZM12 6.25C11.59 6.25 11.25 6.59 11.25 7C11.25 7.41 11.59 7.75 12 7.75C12.41 7.75 12.75 7.41 12.75 7C12.75 6.59 12.41 6.25 12 6.25Z" fill="#A8A29F" />
            </svg>
          )}
          isColor={!!selectedBank}
          onClick={() => setShowBankSheet(true)}
        />
        <Field
          label="Số tài khoản"
          placeholder="Số tài khoản"
          leading={(
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22 9.25H2C1.59 9.25 1.25 8.91 1.25 8.5C1.25 8.09 1.59 7.75 2 7.75H22C22.41 7.75 22.75 8.09 22.75 8.5C22.75 8.91 22.41 9.25 22 9.25Z" fill="#A8A29F" />
              <path d="M8 17.25H6C5.59 17.25 5.25 16.91 5.25 16.5C5.25 16.09 5.59 15.75 6 15.75H8C8.41 15.75 8.75 16.09 8.75 16.5C8.75 16.91 8.41 17.25 8 17.25Z" fill="#A8A29F" />
              <path d="M14.5 17.25H10.5C10.09 17.25 9.75 16.91 9.75 16.5C9.75 16.09 10.09 15.75 10.5 15.75H14.5C14.91 15.75 15.25 16.09 15.25 16.5C15.25 16.91 14.91 17.25 14.5 17.25Z" fill="#A8A29F" />
              <path d="M17.56 21.25H6.44C2.46 21.25 1.25 20.05 1.25 16.11V7.89C1.25 3.95 2.46 2.75 6.44 2.75H17.55C21.53 2.75 22.74 3.95 22.74 7.89V16.1C22.75 20.05 21.54 21.25 17.56 21.25ZM6.44 4.25C3.3 4.25 2.75 4.79 2.75 7.89V16.1C2.75 19.2 3.3 19.74 6.44 19.74H17.55C20.69 19.74 21.24 19.2 21.24 16.1V7.89C21.24 4.79 20.69 4.25 17.55 4.25H6.44Z" fill="#A8A29F" />
            </svg>
          )}
          inputMode="numeric"
          value={bankAccountNumber}
          onChange={(e) => setBankAccountNumber(e.target.value)}
        />
        <Field
          label="Chủ tài khoản"
          placeholder="Chủ tài khoản"
          leading={(
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22 9.25H2C1.59 9.25 1.25 8.91 1.25 8.5C1.25 8.09 1.59 7.75 2 7.75H22C22.41 7.75 22.75 8.09 22.75 8.5C22.75 8.91 22.41 9.25 22 9.25Z" fill="#A8A29F" />
              <path d="M8 17.25H6C5.59 17.25 5.25 16.91 5.25 16.5C5.25 16.09 5.59 15.75 6 15.75H8C8.41 15.75 8.75 16.09 8.75 16.5C8.75 16.91 8.41 17.25 8 17.25Z" fill="#A8A29F" />
              <path d="M14.5 17.25H10.5C10.09 17.25 9.75 16.91 9.75 16.5C9.75 16.09 10.09 15.75 10.5 15.75H14.5C14.91 15.75 15.25 16.09 15.25 16.5C15.25 16.91 14.91 17.25 14.5 17.25Z" fill="#A8A29F" />
              <path d="M17.56 21.25H6.44C2.46 21.25 1.25 20.05 1.25 16.11V7.89C1.25 3.95 2.46 2.75 6.44 2.75H17.55C21.53 2.75 22.74 3.95 22.74 7.89V16.1C22.75 20.05 21.54 21.25 17.56 21.25ZM6.44 4.25C3.3 4.25 2.75 4.79 2.75 7.89V16.1C2.75 19.2 3.3 19.74 6.44 19.74H17.55C20.69 19.74 21.24 19.2 21.24 16.1V7.89C21.24 4.79 20.69 4.25 17.55 4.25H6.44Z" fill="#A8A29F" />
            </svg>
          )}
          value={bankAccountHolder}
          onChange={(e) => setBankAccountHolder(e.target.value)}
        />
      </div>

      {/* Spacer for bottom CTA */}
      <div className="h-28" />

      {/* Bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full bg-white/80 p-4 backdrop-blur pb-6">
        <button onClick={handleContinue} className="h-14 w-full rounded-2xl bg-gradient-to-r from-[#FF9F2E] to-[#FF4D00] text-base font-semibold text-white shadow-[0_8px_16px_rgba(255,125,0,0.35)] active:scale-[0.99]">
          Tiếp tục
        </button>
      </div>

      {/* Bank Selection Sheet */}
      {showBankSheet && (
        <BankSheet
          banks={dataBanks}
          searchText={searchBankText}
          onSearchChange={setSearchBankText}
          onSelectBank={(bank) => {
            setSelectedBank(bank);
            setShowBankSheet(false);
            setSearchBankText("");
          }}
          onClose={() => {
            setShowBankSheet(false);
            setSearchBankText("");
          }}
        />
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

function Field({ label, placeholder, inputMode, leading, value, onChange }: {
  label: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  leading?: React.ReactNode;
  value?: string;
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
          onChange={onChange}
        />
      </div>
    </label>
  );
}

function Dropdown({ label, leading, chevron = true, isColor = false, onClick }: { label: string; leading?: React.ReactNode; chevron?: boolean; isColor?: boolean; onClick?: () => void; children?: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 cursor-pointer"
      onClick={onClick}
    >
      {leading}
      <span className={`flex-1 text-[15px] ${isColor ? 'text-black' : 'text-[#9CA3AF]'}`}>{label}</span>
      {chevron && <ChevronDown />}
    </div>
  );
}
