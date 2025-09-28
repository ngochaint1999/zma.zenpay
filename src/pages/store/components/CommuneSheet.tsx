import { ICommunesData } from "@/types/home.types";
import TopSheet from "../../../static/images/top-sheet.png";

/* ----------------- Commune Sheet Component ----------------- */
export function CommuneSheet({
  communes,
  searchText,
  onSearchChange,
  onSelectCommune,
  onClose,
  onBack,
}: {
  communes: ICommunesData[];
  searchText: string;
  onSearchChange: (text: string) => void;
  onSelectCommune: (commune: ICommunesData) => void;
  onClose: () => void;
  onBack: () => void;
}) {
  const filteredCommunes = communes.filter(commune =>
    commune.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="w-full relative max-w-md bg-white rounded-t-3xl overflow-hidden min-h-[92vh] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center justify-between">
          <img src={TopSheet} />
          <h3 className="text-lg font-semibold">Chọn Phường/Xã</h3>
          <button
            onClick={onBack}
            className="h-8 px-6 absolute left-4 top-4 bg-white flex items-center justify-center border border-[#E1E1E2] rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="18" viewBox="0 0 9 18" fill="none">
              <path d="M8.00003 17.67C7.81003 17.67 7.62003 17.6 7.47003 17.45L0.950029 10.93C-0.109971 9.87002 -0.109971 8.13002 0.950029 7.07002L7.47003 0.55002C7.76003 0.26002 8.24003 0.26002 8.53003 0.55002C8.82003 0.84002 8.82003 1.32002 8.53003 1.61002L2.01003 8.13002C1.53003 8.61002 1.53003 9.39002 2.01003 9.87002L8.53003 16.39C8.82003 16.68 8.82003 17.16 8.53003 17.45C8.38003 17.59 8.19003 17.67 8.00003 17.67Z" fill="#56524E" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="h-8 px-6 absolute right-4 top-4 bg-white flex items-center justify-center border border-[#E1E1E2] rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10.2912 0.29387C10.6817 -0.0966474 11.3147 -0.0966521 11.7052 0.29387C12.0958 0.684392 12.0958 1.31741 11.7052 1.70793L7.4113 6.0009L11.7043 10.2939L11.7726 10.3691C12.0932 10.7618 12.0705 11.3417 11.7043 11.7079C11.3381 12.0741 10.7582 12.0969 10.3654 11.7763L10.2902 11.7079L5.99724 7.41496L1.70525 11.7079L1.63005 11.7763C1.23728 12.0969 0.657386 12.0741 0.291184 11.7079C-0.0750176 11.3417 -0.0977618 10.7618 0.222825 10.3691L0.291184 10.2939L4.58318 6.0009L0.290208 1.70793C-0.100317 1.31741 -0.100317 0.684394 0.290208 0.29387C0.680732 -0.0966545 1.31375 -0.0966545 1.70427 0.29387L5.99724 4.58684L10.2912 0.29387Z" fill="#78726D" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 pb-0">
          <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 5.75H14C13.59 5.75 13.25 5.41 13.25 5C13.25 4.59 13.59 4.25 14 4.25H20C20.41 4.25 20.75 4.59 20.75 5C20.75 5.41 20.41 5.75 20 5.75Z" fill="#A8A29F" />
              <path d="M17 8.75H14C13.59 8.75 13.25 8.41 13.25 8C13.25 7.59 13.59 7.25 14 7.25H17C17.41 7.25 17.75 7.59 17.75 8C17.75 8.41 17.41 8.75 17 8.75Z" fill="#A8A29F" />
              <path d="M11.5 21.75C5.85 21.75 1.25 17.15 1.25 11.5C1.25 5.85 5.85 1.25 11.5 1.25C11.91 1.25 12.25 1.59 12.25 2C12.25 2.41 11.91 2.75 11.5 2.75C6.67 2.75 2.75 6.68 2.75 11.5C2.75 16.32 6.67 20.25 11.5 20.25C16.33 20.25 20.25 16.32 20.25 11.5C20.25 11.09 20.59 10.75 21 10.75C21.41 10.75 21.75 11.09 21.75 11.5C21.75 17.15 17.15 21.75 11.5 21.75Z" fill="#A8A29F" />
              <path d="M22 22.7499C21.81 22.7499 21.62 22.6799 21.47 22.5299L19.47 20.5299C19.18 20.2399 19.18 19.7599 19.47 19.4699C19.76 19.1799 20.24 19.1799 20.53 19.4699L22.53 21.4699C22.82 21.7599 22.82 22.2399 22.53 22.5299C22.38 22.6799 22.19 22.7499 22 22.7499Z" fill="#A8A29F" />
            </svg>
            <input
              className="w-full appearance-none bg-transparent text-[15px] placeholder:text-[#9CA3AF] focus:outline-none"
              placeholder="Nhập từ khóa để tìm kiếm"
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Commune List */}
        <div className="flex-1 overflow-y-auto px-4 pt-4">
          {filteredCommunes.length > 0 ? (
            filteredCommunes.map((commune) => (
              <button
                key={commune.id}
                onClick={() => onSelectCommune(commune)}
                className="w-full mb-4 flex items-center gap-2 rounded-xl justify-center px-4 py-3 hover:bg-gray-50 border border-[#E1E1E2] transition-colors"
              >
                <div className="text-[15px] font-medium text-gray-900">{commune.name}</div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              Không tìm thấy quận/huyện/xã nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
}