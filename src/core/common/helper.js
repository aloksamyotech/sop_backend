import * as crypto from "crypto";
import axios from "axios";
import mongoose from "mongoose";
import Logger from "./logger.js";

const HOST = "https://vista.kreditz.com";
const CLIENT_ID = "021a589272995230295a43db9b7282";
const CLIENT_SECRET = "caff314fd8c03c823e3ae15b6070a23b";

export class Encrypter {
  static algorithm = "aes256";
  static key = crypto.scryptSync("<Your-Secret-Key>", "salt", 32);

  static encrypt(clearText) {
    console.log("Encrypting text:", clearText);
    const iv = crypto.randomBytes(16);
    try {
      const cipher = crypto.createCipheriv(
        Encrypter.algorithm,
        Encrypter.key,
        iv
      );
      const encrypted = cipher.update(clearText, "utf8", "hex");
      const finalEncrypted = encrypted + cipher.final("hex");
      const result = [finalEncrypted, Buffer.from(iv).toString("hex")].join("|");
      console.log("Encrypted text:", result);
      return result;
    } catch (error) {
      console.error("Encryption error:", error);
      return error;
    }
  }

  static decrypt(encryptedText) {
    console.log("Decrypting text:", encryptedText);
    try {
      const [encrypted, iv] = encryptedText.split("|");
      if (!iv) throw new Error("IV not found");
      const decipher = crypto.createDecipheriv(
        Encrypter.algorithm,
        Encrypter.key,
        Buffer.from(iv, "hex")
      );
      const decrypted =
        decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
      console.log("Decrypted text:", decrypted);
      return decrypted;
    } catch (error) {
      console.error("Decryption error:", error);
      return error;
    }
  }
}

const getAccessToken = () => {
  return new Promise(async function (resolve, reject) {
    console.log("Fetching access token...");
    try {
      const tokenUrl = `${HOST}/kreditz/api/v4/authorizations/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
      const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        url: tokenUrl,
      };

      const response = await axios(options);
      const accessToken = response.data.data.access_token;
      console.log("Access token received:", accessToken);

      // Waiting 60 seconds (non-blocking)
      (async () => {
        console.log("Starting delay of 60 seconds...");
        await new Promise(res => setTimeout(res, 60 * 1000));
        console.log("60 seconds delay done.");
      })();

      resolve({ status: true, accessToken });
    } catch (error) {
      console.error("Error fetching access token:", error);
      resolve({ status: false, error });
    }
  });
};

export default getAccessToken;

export const getAllData = async (id, accessToken) => {
  console.log("Fetching data for ID:", id);
  try {
    const url = `https://vista.kreditz.com/kreditz/api/v4/continuous_access/${id}/refetch`;
    console.log("URL for data fetch:", url);

    const options = {
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios(options);
    const databycaseId = response?.data?.data;
    console.log("Data received for case ID:", databycaseId);
    return databycaseId;
  } catch (error) {
    console.error("Error fetching data by case ID:", error);
  }
};
