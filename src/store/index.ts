import { createPinia, defineStore } from "pinia";
import AES from "crypto-js/aes";
import encUtf8 from "crypto-js/enc-utf8";
import { localStorageToCloud } from "./gCloudStore";
import i18n from '@/libs/i18n';
import myLocalforge from "@/libs/localForge";
import { toRaw } from "vue";

const { t } = i18n.global

// unify storage method.
export function storageSet(key, value, cloundSave: boolean = false): void {
  myLocalforge.set(key, toRaw(value), ()=>{
    if (cloundSave) {
      localStorageToCloud();
    }
  });
}
export async function storageGet(key):Promise<any> {
  const result = await myLocalforge.get(key);
  return result;
}

export function storageClear() {
  myLocalforge.clear();
}

export function storageDebug() {
  myLocalforge.iterate();
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
    lang: 'zh-TW' // 語系
  }),
  getters: {
    getRecordingTableDefault() {
      return [
        { id: 0, colName: t('_col_date'), colType: "datetime-local" },
        { id: 1, colName: t('_col_weight'), colType: "number" },
        { id: 2, colName: t('_col_bmi'), colType: "number" },
        { id: 3, colName: t('_col_bodyFatPer'), colType: "number" },
        { id: 4, colName: t('_col_muscleMass'), colType: "number" },
        { id: 5, colName: t('_col_visceralFat'), colType: "number" },
        { id: 6, colName: t('_col_bodyAge'), colType: "number" },
        { id: 7, colName: t('_col_basalMetabolicRate'), colType: "number" },
        { id: 8, colName: t('_col_diastolicBloodPressure'), colType: "number" },
        { id: 9, colName: t('_col_systolicBloodPressure'), colType: "number" },
        { id: 10, colName: t('_col_bloodSugar'), colType: "number" },
      ];
    },
    async getRecordingTable(state) {
      if (state.recordingTable.length === 0) {
        const tempData:any = await storageGet("recordingTable");
        if (tempData) {
          state.recordingTable = tempData;
        } else {
          state.recordingTable = this.getRecordingTableDefault;
        }
      }
      return state.recordingTable;
    },
    async getLastPath(state) {
      if (!state.lastPath) {
        const tempData:any = await storageGet("lastPath");
        if (tempData) {
          state.lastPath = tempData;
        } else {
          state.lastPath = "home";
        }
      }
      return state.lastPath;
    },
    async getBodyFatDataList(state) {
      if (state.bodyFatDatalist.length === 0) {
        const tempData:any = await storageGet("bodyFatDatalist");
        if (tempData) {
          state.bodyFatDatalist = tempData;
        } else {
          storageSet("bodyFatDatalist", []);
          state.bodyFatDatalist = [];
        }
      }
      return state.bodyFatDatalist;
    },
    async getGDriveToken(state) {
      if (!state.googleOAuth2token) {
        let aesToken:any = await storageGet("gToken");
        if (!aesToken) return "";
        state.googleOAuth2token = AES.decrypt(aesToken, state.secretKey).toString(encUtf8);
      }
      return state.googleOAuth2token;
    },
    async getIsSync(state) {
      const tempData:any = await storageGet("isSync");
      if (tempData !== null) {
        state.isSync = tempData;
      }
      return state.isSync;
    },
    async getIsIntro(state) {
      const tempData:any = await storageGet("isIntro");
      if (tempData !== null) {
        state.isIntro = tempData;
      }
      return state.isIntro;
    },
    async getLang(state) {
      const tempData:any = await storageGet("lang");
      if (tempData) {
        state.lang = tempData;
      }

      return state.lang
    }
  },
  actions: {
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
      } catch(err) {

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
      storageSet("gToken", aesAPIKey, false);
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
    setLang(lang:string) {
      this.lang = lang;
      storageSet("lang", lang);
    }
  },
});

const pinia = createPinia();

export default pinia;
