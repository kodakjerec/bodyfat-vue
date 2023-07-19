import { storeSettings } from ".";
import Swal from "sweetalert2";
import { load, save } from "@/libs/gCloudStore";
import { toRaw } from "vue";

export const gDriveId: string = "203042550679-snos0ccs48migeeo2kd0mgdtc43vsp90.apps.googleusercontent.com";

/**
 * 上傳本地資料到雲端
 * @returns
 */
export async function localStorageToCloud() {
  // 準備資料
  let filterData = {};
  filterData["bodyFatDatalist"] = toRaw(await storeSettings().getBodyFatDataList);
  filterData["recordingTable"] = toRaw(await storeSettings().getRecordingTable);
  const saveData = JSON.stringify(filterData);
  // 開始上傳
  let isOverwrite = true;
  const userInfo: any = await storeSettings().getGDriveToken;

  if (userInfo) {
    // 下載遠端檔案
    const cloudData: any = await load(userInfo["sub"]);
    const isSync = await storeSettings().getIsSync;
    console.log(userInfo, cloudData.data, isSync);
    if (cloudData && cloudData.data && !isSync) {
      // TODO 檢查檔案日期
      const lastModifiedTime: any = cloudData.data.modifiedTime;

      // TODO 詢問使用者是否覆蓋
      if (lastModifiedTime) {
        const result = await Swal.fire({
          title:
            "覆蓋雲端紀錄？雲端更新日期：" +
            new Date(lastModifiedTime).toISOString().replace("T", " ").replace("Z", " "),
          showCancelButton: true,
          confirmButtonText: "是",
        });
        if (!result.isConfirmed) {
          isOverwrite = false;
        }
      }
      storeSettings().setIsSync(true);
    }
  }

  // 上傳覆蓋
  if (userInfo && isOverwrite) {
    const userId = userInfo["sub"];
    const eMail = userInfo["email"];
    if (userId && eMail && saveData) {
      const patchResult = await save(userId, eMail, saveData);

      if (patchResult) {
        return patchResult;
      }
    }
  }

  return "";
}
/**
 * 下載雲端資料覆蓋本地
 * @param data json string
 */
export async function cloundToLocalStorage() {
  const userInfo: any = await storeSettings().getGDriveToken;
  if (userInfo) {
    let isOverwrite = true;

    const cloudData: any = await load(userInfo["sub"]);
    const isSync = await storeSettings().getIsSync;

    if (cloudData && cloudData.data && !isSync) {
      // TODO 檢查檔案日期
      const lastModifiedTime: any = cloudData.data.modifiedTime;

      // TODO 詢問使用者是否覆蓋
      if (lastModifiedTime) {
        const result = await Swal.fire({
          title:
            "覆蓋本地紀錄？雲端更新日期：" +
            new Date(lastModifiedTime).toISOString().replace("T", " ").replace("Z", " "),
          showCancelButton: true,
          confirmButtonText: "是",
        });
        if (!result.isConfirmed) {
          isOverwrite = false;
        }
      }
      storeSettings().setIsSync(true);
    }

    // 下載
    if (isOverwrite && cloudData.data) {
      const fromData = JSON.parse(cloudData.data.data);
      if (fromData) {
        storeSettings().setBodyFatDatalist(fromData["bodyFatDatalist"]);
        storeSettings().setRecordingTable(fromData["recordingTable"]);
      }
    }
  }
}
