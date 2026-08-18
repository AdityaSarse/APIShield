import { customAlphabet } from "nanoid";
import crypto from "crypto";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const nanoid = customAlphabet(alphabet, 32);

export const generateApiKey = () => {
  return `aps_live_${nanoid()}`;
};

export const hashApiKey = (apiKey) => {
  return crypto
    .createHash("sha256")
    .update(apiKey)
    .digest("hex");
};

export const getKeyPrefix = (apiKey) => {
  return apiKey.substring(0, 16);
};
