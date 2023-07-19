
import localforage from "localforage";
localforage.config({
  name: "bodyFatRecorder"
});

export default class myLocalforge {
  static get(key:string) {
    const result = localforage.getItem(key);
    return result;
  }

  static async set(key:string, value:any, callback:any) {
    localforage.setItem(key,value, callback);
  }

  static clear() {
    localforage.clear;
  }
}