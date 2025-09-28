import jwtAxios from "@/services/jwt-api";
import { IReqLandCreate, IResLands, IResLandsCreate } from "@/types/land/land.types";

const landApis = {
  getLands: async (token: string): Promise<IResLands> => {
    const response = await jwtAxios.get<IResLands>("/land-plots/get-land/customer", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  },
  createLand: async (data: IReqLandCreate, token: string): Promise<IResLandsCreate> => {
    const response = await jwtAxios.post<IResLandsCreate>("/land-plots/land-plot", data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
}

export default landApis;