import { createPinia, defineStore } from "pinia";
import cryptoJS from "crypto-js";
import { gDriveCheck, gDriveLoad, gDrivePatch, gDriveSave } from "@/libs/gDrive";

// unify storage method.
function storageSet(key, value, cloundSave: boolean = true): void {
  localStorage.setItem(key, value);
  if (cloundSave) {
    storeGoogleDrive().localStorageToCloud();
  }
}
function storageGet(key): any {
  return localStorage.getItem(key);
}

export const storeSettings = defineStore({
  id: "settings",
  state: () => ({
    secretKey: "kodak19890604", // secret key
    recordingTable: {"日期":"","體重":"","BMI":"","體脂肪率":"","肌肉量":"","內臟脂肪":"","體內年齡":"","基礎代謝":""}, // recording table
    lastPath: "", // last visit page
    googleOAuth2token: "", // google OAuth2 token
    googleDriveFileName: "yourGPT_localStorage.txt",
  }),
  getters: {
    getSecretKey(state) {
      return state.secretKey;
    },
    getRecordingTable(state) {
      return state.recordingTable;
    },
    getLastPath(state) {
      if (!state.lastPath) {
        state.lastPath = storageGet("lastPath") ?? "";
      }
      return state.lastPath;
    },
    getGDriveToken(state) {
      if (!state.googleOAuth2token) {
        let aesToken = storageGet("gToken") ?? "";
        state.googleOAuth2token = cryptoJS.AES.decrypt(aesToken, state.secretKey).toString(cryptoJS.enc.Utf8);
      }

      return state.googleOAuth2token;
    },
  },
  actions: {
    setLastPath(path: string) {
      this.lastPath = path;
      storageSet("lastPath", this.lastPath);
    },
    setRecordingTable(fromTable: object) {
      this.recordingTable = fromTable;
      storageSet("recordingTable", this.lastPath);
    },
    setGDriveToken(token: string) {
      this.googleOAuth2token = token;
      const aesAPIKey = cryptoJS.AES.encrypt(token, this.getSecretKey).toString();
      storageSet("gToken", aesAPIKey, false);
    },
  },
});

export const storeGoogleDrive = defineStore({
  id: "googleDrive",
  state: () => ({}),
  getters: {},
  actions: {
    /**
     * save localstorage to cloud-data
     * @param data json string
     */
    async localStorageToCloud() {
      const token = storeSettings().getGDriveToken;
      if (token) {
        const saveData = JSON.stringify(localStorage);
        const fileName = storeSettings().googleDriveFileName;
        // check file exists on google-drive
        const fileId = await gDriveCheck(fileName);

        if (fileId !== "error") {
          if (fileId) {
            const patchResult = await gDrivePatch(saveData, fileName, fileId);

            if (patchResult) {
              return `Patched Filename: ` + fileName;
            }
          } else {
            const upResult = await gDriveSave(saveData, fileName);

            if (upResult) {
              return `Uploaded. Filename: ` + fileName;
            }
          }
        }
      }
      return "";
    },
    /**
     * restore localstorage to cloud-data
     * @param data json string
     */
    async cloundToLocalStorage() {
      const token = storeSettings().getGDriveToken;
      if (token) {
        // use google drive
        const fileName = storeSettings().googleDriveFileName;
        // check file exists on google-drive
        const fileId = await gDriveCheck(fileName);

        if (fileId && fileId !== "error") {
          const fileContent = await gDriveLoad(fileId);
          if (fileContent) {
            const cloudData = JSON.parse(fileContent);
            const notMapAttr = ["gToken"];
            Object.entries(cloudData).map(([key, value]) => {
              if (!notMapAttr.includes(key)) {
                storageSet(key, value, false);
              }
            });
          }
        }
      }
    },
  },
});
const pinia = createPinia();

export default pinia;
