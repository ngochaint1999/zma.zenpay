import jwtAxios from "@/services/jwt-api";
import { IReqCropsCreate, IResCrops, IResCropsCreate } from "@/types/crops/crops.types";

const cropsApis = {
  getCrops: async (): Promise<IResCrops> => {
    const response = await jwtAxios.get<IResCrops>("/crops");
    return response.data;
  },
  createCrops: async (data: IReqCropsCreate): Promise<IResCropsCreate> => {
    const response = await jwtAxios.post<IResCropsCreate>("/crops/crop", data);
    return response.data;
  },
}

export default cropsApis;