import { api } from "../api/client";
import digitalCertificate from "../assets/digital-certificate.jpg";
import idCard from "../assets/id-card.jpg";
import license from "../assets/license.jpg";
import passport from "../assets/passport.webp";

const API_BASE = import.meta.env.VITE_API_URL || "/api";
const IS_DEMO = import.meta.env.VITE_DEMO_MODE !== "false";

// Pool of demo images to cycle through
const DEMO_ASSET_IMAGES = [digitalCertificate, idCard, license, passport];

// Simple deterministic hash so the same assetId always maps to the same image
function getDemoImageForAsset(assetId: string) {
  let hash = 0;
  for (let i = 0; i < assetId.length; i++) {
    hash = (hash * 31 + assetId.charCodeAt(i)) >>> 0; // >>> 0 keeps it unsigned
  }
  return DEMO_ASSET_IMAGES[hash % DEMO_ASSET_IMAGES.length];
}

export const digitalAssetApi = {
  uploadDigitalAsset: async (formData: FormData) => {
    return await api.postFormData("/assets/upload", formData);
  },

  getDigitalAssets: async () => {
    return await api.get("/assets");
  },

  getDigitalAsset: async (assetId: string) => {
    return await api.get(`/assets/${assetId}`);
  },

  getDigitalAssetFileUrl: (assetId: string) => {
    if (IS_DEMO) {
      return getDemoImageForAsset(assetId);
    }
    return `${API_BASE}/assets/${assetId}/file`;
  },

  verifyDigitalAsset: async (assetId: string) => {
    if (IS_DEMO) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true };
    }
    return await api.get(`/assets/${assetId}/verify`);
  }
};