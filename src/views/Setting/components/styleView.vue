<template>
    <div class="form">
        <el-form :model="setting" label-width="80px">
            <el-form-item label="背景图片">
                <el-image class="bg_img" :src="setting.imgUrl" alt="bgImg" @click="selectBgImg">
                    <template #error>
                        <div class="image-slot">
                            <el-icon><icon-picture /></el-icon>
                        </div>
                    </template>
                </el-image>
                <input type="file" id="bgImg" accept="image/*" @change="upload">
            </el-form-item>
            <el-form-item label="字体大小">
                <el-input type="number" style="max-width: 200px;" v-model="setting.fontSize" min="10" max="30"
                    placeholder="输入字体大小" />
            </el-form-item>
            <el-form-item label="字体颜色">
                <el-color-picker v-model="setting.fontColor" clearable />
            </el-form-item>
            <el-form-item label="列数">
                <el-radio-group v-model="setting.column">
                    <el-radio value="4" size="large">4列</el-radio>
                    <el-radio value="5" size="large">5列</el-radio>
                    <el-radio value="6" size="large">6列</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="图标大小">
                <el-input type="number" style="max-width: 200px;" v-model="setting.size" min="40" max="75"
                    placeholder="输入图标大小" />
            </el-form-item>
            <el-form-item label="图标圆角">
                <el-input type="number" style="max-width: 200px;" v-model="setting.radius" min="0" max="50"
                    placeholder="输入图标圆角" />
            </el-form-item>
            <el-form-item>
                <el-button color="#A477CD" plain @click="save">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue'
import type { Setting } from '../setting';
import { api_selectSetting, api_updateSetting } from '@/api/setting';
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { useInfoStore } from '@/stores/info';
import { api_personalInfo, api_upload } from '@/api/login';
import { ElMessage } from 'element-plus';

export default defineComponent({
    setup() {
        const infoStores: any = useInfoStore()
        const setting: Setting = reactive({
            id: null,
            imgUrl: "",
            fontSize: null,
            fontColor: null,
            radius: null,
            size: null,
            column: null
        })
        function save() { // 保存设置信息
            api_updateSetting(Object.assign({},setting)).then((res: any) => {
                ElMessage({ type: 'success', message: res.message, showClose: true })
                getSetting()
            })
        }
        async function getSetting() {
            if (!infoStores.info.email) {
                await api_personalInfo()
            }
            api_selectSetting({ email: infoStores.info.email }).then((res: any) => {
                setting.id = res.message[0].id
                setting.imgUrl = res.message[0].imgUrl
                setting.fontSize = res.message[0].fontSize
                setting.fontColor = res.message[0].fontColor
                setting.radius = res.message[0].radius
                setting.size = res.message[0].size
                setting.column = res.message[0].column
            })
        }
        function selectBgImg() {
            document.getElementById('bgImg')?.click()
        }
        function upload(e: any) { // 上传图片
            const formData = new FormData()
            formData.append('image', e.target.files[0])
            api_upload(formData).then((res: any) => {
                setting.imgUrl = res.file
            })
        }
        onMounted(() => {
            getSetting()
        })
        return {
            setting,
            save, selectBgImg, upload
        }
    },
    components: {
        IconPicture
    }
})
</script>

<style scoped>
.form {
    margin: 50px 30px;
}

.bg_img {
    width: 80px;
    height: 60px;
    box-shadow: 0 0 5px #e6daf8;
    cursor: pointer;
}

#bgImg {
    display: none;
}

.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
}
</style>