<template>
    <div>
        <div class="content">
            <div class="form_group">
                <div class="form_title">头像</div>
                <input type="file" id="fileInput" style="display: none;" accept="image/*" @change="upload">
                <img v-if="info.imgUrl" :src="info.imgUrl" alt="headImg" @click="choseImg">
                <img v-else src="../../assets/pic.png" alt="headImg" @click="choseImg">
            </div>
            <div class="form_group">
                <div class="form_title">昵称</div>
                <input v-model="info.name" type="text" placeholder="输入昵称">
            </div>
            <div class="form_group">
                <div class="form_title">性别</div>
                <input type="radio" id="male" name="gender" value="male" v-model="info.sex">
                <label for="male">男</label><br>
                <input type="radio" id="female" name="gender" value="female" v-model="info.sex">
                <label for="female">女</label><br>
                <input type="radio" id="other" name="gender" value="other" v-model="info.sex">
                <label for="other">保密</label><br>
            </div>
            <div class="form_group">
                <div class="form_title">邮箱</div>
                <input v-model="info.email" style="background: none;" type="email" :disabled="true">
            </div>
            <div class="form_group">
                <div class="form_title">密码修改</div>
                <input v-if="isChange" v-model="info.newPassword" type="password" placeholder="输入新密码">
                <button types="default" v-if="!isChange" class="change_btn" @click="isChange = true">修改密码</button>
            </div>
            <div class="form_group" v-if="isChange">
                <div class="form_title">验证码</div>
                <input v-model="info.code" type="password" placeholder="输入验证码">
                <button types="default" class="change_btn" @click="sendCode" :disabled="!canSendCode">{{ timer ? `已发送${timer}s` : '发送验证码' }}</button>
            </div>
        </div>
        <button types="info" class="back_btn" @click="back">返回</button>
        <button types="default" class="save_btn" @click="save">保存</button>
        <messageBox ref="messageBox"></messageBox>
    </div>
</template>

<script lang="ts">
import { api_personalInfo, api_sendCode, api_updateInfo, api_upload } from '@/api/login';
import { generateRandomNumber } from '@/assets/util';
import router from '@/router';
import { useInfoStore } from '@/stores/info';
import { defineComponent, onBeforeMount, ref, type Ref } from 'vue'

export default defineComponent({
    name: "PersonView",
    setup() {
        const isChange: Ref<boolean> = ref(false)
        const canSendCode: Ref<boolean> = ref(true);
        const timer: Ref<number> = ref(0);
        const messageBox: Ref<any> = ref(null)
        const info: Ref<any> = ref({})
        const infoStores = useInfoStore()
        const sendCode = () => { // 发送验证码
            canSendCode.value = false;
            timer.value = 60;
            const interval = setInterval(() => {
                timer.value--;
                if (timer.value <= 0) {
                    clearInterval(interval);
                    canSendCode.value = true;
                }
            }, 1000);
            var s = generateRandomNumber(14) + btoa(generateRandomNumber(6))
            api_sendCode({ code: s, email: info.value.email }).then(() => {
                messageBox.value.open('验证码发送成功', 'success')
            })
        }
        const getPersonalInfo = () => { // 获取个人信息
            api_personalInfo().then((res: any) => {
                info.value = res.message
                info.value.code = ''
                info.value.newPassword = ''
            })
        }
        const upload = (e: any) => { // 上传图片
            const formData = new FormData()
            formData.append('image', e.target.files[0])
            api_upload(formData).then((res: any) => {
                info.value.imgUrl = res.file
            })
        }
        const save = () => { // 保存个人信息
            if(info.value.newPassword) {
                info.value.newPassword = btoa('pass' + btoa(info.value.newPassword) + 'word').split('').reverse().join('')
            }
            api_updateInfo(info.value).then((res: any) => {
                messageBox.value.open(res.message, 'success')
                isChange.value = false
                getPersonalInfo()
                infoStores.state = !infoStores.state
            })
        }
        const back = () => {
            router.back()
        }
        const choseImg = () => {
            document.getElementById('fileInput')?.click()
        }
        onBeforeMount(() => {
            getPersonalInfo()
        })
        return {
            info, isChange, messageBox, canSendCode, timer,
            save, choseImg, sendCode, upload, back
        }
    }
})
</script>

<style scoped>
.content {
    margin: 30px;
}

img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin: 0 10px;
    cursor: pointer;
    -webkit-user-drag: none;
    box-shadow: 0 0 5px #cacaca;
}

.form_group {
    display: flex;
    align-items: center;
}

.form_title {
    color: #6b46c1;
    font-weight: bolder;
    font-size: 14px;
    margin: 10px 15px;
    width: 60px;
    height: 22px;
    text-align: justify;
}

label {
    color: #6b46c1;
    font-weight: bolder;
    font-size: 14px;
    margin: 3px;
}

.form_title::after {
    content: '';
    display: inline-block;
    width: 100%;
}

input {
    background: #f0e6ff;
    color: #6b46c1;
}

.change_btn {
    margin-left: 10px;
}

.save_btn {
    position: fixed;
    right: 80px;
    bottom: 10px;
}

.back_btn {
    position: fixed;
    right: 10px;
    bottom: 10px;
}
</style>