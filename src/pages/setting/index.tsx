import Gold from "../../static/images/gold.png";

export default function SettingPage() {
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
        <h1 className="mb-1 text-[20px] font-semibold leading-tight tracking-tight pt-4">
          Thiết lập thông tin
        </h1>
      </div>
    </div>
  );
}
