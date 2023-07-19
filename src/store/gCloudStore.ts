import { storeSettings } from ".";
import Swal from "sweetalert2";
import { load, save } from "@/libs/gCloudStore";

export const gDriveId: string = "203042550679-snos0ccs48migeeo2kd0mgdtc43vsp90.apps.googleusercontent.com";

/**
 * 上傳本地資料到雲端
 * @returns 
 */
export async function localStorageToCloud() {
  // 準備資料
  let filterData = {};
  filterData['bodyFatDatalist'] = storeSettings().getBodyFatDataList;
  filterData['recordingTable'] = storeSettings().getRecordingTable;
  const saveData = JSON.stringify(filterData);

  // 開始上傳
  let isOverwrite = true;
  const userInfo: any = storeSettings().getGDriveToken;
  if (userInfo && !storeSettings().getIsSync) {
    // 下載遠端檔案
    const cloudData: any = await load(userInfo["sub"]);
    if (cloudData) {
      // TODO 檢查檔案日期
      const lastModifiedTime: any = cloudData.data.modifiedTime;

      // TODO 詢問使用者是否覆蓋
      if (lastModifiedTime) {
        const result = await Swal.fire({
          title: "覆蓋雲端紀錄？雲端更新日期：" + new Date(lastModifiedTime).toISOString().replace("T","").replace("Z",""),
          showCancelButton: true,
          confirmButtonText: "是",
        });
        if (!result.isConfirmed) {
          isOverwrite = false;
        }
        storeSettings().setIsSync(true);
      }
    }
  }

  // 上傳覆蓋
  if (isOverwrite) {
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
  const userInfo: any = storeSettings().getGDriveToken;
  if (userInfo) {
    let isOverwrite = true;
    
    const cloudData: any = await load(userInfo["sub"]);
    if (cloudData && !storeSettings().getIsSync) {
      // TODO 檢查檔案日期
      const lastModifiedTime: any = cloudData.data.modifiedTime;

      // TODO 詢問使用者是否覆蓋
      if (lastModifiedTime) {
        const result = await Swal.fire({
          title: "覆蓋本地紀錄？雲端更新日期：" + new Date(lastModifiedTime).toISOString().replace("T","").replace("Z",""),
          showCancelButton: true,
          confirmButtonText: "是",
        });
        if (!result.isConfirmed) {
          isOverwrite = false;
        }
        storeSettings().setIsSync(true);
      }
    }

    // 下載
    if (isOverwrite) {
      const fromData = JSON.parse(cloudData.data.data);
      if (fromData) {
        storeSettings().setBodyFatDatalist(fromData['bodyFatDatalist']);
        storeSettings().setRecordingTable(fromData['recordingTable']);
      }
    }
  }
}
