import { useRiderStore } from "@/store/riderStore";
import { tokenStorage } from "@/store/storage";
import { useUserStore } from "@/store/userStore";
import { resetAndNavigate } from "@/utils/Helpers";

export const logout = async (disconnect?: () => void) => {
    if (disconnect) {
        disconnect();
    }
    const {clearData} = useUserStore.getState();
    const {clearRiderData} = useRiderStore.getState();
    
    tokenStorage.clearAll()
    clearData();
    clearRiderData();
    resetAndNavigate("/role");
};