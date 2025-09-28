import Logo from "../static/icons/logo.svg";

const AppLoading = () => (
  <div className="absolute z-[100000] left-0 h-screen w-screen flex flex-col justify-center items-center">
    <div className="flex flex-col justify-center items-center bg-white/80 p-4 rounded-lg shadow-md">
      <img src={Logo} alt="ai" className="w-24 pb-3" />
      <p className="mt-2 font-medium">ZenPay đang xử lý...</p>
    </div>
  </div>
)

export default AppLoading