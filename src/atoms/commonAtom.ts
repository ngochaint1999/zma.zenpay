 
import { atom } from "jotai";

import { ICommon } from "@/types/common/common.types";

// Atom lưu danh sách common
export const commonAtom = atom<ICommon>({
  loading: false,
}); 