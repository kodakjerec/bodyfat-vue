import { createPinia, defineStore } from "pinia";
import AES from "crypto-js/aes";
import encUtf8 from "crypto-js/enc-utf8";
import { localStorageToCloud } from "./gCloudStore";

// unify storage method.
export function storageSet(key, value, cloundSave: boolean = false): void {
  localStorage.setItem(key, value);
  if (cloundSave) {
    localStorageToCloud();
  }
}
export function storageGet(key): any {
  return localStorage.getItem(key);
}
export interface recordModule {
  id: number;
  colName: string;
  colType: string;
}
export const storeSettings = defineStore({
  id: "settings",
  state: () => ({
    secretKey: "kodak19890604", // secret key
    recordingTable: [], // recording table
    lastPath: "", // last visit page
    bodyFatDatalist: [],

    googleOAuth2token: "" as any, // google OAuth2 token
    googleDriveFileName: "BodyFatRecorder.txt",
    isSync: false, // 是否有問過同步

    eChartSetting: {},
    nowLoading: "", // local loading mask
  }),
  getters: {
    getRecordingTableDefault() {
      return [
        { id: 0, colName: "日期", colType: "datetime-local" },
        { id: 1, colName: "體重", colType: "number" },
        { id: 2, colName: "BMI", colType: "number" },
        { id: 3, colName: "體脂肪率", colType: "number" },
        { id: 4, colName: "肌肉量", colType: "number" },
        { id: 5, colName: "內臟脂肪", colType: "number" },
        { id: 6, colName: "體內年齡", colType: "number" },
        { id: 7, colName: "基礎代謝", colType: "number" },
        { id: 8, colName: "舒張壓", colType: "number" },
        { id: 9, colName: "收縮壓", colType: "number" },
        { id: 10, colName: "血糖", colType: "number" },
      ];
    },
    getRecordingTable(state) {
      if (state.recordingTable.length === 0) {
        const tempData = storageGet("recordingTable");
        if (tempData) {
          state.recordingTable = JSON.parse(tempData);
        } else {
          state.recordingTable = this.getRecordingTableDefault;
        }
      }

      return state.recordingTable;
    },
    getLastPath(state) {
      if (!state.lastPath) {
        const tempData = storageGet("lastPath");
        if (tempData) {
          state.lastPath = tempData;
        } else {
          state.lastPath = "settings";
        }
      }

      return state.lastPath;
    },
    getBodyFatDataList(state) {
      if (state.bodyFatDatalist.length === 0) {
        const tempData = storageGet("bodyFatDatalist");
        if (tempData) {
          state.bodyFatDatalist = JSON.parse(tempData);
        } else {
          storageSet("bodyFatDatalist", []);
          state.bodyFatDatalist = [];
        }
      }
      return state.bodyFatDatalist;
    },
    getGDriveToken(state) {
      if (!state.googleOAuth2token) {
        let aesToken = storageGet("gToken");
        if (!aesToken) return "";
        state.googleOAuth2token = JSON.parse(AES.decrypt(aesToken, state.secretKey).toString(encUtf8));
      }

      return state.googleOAuth2token;
    },
    getIsSync(state) {
      const tempData = storageGet("isSync");
      if (tempData) {
        state.isSync = JSON.parse(tempData);
      }

      return state.isSync;
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
    insertBodyFatDatalist(record: object) {
      let newRecord = {};
      newRecord["id"] = this.bodyFatDatalist.length;
      Object.keys(record).map((key) => {
        newRecord[key] = record[key];
      });
      this.bodyFatDatalist.push(newRecord);
      storageSet("bodyFatDatalist", JSON.stringify(this.bodyFatDatalist), true);
    },
    deleteBodyFatDatalist(record: object) {
      const findIndex = this.bodyFatDatalist.findIndex((row) => row.id === record["id"]);
      this.bodyFatDatalist.splice(findIndex, 1);
      storageSet("bodyFatDatalist", JSON.stringify(this.bodyFatDatalist), true);
    },
    setGDriveToken(token: object) {
      this.googleOAuth2token = token;
      const aesAPIKey = AES.encrypt(JSON.stringify(token), this.secretKey).toString();
      storageSet("gToken", aesAPIKey, false);
    },
    setEChartSetting(fromSetting: object) {
      storageSet("eChartSetting", JSON.stringify(fromSetting));
    },
    setIsSync(status: boolean) {
      this.isSync = status;
      storageSet("isSync", JSON.stringify(this.isSync));
    },
  },
});

const pinia = createPinia();

export default pinia;
