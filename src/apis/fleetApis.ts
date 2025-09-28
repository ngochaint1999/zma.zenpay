import jwtAxios from "@/services/jwt-api";
import { IReqFleetCreate, IResFleets, IResFleetsCreate } from "@/types/fleet/fleet.types";

const fleetApis = {
  getFleets: async (): Promise<IResFleets> => {
    const response = await jwtAxios.get<IResFleets>("/fleets");
    return response.data;
  },
  createFleet: async (data: IReqFleetCreate): Promise<IResFleetsCreate> => {
    const response = await jwtAxios.post<IResFleetsCreate>("/fleets/fleet", data);
    return response.data;
  },
}

export default fleetApis;