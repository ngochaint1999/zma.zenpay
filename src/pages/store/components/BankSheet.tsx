import { BankData } from "@/types/home.types";
import TopSheet from "../../../static/images/top-sheet.png";

/* ----------------- Bank Sheet Component ----------------- */
export function BankSheet({
  banks,
  searchText,
  onSearchChange,
  onSelectBank,
  onClose,
}: {
  banks: BankData[];
  searchText: string;
  onSearchChange: (text: string) => void;
  onSelectBank: (bank: BankData) => void;
  onClose: () => void;
}) {
  const filteredBanks = banks.filter(bank =>
    bank.bankName.toLowerCase().includes(searchText.toLowerCase()) ||
    bank.bankCode.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="w-full relative max-w-md bg-white rounded-t-3xl overflow-hidden min-h-[92vh] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center justify-between">
          <img src={TopSheet} />
          <h3 className="text-lg font-semibold">Thêm tài khoản nhận báo có</h3>
          <button
            onClick={onClose}
            className="h-8 px-6 absolute right-4 top-4 bg-white flex items-center justify-center border border-[#E1E1E2] rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10.2912 0.29387C10.6817 -0.0966474 11.3147 -0.0966521 11.7052 0.29387C12.0958 0.684392 12.0958 1.31741 11.7052 1.70793L7.4113 6.0009L11.7043 10.2939L11.7726 10.3691C12.0932 10.7618 12.0705 11.3417 11.7043 11.7079C11.3381 12.0741 10.7582 12.0969 10.3654 11.7763L10.2902 11.7079L5.99724 7.41496L1.70525 11.7079L1.63005 11.7763C1.23728 12.0969 0.657386 12.0741 0.291184 11.7079C-0.0750176 11.3417 -0.0977618 10.7618 0.222825 10.3691L0.291184 10.2939L4.58318 6.0009L0.290208 1.70793C-0.100317 1.31741 -0.100317 0.684394 0.290208 0.29387C0.680732 -0.0966545 1.31375 -0.0966545 1.70427 0.29387L5.99724 4.58684L10.2912 0.29387Z" fill="#78726D" />
            </svg>
          </button>
        </div>

        <div className={`flex items-center gap-2 rounded-2xl mx-4 mt-3 px-4 py-3 text-2xs text-[13px] bg-[#FFF6EB]`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M10.5267 1.76L10.48 4.28666C10.4733 4.63333 10.6934 5.09333 10.9734 5.3L12.6267 6.55333C13.6867 7.35333 13.5133 8.33334 12.2467 8.73334L10.0934 9.40667C9.73336 9.52 9.35336 9.91333 9.26002 10.28L8.74668 12.24C8.34001 13.7867 7.32667 13.94 6.48667 12.58L5.31333 10.68C5.09999 10.3333 4.59333 10.0733 4.19333 10.0933L1.96669 10.2067C0.373355 10.2867 -0.0799842 9.36666 0.960016 8.15333L2.28 6.61999C2.52667 6.33333 2.64 5.8 2.52667 5.44L1.85337 3.28666C1.46003 2.01999 2.16669 1.32 3.42669 1.73334L5.39336 2.38C5.7267 2.48667 6.22669 2.41333 6.50669 2.20666L8.56003 0.726663C9.6667 -0.0733369 10.5533 0.393332 10.5267 1.76Z" fill="#F79D23" />
          </svg>
          <span>Hỗ trợ tính năng như báo có qua Loa/Tự động gạch nợ</span>
        </div>

        {/* Search */}
        <div className="p-4 pb-0">
          <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 5.75H14C13.59 5.75 13.25 5.41 13.25 5C13.25 4.59 13.59 4.25 14 4.25H20C20.41 4.25 20.75 4.59 20.75 5C20.75 5.41 20.41 5.75 20 5.75Z" fill="#A8A29F" />
              <path d="M17 8.75H14C13.59 8.75 13.25 8.41 13.25 8C13.25 7.59 13.59 7.25 14 7.25H17C17.41 7.25 17.75 7.59 17.75 8C17.75 8.41 17.41 8.75 17 8.75Z" fill="#A8A29F" />
              <path d="M11.5 21.75C5.85 21.75 1.25 17.15 1.25 11.5C1.25 5.85 5.85 1.25 11.5 1.25C11.91 1.25 12.25 1.59 12.25 2C12.25 2.41 11.91 2.75 11.5 2.75C6.67 2.75 2.75 6.68 2.75 11.5C2.75 16.32 6.67 20.25 11.5 20.25C16.33 20.25 20.25 16.32 20.25 11.5C20.25 11.09 20.59 10.75 21 10.75C21.41 10.75 21.75 11.09 21.75 11.5C21.75 17.15 17.15 21.75 11.5 21.75Z" fill="#A8A29F" />
              <path d="M21.9999 22.75C21.8099 22.75 21.6199 22.68 21.4699 22.53L19.4699 20.53C19.1799 20.24 19.1799 19.76 19.4699 19.47C19.7599 19.18 20.2399 19.18 20.5299 19.47L22.5299 21.47C22.8199 21.76 22.8199 22.24 22.5299 22.53C22.3799 22.68 22.1899 22.75 21.9999 22.75Z" fill="#A8A29F" />
            </svg>
            <input
              className="w-full appearance-none bg-transparent text-[15px] placeholder:text-[#9CA3AF] focus:outline-none"
              placeholder="Tìm và chọn ngân hàng trong danh sách"
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Bank List */}
        <div className="flex-1 overflow-y-auto px-4 pt-4">
          {filteredBanks.length > 0 ? (
            filteredBanks.map((bank) => (
              <button
                key={bank.bankCode}
                onClick={() => onSelectBank(bank)}
                className="w-full mb-4 flex flex-col items-start gap-2 rounded-xl justify-center px-4 py-3 hover:bg-gray-50 border border-[#E1E1E2] transition-colors"
              >
                <div className="text-[15px] font-medium text-gray-900">{bank.bankName}</div>
                <div className="text-[13px] text-gray-500">Mã: {bank.bankCode}</div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              Không tìm thấy ngân hàng nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
}