
import localforage from "localforage";
localforage.config({
  name: "bodyFatRecorder"
});

export default class myLocalforge {
  static async get(key:string) {
    const result = await localforage.getItem(key);
    return result;
  }

  static set(key:string, value:any, callback:any) {
    localforage.setItem(key,value, callback);
  }

  static clear() {
    localforage.clear();
  }

  static iterate() {
    localforage.iterate((value,key,number)=>{
      console.log([key,value], number);
    }).then(()=>{
      console.log('Iteration has completed.');
    }).catch((err)=>{
      console.log(err);
    })
  }
}