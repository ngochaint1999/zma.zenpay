import jwtAxios from "@/services/jwt-api";
import { ICalendarsResponse } from "@/types/calendar/calendar.types";

const calendarApis = {
  getCalendars: async (params: { dateFrom: string; dateTo: string; }): Promise<ICalendarsResponse> => {
    const response = await jwtAxios.get<ICalendarsResponse>("/calendars/search", { params });
    return response.data;
  }
}

export default calendarApis;