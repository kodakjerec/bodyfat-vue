<template>
    <div class="flex">
        <label class="text-center flex flex-1">
            <span class="flex-1">decodeText</span>
            <input class="input" v-model="decodeText">
        </label>
    </div>
    <div class="flex">
        <label class="text-center flex flex-1">
            <span class="flex-1">mykey</span>
            <input class="input" v-model="mykey">
        </label>
    </div>
    <div class="flex justify-center">
        <button class="btn flex-1" @click="encode()">encode</button>
        <button class="btn flex-1" @click="decode()">decode</button>
    </div>
    <div class="flex">
        <label class="text-center flex flex-1">
            <span class="flex-1">encodeText</span>
            <input class="input" v-model="encodeText">
        </label>
    </div>
</template>

<script lang="ts">
import AES from "crypto-js/aes";
import encUtf8 from "crypto-js/enc-utf8";
import { createToaster } from "@meforma/vue-toaster";
import { toRaw } from "vue";

export default {
    name: "test",
    data() {
        return {
            encodeText: "",
            mykey: "kodak19890604",
            decodeText: "203042550679-snos0ccs48migeeo2kd0mgdtc43vsp90.apps.googleusercontent.com"
        }
    },
    methods: {
        encode() {
            console.log(toRaw(this.decodeText), toRaw(this.mykey))
            this.encodeText = AES.encrypt(toRaw(this.decodeText), toRaw(this.mykey));
            createToaster().success('encode', { position: "top", duration: 2000 });
        },
        decode() {
            this.decodeText = AES.decrypt(this.encodeText, this.mykey).toString(encUtf8);
            createToaster().success('decode', { position: "top", duration: 2000 });
        }
    }
}
</script>