<template>
    <div id="set_container">
        <div class="sidebar">
            <div class="item" :class="active == '1' ? 'active' : ''" @click="active = '1'">主页样式</div>
            <div class="item" :class="active == '2' ? 'active' : ''" @click="active = '2'">输入框配置</div>
            <div class="item" :class="active == '3' ? 'active' : ''" @click="active = '3'">应用配置</div>
        </div>
        <div class="content" v-show="active == '1'">
            <div class="form">
                <div class="form_group">
                    <div class="form_title">背景图片</div>
                    <div>
                        <img class="bg_img" v-if="setting.imgUrl" :src="setting.imgUrl" alt="bgImg"
                            @click="selectBgImg">
                        <img class="bg_img" v-else src="../../assets/pic.png" alt="bgImg" @click="selectBgImg">
                        <input type="file" id="bgImg" accept="image/*" @change="upload">
                    </div>
                </div>
                <div class="form_group">
                    <div class="form_title">字体大小</div>
                    <div>
                        <input type="number" v-model="setting.fontSize" min="10" max="30" placeholder="输入字体大小"
                            @change="limitFontSize">
                    </div>
                </div>
                <div class="form_group">
                    <div class="form_title">字体颜色</div>
                    <div>
                        <input type="color" v-model="setting.fontColor">
                    </div>
                </div>
                <div class="form_group">
                    <div class="form_title">列数</div>
                    <input type="radio" id="4" name="gender" value="25%" v-model="setting.column">
                    <label for="4">4</label><br>
                    <input type="radio" id="5" name="gender" value="20%" v-model="setting.column">
                    <label for="5">5</label><br>
                    <input type="radio" id="6" name="gender" value="16.6%" v-model="setting.column">
                    <label for="6">6</label><br>
                </div>
                <div class="form_group">
                    <div class="form_title">图标大小</div>
                    <div>
                        <input type="number" v-model="setting.size" min="40" max="75" placeholder="输入图标大小"
                            @change="limitSize">
                    </div>
                </div>
                <div class="form_group">
                    <div class="form_title">图标圆角</div>
                    <div>
                        <input type="number" v-model="setting.radius" min="0" max="50" placeholder="输入图标圆角">
                    </div>
                </div>

            </div>
        </div>
        <div class="content" v-show="active == '2'">
            <div class="head">
                <button types="default" @click="addShow">新增</button>
                <button types="error" @click="batchRemove">删除</button>
            </div>
            <div class="app_list">
                <div v-for="(item, index) in appList" :key="index">
                    <div class="app_item" v-if="item.type == 'search'">
                        <input type="checkbox" v-model="item.chose">
                        <div style="width: 100px;white-space: nowrap;">{{ item.appName }}</div>
                        <div style="width: 400px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{
                            item.url }}</div>
                        <div style="width: 100px;margin-left: 10px;">
                            <img class="app_img" v-if="item.imgUrl" :src="item.imgUrl">
                            <img class="app_img" v-else src="../../assets/pic.png">
                        </div>
                        <div class="head">
                            <button types="default" @click="editShow(item)">编辑</button>
                            <button types="error" @click="handleRemove(item)">删除</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div class="content" v-show="active == '3'">
            <div class="head">
                <button types="default" @click="addShow">新增</button>
                <button types="error" @click="batchRemove">删除</button>
            </div>
            <div class="app_list">
                <div v-for="(item, index) in appList" :key="index">
                    <div class="app_item" v-if="item.type == 'url'" :style="index == appList.length - 1 ? '' : ''">
                        <input type="checkbox" v-model="item.chose">
                        <div style="width: 20%;">{{ item.appName }}</div>
                        <div style="width: 40%;">{{ item.url }}</div>
                        <div style="width: 10%;">
                            <img class="app_img" v-if="item.imgUrl" :src="item.imgUrl">
                            <img class="app_img" v-else src="../../assets/pic.png">
                        </div>
                        <div class="head">
                            <button types="default" @click="editShow(item)">编辑</button>
                            <button types="error" @click="handleRemove(item)">删除</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <button types="info" class="back_btn" @click="back">返回</button>
        <button v-show="active == '1'" types="default" class="save_btn" @click="save">保存</button>
        <messageBox ref="messageBox"></messageBox>
        <dialogView ref="dialogView" width="400px" @confirm="confirm">
            <div class="form_group">
                <div class="form_title">应用名称</div>
                <input type="text" v-model="appForm.appName" :placeholder="`输入${hint}名称`">
            </div>
            <div class="form_group">
                <div class="form_title">应用链接</div>
                <input type="text" v-model="appForm.url" :placeholder="`输入${hint}链接`">
            </div>
            <div class="form_group">
                <div class="form_title">图标类型</div>
                <input type="radio" id="file" name="gender" value="file" v-model="appForm.uploadType">
                <label for="file">文件</label><br>
                <input type="radio" id="url" name="gender" value="url" v-model="appForm.uploadType">
                <label for="url">链接</label><br>
            </div>
            <div v-if="appForm.uploadType == 'file'" class="form_group">
                <div class="form_title">图标上传</div>
                <img class="app_img" v-if="appForm.imgUrl" :src="appForm.imgUrl" @click="addImg">
                <img class="app_img" v-else src="../../assets/pic.png" @click="addImg">
            </div>
            <div v-else-if="appForm.uploadType == 'url'" class="form_group">
                <div class="form_title">图标链接</div>
                <input v-model="appForm.imgUrl" placeholder="输入链接地址">
            </div>
            <input type="file" id="appImg" @change="setImg">
        </dialogView>
        <dialogView ref="dialogViewRemove" @confirm="remove"></dialogView>
    </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref, type Ref } from 'vue'
import type { AppForm, Setting } from './setting';
import { api_upload } from '@/api/login';
import router from '@/router';
import { api_insertApp, api_removeApp, api_selectApp, api_selectSetting, api_updateApp, api_updateSetting } from '@/api/setting';
import { useInfoStore } from '@/stores/info';

export default defineComponent({
    name: 'SettingView',
    setup() {
        const active: Ref<string> = ref('1')
        const showSelect: Ref<boolean> = ref(false)
        const messageBox: Ref<any> = ref(null)
        const dialogView: Ref<any> = ref(null)
        const dialogViewRemove: Ref<any> = ref(null)
        const removeType: Ref<string> = ref('')
        const hint: Ref<string> = ref('')
        const infoStores: any = useInfoStore()
        const appForm: Ref<AppForm> = ref({
            appName: '',
            url: '',
            imgUrl: '',
            type: '',
            uploadType: 'file',
            chose: false
        })
        const setting: Ref<Setting> = ref({
            imgUrl: "",
            fontSize: null,
            fontColor: null,
            radius: null,
            size: null,
            column: null
        })
        const appList: Ref<any> = ref([])
        function selectBgImg() {
            document.getElementById('bgImg')?.click()
        }
        function reset(isEdit: boolean) {
            appForm.value = {
                appName: '',
                url: '',
                imgUrl: '',
                uploadType: '',
                type: '',
                chose: false
            }
            if (active.value == '2') {
                appForm.value.type = 'search'
                hint.value = '搜索'
                dialogView.value.message = isEdit ? '编辑搜索' : '新增搜索'
            } else if (active.value == '3') {
                appForm.value.type = 'url'
                hint.value = '应用'
                dialogView.value.message = isEdit ? '编辑应用' : '新增应用'
            }
        }
        function upload(e: any) { // 上传图片
            const formData = new FormData()
            formData.append('image', e.target.files[0])
            api_upload(formData).then((res: any) => {
                setting.value.imgUrl = res.file
            })
        }
        function getSetting() {
            api_selectSetting({ email: infoStores.info.email }).then((res: any) => {
                setting.value = res.message[0]
            })
        }
        function getApp() {
            api_selectApp().then((res: any) => {
                appList.value = res.message.map((item: any) => {
                    item.chose = false
                    return item
                })
            })
        }
        function save() { // 保存设置信息
            api_updateSetting(setting.value).then((res: any) => {
                messageBox.value.open(res.message, 'success')
                getSetting()
            })
        }
        function back() {
            router.back()
        }
        function addShow() {
            reset(false)
            dialogView.value.isVisible = true
        }
        function editShow(item: any) {
            reset(true)
            appForm.value = item
            dialogView.value.isVisible = true
        }
        function batchRemove() {
            if (appList.value.filter((item: any) => item.chose).length == 0) {
                messageBox.value.open('请选择删除项', 'warn')
                return
            }
            dialogViewRemove.value.message = '是否删除所选项？'
            dialogViewRemove.value.isVisible = true
            removeType.value = 'batch'
        }
        function handleRemove(item: any) {
            dialogViewRemove.value.message = '是否删除所选项？'
            dialogViewRemove.value.isVisible = true
            removeType.value = item.id
        }
        function remove() {
            let ids = []
            if (removeType.value == 'batch') {
                ids = appList.value.filter((item: any) => item.chose).map((item: any) => item.id)
            } else {
                ids = [removeType.value]
            }
            api_removeApp(ids).then((res: any) => {
                messageBox.value.open(res.message, 'success')
                getApp()
            })
        }
        function confirm() {
            if (appForm.value.id) {
                api_updateApp(appForm.value).then((res: any) => {
                    messageBox.value.open(res.message, 'success')
                    getApp()
                })
            } else {
                api_insertApp(appForm.value).then((res: any) => {
                    messageBox.value.open(res.message, 'success')
                    getApp()
                })
            }
        }
        function addImg() {
            document.getElementById('appImg')?.click()
        }
        function setImg(e: any) {
            const formData = new FormData()
            formData.append('image', e.target.files[0])
            api_upload(formData).then((res: any) => {
                appForm.value.imgUrl = res.file
            })
        }
        function limitSize(e: any) {
            if (parseInt(e.target.value) < 40) {
                e.target.value = '40'
            }
            if (parseInt(e.target.value) > 75) {
                e.target.value = '75'
            }
        }
        function limitFontSize(e: any) {
            if (parseInt(e.target.value) < 10) {
                e.target.value = '10'
            }
            if (parseInt(e.target.value) > 30) {
                e.target.value = '30'
            }
        }
        onBeforeMount(() => {
            getSetting()
            getApp()
        })
        return {
            active, setting, showSelect, messageBox, appList, dialogView,
            appForm, dialogViewRemove, hint,
            selectBgImg, upload, back, save, confirm, addShow, batchRemove,
            handleRemove, editShow, addImg, setImg, remove, limitSize, limitFontSize
        }
    }
})
</script>

<style scoped>
@media screen and (max-width: 800px) {
    .app_list {
        margin: 0 10px;
        border-top: 1px solid #e6daf8;
        overflow: scroll;
        height: 70vh;
    }
}

@media screen and (min-width: 800px) {
    .app_list {
        margin: 0 10px;
        border-top: 1px solid #e6daf8;
        overflow: scroll;
        height: 80vh;
    }
}

#set_container {
    display: flex;
    width: 100%;
}

.sidebar {
    display: flex;
    flex-direction: column;
    width: 15%;
    background: #f6f2fc;
    position: absolute;
    top: 40px;
    bottom: 0;
    padding-top: 10px;
}

.item {
    padding: 10px;
    font-size: 13px;
    text-align: center;
    cursor: pointer;
    color: #6b46c1;
    font-weight: bolder;
    transition-duration: 500ms;
}

.item:hover {
    background: #e6daf8;
    transition-duration: 500ms;
}

.active {
    background: #e6daf8;
}

.content {
    width: 85%;
    top: 40px;
    margin-left: 15%;
    bottom: 0;
}

#bgImg {
    display: none;
}

.form {
    margin: 50px 30px;
}

.form_item {
    display: flex;
    margin: 10px;
    font-size: 14px;
    color: #6b46c1;
}

label {
    color: #6b46c1;
    font-weight: bolder;
    font-size: 14px;
    margin: 3px;
}

.bg_img {
    width: 80px;
    height: 60px;
    box-shadow: 0 0 5px #e6daf8;
    cursor: pointer;
}

.app_img {
    width: 60px;
    height: 60px;
    box-shadow: 0 0 5px #e6daf8;
    background-color: white;
    cursor: pointer;
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

input {
    padding: 5px;
    border-radius: 4px;
    outline: none;
    border: 1px solid #fff;
    background: #f6f2fc;
    transition-duration: 500ms;
}

input:focus {
    border: 1px solid #6b46c1;
    transition-duration: 500ms;
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

.head {
    display: flex;
    justify-content: space-between;
    width: 110px;
    margin: 20px;
    white-space: nowrap;
}

.app_list::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}

.app_list::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #c7bae4;
}


.app_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 5px;
    padding-left: 10px;
    border: 1px solid #e6daf8;
    border-top: none;
    min-width: 800px;
}

#appImg {
    display: none;
}
</style>