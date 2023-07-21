import { storeSettings } from ".";
import Swal from "sweetalert2";
import { load, save } from "@/libs/gCloudStore";
import { toRaw } from "vue";
import { createToaster } from "@meforma/vue-toaster";
import i18n from "@/libs/i18n";
import { use } from "echarts";
const { t } = i18n.global;

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

    if (cloudData && cloudData.data && !isSync) {
      // TODO 檢查檔案日期
      const lastModifiedTime: any = cloudData.data.modifiedTime;

      // TODO 詢問使用者是否覆蓋
      if (lastModifiedTime) {
        const result = await Swal.fire({
          title:
            t("_gcloud_local_cloud") + new Date(lastModifiedTime).toISOString().replace("T", " ").replace("Z", " "),
          showCancelButton: true,
          confirmButtonText: t("_Yes"),
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
      createToaster().success(t("_gcloud_local_cloud_finish", { position: "top" }));
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
            t("_gcloud_cloud_local") + new Date(lastModifiedTime).toISOString().replace("T", " ").replace("Z", " "),
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
        createToaster().success(t("_gcloud_cloud_local_finish", { position: "top" }));
      }
    }
  }
}
