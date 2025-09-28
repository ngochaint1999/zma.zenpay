import jwtAxios from "@/services/jwt-api";
import { IResBookingCreate, IReqBookingCreate, IResBookings } from "@/types/booking/booking.types";

const bookingApis = {
  getBookings: async (): Promise<IResBookings> => {
    const response = await jwtAxios.get<IResBookings>("/bookings/booking");
    return response.data;
  },
  createBooking: async (data: IReqBookingCreate): Promise<IResBookingCreate> => {
    const response = await jwtAxios.post<IResBookingCreate>("/bookings/booking", data);
    return response.data;
  },
}

export default bookingApis;