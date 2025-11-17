import { Platform } from "react-native";

// Android uses your Windows PC local IP
// Backend runs at: http://192.168.1.3:3000

export const BASE_URL =
  Platform.OS === "ios"
    ? "http://localhost:3000"
    : "http://192.168.1.3:3000";

export const SOCKET_URL =
  Platform.OS === "ios"
    ? "ws://localhost:3000"
    : "ws://192.168.1.3:3000";

// Optional: Always use the same IP (recommended on Android)
//export const BASE_URL_FIXED = "http://192.168.1.3:3000";
//export const SOCKET_URL_FIXED = "ws://192.168.1.3:3000";
