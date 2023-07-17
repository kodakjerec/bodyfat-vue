import { storeSettings, storageSet } from ".";
import Swal from "sweetalert2";
import { load, save } from "@/libs/gCloudStore";

// 要同步的資料
const mapAttr = ["bodyFatDatalist"];

export async function localStorageToCloud() {
  // 準備資料
  const filterData = JSON.parse(JSON.stringify(localStorage));
  Object.keys(filterData).map((key) => {
    if (!mapAttr.includes(key)) {
      delete filterData[key];
    }
  });
  const saveData = JSON.stringify(filterData);

  // 開始上傳
  let isOverwrite = true;

  // 下載遠端檔案
  const userInfo: any = storeSettings().getGDriveToken;
  const cloudData: any = await load(userInfo["sub"]);
  if (cloudData && !storeSettings().getIsSync) {
    // TODO 檢查檔案日期
    const lastModifiedTime: any = cloudData.data.modifiedTime;

    // TODO 詢問使用者是否覆蓋
    if (lastModifiedTime.modifiedTime) {
      const result = await Swal.fire({
        title: "覆蓋雲端紀錄？雲端更新日期：" + lastModifiedTime.modifiedTime,
        showCancelButton: true,
        confirmButtonText: "是",
      });
      if (!result.isConfirmed) {
        isOverwrite = false;
      }
    }
  }

  // 上傳覆蓋
  if (isOverwrite) {
    storeSettings().setIsSync(true);
    const userId = userInfo["sub"];
    const email = userInfo["email"];
    const patchResult = await save(userId, email, saveData);

    if (patchResult) {
      return patchResult;
    }
  }

  return "";
}
/**
 * restore localstorage to cloud-data
 * @param data json string
 */
export async function cloundToLocalStorage() {
  const token = storeSettings().getGDriveToken;
  if (token) {
    const userInfo: any = storeSettings().getGDriveToken;
    const cloudData: any = await load(userInfo["sub"]);

    let isOverwrite = true;
    if (cloudData && !storeSettings().getIsSync) {
      // TODO 檢查檔案日期
      const lastModifiedTime: any = cloudData.data.modifiedTime;

      // TODO 詢問使用者是否覆蓋
      if (lastModifiedTime.modifiedTime) {
        const result = await Swal.fire({
          title: "覆蓋本地紀錄？雲端更新日期：" + lastModifiedTime.modifiedTime,
          showCancelButton: true,
          confirmButtonText: "是",
        });
        if (!result.isConfirmed) {
          isOverwrite = false;
        }
      }
    }

    // 下載
    if (isOverwrite) {
      const fromData = cloudData.data.data;
      storeSettings().setIsSync(true);
      if (fromData) {
        Object.entries(fromData).map(([key, value]) => {
          storageSet(key, value);
        });
      }
    }
  }
}
