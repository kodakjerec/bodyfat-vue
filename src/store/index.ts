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
export interface recordModule {
  id:number,
  colName:string,
  colType:string
}
export const storeSettings = defineStore({
  id: "settings",
  state: () => ({
    secretKey: "kodak19890604", // secret key
    recordingTable: [
      {id:0,colName:"日期",colType:"datetime-local"},
      {id:1,colName:"體重",colType:"number"},
      {id:2,colName:"BMI",colType:"number"},
      {id:3,colName:"體脂肪率",colType:"number"},
      {id:4,colName:"肌肉量",colType:"number"},
      {id:5,colName:"內臟脂肪",colType:"number"},
      {id:6,colName:"體內年齡",colType:"number"},
      {id:7,colName:"基礎代謝",colType:"number"}], // recording table
    lastPath: "", // last visit page
    bodyFatDatalist:[],
    googleOAuth2token: "", // google OAuth2 token
    googleDriveFileName: "BodyFatRecorder.txt",
  }),
  getters: {
    getSecretKey(state) {
      return state.secretKey;
    },
    getRecordingTable(state) {
      if (state.recordingTable.length===8) {
        const tempData = storageGet("recordingTable");
        if (tempData) {
          state.recordingTable = JSON.parse(tempData);
        }
      }
      return state.recordingTable;
    },
    getLastPath(state) {
      if (!state.lastPath) {
        const tempData = storageGet("lastPath");
        if (tempData) {
          state.lastPath = tempData;
        }
      }
      return state.lastPath;
    },
    getBodyFatDataList(state) {
      if (state.bodyFatDatalist.length===0) {
        const tempData = storageGet("bodyFatDatalist");
        if (tempData) {
          state.bodyFatDatalist = JSON.parse(tempData);
        }
      }
      return state.bodyFatDatalist;
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
    setRecordingTable(fromTable: Array<recordModule>) {
      this.recordingTable = fromTable;
      storageSet("recordingTable", JSON.stringify(this.recordingTable));
    },
    insertBodyFatDatalist(record:object) {
      this.bodyFatDatalist.push(record);
      storageSet("bodyFatDatalist", JSON.stringify(this.bodyFatDatalist));
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
