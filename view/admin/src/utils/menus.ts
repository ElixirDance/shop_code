import { getAllAuthority } from "@/api/authority/authority";
import type { MainMenu } from "@/types/common/common.d";
export const updateMenu = async () => {
    try {
        const result = await getAllAuthority();
        return result as MainMenu[];
    } catch (error) {
    }
}
