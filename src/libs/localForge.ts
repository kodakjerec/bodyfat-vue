import localforage from "localforage";
localforage.config({
  name: "bodyFatRecorder",
});

export default class myLocalforge {
  static async get(key: string) {
    const result = await localforage.getItem(key);
    return result;
  }

  static set(key: string, value: any, callback: any) {
    localforage.setItem(key, value, callback);
  }

  static clear() {
    localforage.clear();
  }

  static async iterate() {
    let keyList = [] as Array<string>;
    return localforage
      .iterate((value, key: string, number) => {
        keyList.push(key);
      })
      .then(() => {
        console.log("Iteration has completed.");
        return keyList;
      })
      .catch((err) => {
        console.log(err);
        return keyList;
      });
  }
}
