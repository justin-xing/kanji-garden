import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const generateMnemonic = async (
  character: string,
  meaning: string,
  parts: string[],
  defaultMnemonic?: string
): Promise<string> => {
  if (parts.length === 0 && defaultMnemonic) {
    return defaultMnemonic;
  } else {
    try {
      const body = {
        character,
        meaning,
        parts,
      };
      const response = await axios.post(`${BACKEND_URL}/mnemonic`, body);
      return response.data;
    } catch (error) {
      console.error("Error generating mnemonic from backend:", error);
      return "Unable to generate a mnemonic at this time. Try again later.";
    }
  }
};

export const generateKanjiVisualization = async (
  mnemonic: string,
  referenceImageUrl?: string
): Promise<string | null> => {
  try {
    const body = {
      mnemonic,
      image: referenceImageUrl,
    };
    const response = await axios.post(`${BACKEND_URL}/imagen`, body);
    console.log(response.data);
    return response.data.image;
  } catch (error) {
    console.error("Error generating visualization:", error);
    return null;
  }
};
