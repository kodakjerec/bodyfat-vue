import { gDriveCheck, gDriveCheckLabels, gDrivePatch, gDriveSave, gDriveLoad } from "@/libs/gDrive";
import { storageSet, storeSettings } from ".";
import Swal from "sweetalert2";

// 要同步的資料
const mapAttr = ["bodyFatDatalist"];

/**
 * save localstorage to cloud-data
 * @param data json string
 */
export async function localStorageToCloud() {
  const token = storeSettings().getGDriveToken;
  if (token) {
    // 準備資料
    const filterData = JSON.parse(JSON.stringify(localStorage));
    Object.keys(filterData).map((key) => {
      if (!mapAttr.includes(key)) {
        delete filterData[key];
      }
    });
    const saveData = JSON.stringify(filterData);

    // 開始上傳
    const fileName = storeSettings().googleDriveFileName;
    // check file exists on google-drive
    const fileId = await gDriveCheck(fileName);

    if (fileId && fileId !== "error") {
      let isOverwrite = true;
      if (!storeSettings().getIsSync) {
        // TODO 檢查檔案日期
        const lastModifiedTime: any = await gDriveCheckLabels(fileId);

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
        const patchResult = await gDrivePatch(saveData, fileName, fileId);

        if (patchResult) {
          return `Patched Filename: ` + fileName;
        }
      }
    } else {
      storeSettings().setIsSync(true);
      const upResult = await gDriveSave(saveData, fileName);

      if (upResult) {
        return `Uploaded. Filename: ` + fileName;
      }
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
    // 取得資料
    const fileName = storeSettings().googleDriveFileName;
    // check file exists on google-drive
    const fileId = await gDriveCheck(fileName);

    if (fileId && fileId !== "error") {
      let isOverwrite = true;
      if (!storeSettings().getIsSync) {
        // TODO 檢查檔案日期
        const lastModifiedTime: any = await gDriveCheckLabels(fileId);

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
        storeSettings().setIsSync(true);
        const fileContent = await gDriveLoad(fileId);
        if (fileContent) {
          const cloudData = JSON.parse(fileContent);
          Object.entries(cloudData).map(([key, value]) => {
            storageSet(key, value);
          });
        }
      }
    } else {
      storeSettings().setIsSync(true);
    }
  }
}
