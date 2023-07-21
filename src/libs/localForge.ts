import localforage from "localforage";
localforage.config({
  name: "bodyFatRecorder",
});

export default class myLocalforge {
  static async get(key: string) {
    const result = await localforage.getItem(key);
    return result;
  }

  static async set(key: string, value: any) {
    const result = await localforage.setItem(key, value);
    return result;
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
