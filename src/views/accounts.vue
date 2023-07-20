<template>
    <!-- Accounts -->
    <div class="flex flex-wrap rounded appSecondColor m-2" tabindex="0">
        <div class="model_header">
            <label class="text-gray-700 font-bold text-xl">{{ $t("_settings_block_accounts") }}</label>
            <div class="float-right">
                <minus v-if="isShowTab(0)" theme="filled" size="24" fill="#000000" @click="delTab(0)" />
                <plus v-else theme="filled" size="24" fill="#000000" @click="addTab(0)" />
            </div>
        </div>
        <div class="model_content" v-if="isShowTab(0)">
            <GoogleLogin :callback="callback" small />
        </div>
    </div>
</template>

<script lang="ts">
import { Minus, Plus } from "@icon-park/vue-next";
import { decodeCredential } from "vue3-google-login";
import { cloundToLocalStorage, localStorageToCloud } from "@/store/gCloudStore";
import { storeSettings } from "@/store";

export default {
    name: "accounts",
    components: {
        Minus, Plus
    },
    data() {
        return {
            showTabs: [0, 1] as Array<number>
        }
    },
    methods: {
        // 分頁操作
        isShowTab(fromIndex: number) {
            const findIndex = this.showTabs.findIndex(item => item === fromIndex);
            if (findIndex >= 0) return true;
            return false;
        },
        addTab(fromIndex: number) {
            const findIndex = this.showTabs.findIndex(item => item === fromIndex);
            if (findIndex >= 0) return;
            this.showTabs.push(fromIndex);
        },
        delTab(fromIndex: number) {
            const findIndex = this.showTabs.findIndex(item => item === fromIndex);
            if (findIndex >= 0) this.showTabs.splice(findIndex, 1);
        },
        // Google Logi
        async callback(response) {
            // decodeCredential will retrive the JWT payload from the credential
            const userData = decodeCredential(response.credential);
            storeSettings().setGDriveToken({ sub: userData["sub"], email: userData["email"] });

            cloundToLocalStorage();
        },
    }
}
</script>