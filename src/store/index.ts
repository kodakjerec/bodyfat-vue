import { createPinia, defineStore } from "pinia";
import AES from "crypto-js/aes";
import encUtf8 from "crypto-js/enc-utf8";
import { localStorageToCloud } from "./gCloudStore";
import i18n from "@/libs/i18n";
import myLocalforge from "@/libs/localForge";
import { toRaw } from "vue";

const { t } = i18n.global;

// unify storage method.
export function storageSet(key, value, cloundSave: boolean = false): void {
  myLocalforge.set(key, toRaw(value), () => {
    if (cloundSave) {
      localStorageToCloud();
    }
  });
}
export async function storageGet(key): Promise<any> {
  const result = await myLocalforge.get(key);
  return result;
}

export function storageClear() {
  myLocalforge.clear();
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

    eChartSetting: {}, // eChart setting
    nowLoading: "", // local loading mask

    isSync: false, // 是否有問過同步
    isIntro: true, // 第一次登入
    lang: "zh-TW", // 語系
  }),
  getters: {
    getRecordingTableDefault() {
      return [
        { id: 0, colName: t("_col_date"), colType: "datetime-local" },
        { id: 1, colName: t("_col_weight"), colType: "number" },
        { id: 2, colName: t("_col_bmi"), colType: "number" },
        { id: 3, colName: t("_col_bodyFatPer"), colType: "number" },
        { id: 4, colName: t("_col_muscleMass"), colType: "number" },
        { id: 5, colName: t("_col_visceralFat"), colType: "number" },
        { id: 6, colName: t("_col_bodyAge"), colType: "number" },
        { id: 7, colName: t("_col_basalMetabolicRate"), colType: "number" },
        { id: 8, colName: t("_col_diastolicBloodPressure"), colType: "number" },
        { id: 9, colName: t("_col_systolicBloodPressure"), colType: "number" },
        { id: 10, colName: t("_col_bloodSugar"), colType: "number" },
      ];
    },
    getRecordingTable(state) {
      return state.recordingTable;
    },
    getLastPath(state) {
      return state.lastPath;
    },
    getBodyFatDataList(state) {
      return state.bodyFatDatalist;
    },
    async getGDriveToken(state) {
      const encodeText = await storageGet("googleOAuth2token");
      state.googleOAuth2token = JSON.parse(AES.decrypt(encodeText, this.secretKey).toString(encUtf8));
      return state.googleOAuth2token;
    },
    getIsSync(state) {
      return state.isSync;
    },
    getIsIntro(state) {
      return state.isIntro;
    },
    getLang(state) {
      return state.lang;
    },
  },
  actions: {
    async setFromLocalforge() {
      const keyList = await myLocalforge.iterate();

      const stateKeys = Object.keys(this.$state);
      for (let i = 0; i < stateKeys.length; i++) {
        let key = stateKeys[i];
        // 從 localforge 回覆記錄到 state
        if (keyList.includes(key)) {
          this[key] = await storageGet(key);
        }

        // state依然沒資料的情況
        switch (key) {
          case "recordingTable":
            if (this.recordingTable.length === 0) {
              this.setRecordingTable(this.getRecordingTableDefault);
            }
        }
      }
    },
    setLastPath(path: string) {
      this.lastPath = path;
      storageSet("lastPath", this.lastPath);
    },
    setRecordingTable(fromTable: Array<recordModule>) {
      this.recordingTable = fromTable;
      storageSet("recordingTable", this.recordingTable);
    },
    setBodyFatDatalist(records: Array<any>) {
      this.bodyFatDatalist = records;
      storageSet("bodyFatDatalist", this.bodyFatDatalist);
    },
    insertBodyFatDatalist(record: object) {
      try {
        let newRecord = {};
        newRecord["id"] = this.bodyFatDatalist.length;
        Object.keys(record).map((key) => {
          newRecord[key] = record[key];
        });
        this.bodyFatDatalist.push(newRecord);
        storageSet("bodyFatDatalist", this.bodyFatDatalist, true);
      } catch (err) {
      } finally {
        return "";
      }
    },
    deleteBodyFatDatalist(record: object) {
      const findIndex = this.bodyFatDatalist.findIndex((row) => row.id === record["id"]);
      this.bodyFatDatalist.splice(findIndex, 1);
      storageSet("bodyFatDatalist", this.bodyFatDatalist, true);
    },
    setGDriveToken(token: object) {
      this.googleOAuth2token = token;
      const aesAPIKey = AES.encrypt(JSON.stringify(token), this.secretKey).toString();
      storageSet("googleOAuth2token", aesAPIKey, false);
    },
    setEChartSetting(fromSetting: object) {
      storageSet("eChartSetting", fromSetting);
    },
    setIsSync(status: boolean) {
      this.isSync = status;
      storageSet("isSync", this.isSync);
    },
    setIsIntro(status: boolean) {
      this.isIntro = status;
      storageSet("isIntro", this.isIntro);
    },
    setLang(lang: string) {
      this.lang = lang;
      storageSet("lang", lang);
    },
  },
});

const pinia = createPinia();

export default pinia;
