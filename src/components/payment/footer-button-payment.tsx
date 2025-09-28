
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";

import { cartState } from "@/state";
import { Button } from "@/ui/button"

const FooterButtonPayment = () => {
  const navigate = useNavigate();
  const cart = useAtomValue(cartState);

  if (!cart?.length) return null;
  return (
    <div className="px-4 py-3 pb-6 w-full">
      <Button onClick={() => void navigate("/payment")} className="h-14 w-full rounded-[36px] !bg-[#5433EB] text-white text-md font-semibold shadow-sm">
        Thanh toán ngay
      </Button>
    </div>
  )
}

export default FooterButtonPayment;