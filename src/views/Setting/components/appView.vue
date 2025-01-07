<template>
    <div class="app_content">
        <el-tabs v-model="activeName">
            <el-tab-pane label="输入框" name="search">
                <div class="btn_group">
                    <el-button type="primary" @click="addShow('search')">新增</el-button>
                    <el-button type="danger" @click="batchRemove">删除</el-button>
                </div>
                <el-scrollbar height="80vh">
                    <el-table :data="appList_url" border style="width: 98.5%" @selection-change="handleSelectionUrl">
                        <el-table-column type="selection" width="55" />
                        <el-table-column prop="appName" label="应用名称" width="180" />
                        <el-table-column prop="url" label="应用链接" width="400" />
                        <el-table-column prop="imgUrl" label="应用图标" width="100">
                            <template #default="scope">
                                <el-image class="app_img" :src="scope.row.imgUrl">
                                    <template #error>
                                        <div class="image-slot">
                                            <el-icon><icon-picture /></el-icon>
                                        </div>
                                    </template>
                                </el-image>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" min-width="120">
                            <template #default="scope">
                                <el-button link type="primary" @click="editShow(scope.row)">编辑</el-button>
                                <el-button link type="danger"
                                    @click="handleRemove(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane label="应用" name="url">
                <div class="btn_group">
                    <el-button type="primary" @click="addShow('url')">新增</el-button>
                    <el-button type="danger" @click="batchRemove">删除</el-button>
                </div>
                <el-scrollbar height="80vh">
                    <el-table :data="appList_app" border style="width: 98.5%" @selection-change="handleSelectionApp">
                        <el-table-column type="selection" width="55" />
                        <el-table-column prop="appName" label="应用名称" width="180" />
                        <el-table-column prop="url" label="应用链接" width="400" />
                        <el-table-column prop="imgUrl" label="应用图标" width="100">
                            <template #default="scope">
                                <el-image class="app_img" :src="scope.row.imgUrl">
                                    <template #error>
                                        <div class="image-slot">
                                            <el-icon><icon-picture /></el-icon>
                                        </div>
                                    </template>
                                </el-image>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" min-width="120">
                            <template #default="scope">
                                <el-button link type="primary" @click="editShow(scope.row)">编辑</el-button>
                                <el-button link type="danger"
                                    @click="handleRemove(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-scrollbar>
            </el-tab-pane>
        </el-tabs>
        <el-dialog v-model="dialogVisible" :title="title" width="500" append-to-body>
            <el-form :model="appForm" label-width="80px">
                <el-form-item label="应用名称">
                    <el-input style="max-width: 200px;" v-model="appForm.appName" :placeholder="`输入${hint}名称`"
                        clearable />
                </el-form-item>
                <el-form-item label="应用链接">
                    <el-input style="max-width: 200px;" v-model="appForm.url" :placeholder="`输入${hint}链接`" clearable />
                </el-form-item>
                <el-form-item label="图标类型">
                    <el-radio-group v-model="appForm.uploadType">
                        <el-radio value="file" size="large">文件</el-radio>
                        <el-radio value="url" size="large">链接</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="appForm.uploadType == 'file'" label="图标上传">
                    <el-image class="app_img" :src="appForm.imgUrl" @click="addImg">
                        <template #error>
                            <div class="image-slot">
                                <el-icon><icon-picture /></el-icon>
                            </div>
                        </template>
                    </el-image>
                    <input type="file" id="appImg" @change="setImg">
                </el-form-item>
                <el-form-item v-else-if="appForm.uploadType == 'url'" label="图标链接">
                    <el-input style="max-width: 200px;" v-model="appForm.imgUrl" placeholder="输入链接地址" clearable />
                </el-form-item>
                <div style="display: flex;justify-content: right;align-items: center;">
                    <el-button type="primary" @click="confirm">确定</el-button>
                    <el-button @click="dialogVisible = false">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { api_insertApp, api_removeApp, api_selectApp, api_updateApp } from '@/api/setting';
import { defineComponent, onBeforeMount, ref, type Ref } from 'vue'
import { Picture as IconPicture } from '@element-plus/icons-vue'
import type { AppForm } from '../setting';
import { api_upload } from '@/api/login';
import { ElMessage, ElMessageBox } from 'element-plus';

export default defineComponent({
    setup() {
        const activeName = ref('search')
        const appList: Ref<any> = ref([])
        const appList_url: Ref<any> = ref([])
        const appList_app: Ref<any> = ref([])
        const dialogVisible = ref(false)
        const title = ref('')
        const hint: Ref<string> = ref('')
        const appForm: Ref<AppForm> = ref({
            appName: '',
            url: '',
            imgUrl: '',
            type: '',
            uploadType: 'file'
        })
        const select_url = ref([])
        const select_app = ref([])
        function getApp() {
            api_selectApp().then((res: any) => {
                appList.value = res.message
                appList_url.value = res.message.filter((item: any) => item.type == 'search')
                appList_app.value = res.message.filter((item: any) => item.type == 'url')
            })
        }
        function reset() {
            appForm.value = {
                appName: '',
                url: '',
                imgUrl: '',
                uploadType: '',
                type: ''
            }
        }
        function addShow(type: string) {
            reset()
            appForm.value.type = type
            if(type == 'search') {
                hint.value = '链接'
            }else if(type == 'url') {
                hint.value = '应用'
            }
            title.value = '新增'
            dialogVisible.value = true
        }
        function editShow(item: any) {
            reset()
            appForm.value = Object.assign({}, item)
            title.value = '编辑'
            dialogVisible.value = true
        }
        function batchRemove() {
            if(activeName.value == 'url') {
                if (select_app.value.length == 0) {
                    ElMessage({ type: 'warning', message: '请选择删除项', showClose: true })
                }else {
                    ElMessageBox.confirm('是否删除所选项？', {
                        cancelButtonText: '取消',
                        confirmButtonText: '确定'
                    }).then(() => {
                        api_removeApp(select_app.value).then((res: any) => {
                            ElMessage({ type: 'success', message: res.message, showClose: true })
                            getApp()
                            dialogVisible.value = false
                        })
                    }).catch(() => {})
                }
            }else if(activeName.value == 'search') {
                if (select_url.value.length == 0) {
                    ElMessage({ type: 'warning', message: '请选择删除项', showClose: true })
                }else {
                    ElMessageBox.confirm('是否删除所选项？', {
                        cancelButtonText: '取消',
                        confirmButtonText: '确定'
                    }).then(() => {
                        api_removeApp(select_url.value).then((res: any) => {
                            ElMessage({ type: 'success', message: res.message, showClose: true })
                            getApp()
                            dialogVisible.value = false
                        })
                    }).catch(() => {})
                }
            }
        }
        function handleRemove(item: any) {
            ElMessageBox.confirm('是否删除所选项？', {
                cancelButtonText: '取消',
                confirmButtonText: '确定'
            }).then(() => {
                api_removeApp([item.id]).then((res: any) => {
                    ElMessage({ type: 'success', message: res.message, showClose: true })
                    getApp()
                    dialogVisible.value = false
                })
            })
        }
        function confirm() {
            if (appForm.value.id) {
                api_updateApp(appForm.value).then((res: any) => {
                    ElMessage({ type: 'success', message: res.message, showClose: true })
                    getApp()
                    dialogVisible.value = false
                })
            } else {
                api_insertApp(appForm.value).then((res: any) => {
                    ElMessage({ type: 'success', message: res.message, showClose: true })
                    getApp()
                    dialogVisible.value = false
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
        function handleSelectionUrl(e: any) {
            select_url.value = e.map((item: any) => item.id)
        }
        function handleSelectionApp(e: any) {
            select_app.value = e.map((item: any) => item.id)
        }
        onBeforeMount(() => {
            getApp()
        })
        return {
            activeName, appList, dialogVisible, title, hint, appForm,
            appList_url, appList_app,
            getApp, addShow, addImg, setImg, confirm, editShow,
            batchRemove, handleRemove, handleSelectionUrl, handleSelectionApp
        }
    },
    components: { IconPicture }
})
</script>

<style scoped>
.app_content {
    margin: 0 5px;
}

.app_img {
    width: 60px;
    height: 60px;
    box-shadow: 0 0 5px #e6daf8;
    background-color: white;
    cursor: pointer;
}

#appImg {
    display: none;
}

.btn_group {
    margin: 15px 0;
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