<template>
    <div class="app_content">
        <div class="btn_group">
            <el-button type="primary" @click="addShow">新增</el-button>
            <el-button type="danger" @click="batchRemove">删除</el-button>
        </div>
        <el-scrollbar height="80vh" ref="scroll">
            <el-table :data="appList" border style="width: 98.5%" @selection-change="handleSelection">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="title" label="标题" width="200" />
                <el-table-column prop="time" label="时间" width="200" />
                <el-table-column prop="type" label="类型" width="100">
                    <template #default="scope">
                        <div v-if="scope.row.type == 'art'">画作</div>
                        <div v-if="scope.row.type == 'food'">美食</div>
                    </template>
                </el-table-column>
                <el-table-column prop="src" label="图片" align="center" width="150">
                    <template #default="scope">
                        <el-image class="app_img" :src="scope.row.src">
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
                        <el-button link type="danger" @click="handleRemove(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-scrollbar>
        <div class="page">
            <el-pagination background layout="prev, pager, next" :current-page="param.current" :total="param.total" @current-change="handlePage" />
        </div>
        <el-dialog v-model="dialogVisible" :title="title" width="500" append-to-body>
            <el-form :model="blogForm" label-width="80px">
                <el-form-item label="标题">
                    <el-input style="max-width: 200px;" v-model="blogForm.title" :placeholder="`输入标题`"
                        clearable />
                </el-form-item>
                <el-form-item label="时间">
                    <el-date-picker style="max-width: 200px;" v-model="blogForm.time" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio-group v-model="blogForm.type">
                        <el-radio value="art" size="large">画作</el-radio>
                        <el-radio value="food" size="large">美食</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="上传">
                    <el-image class="app_img" style="width: 60px;" :src="blogForm.src" @click="addImg">
                        <template #error>
                            <div class="image-slot">
                                <el-icon><icon-picture /></el-icon>
                            </div>
                        </template>
                    </el-image>
                    <input type="file" id="appImg" @change="setImg">
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
import { defineComponent, onBeforeMount, reactive, ref, type Ref } from 'vue'
import type { BlogForm } from '../setting';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { api_insert_blog, api_remove_blog, api_select_page_pic, api_update_blog } from '@/api/blog';
import { api_upload } from '@/api/login';

export default defineComponent({
    setup() {
        const dialogVisible = ref(false)
        const appList: Ref<any> = ref([])
        const title = ref('')
        const select = ref([])
        const scroll: any = ref()
        const param: any = reactive({
            size: 10,
            current: 1,
            total: 0
        })
        const blogForm: Ref<BlogForm> = ref({
            title: '',
            src: '',
            time: '',
            type: ''
        })
        function reset() {
            blogForm.value = {
                title: '',
                src: '',
                time: '',
                type: ''
            }
        }
        function addShow() {
            reset()
            title.value = '新增'
            dialogVisible.value = true
        }
        function editShow(item: any) {
            reset()
            blogForm.value = Object.assign({}, item)
            title.value = '编辑'
            dialogVisible.value = true
        }
        function addImg() {
            document.getElementById('appImg')?.click()
        }
        function setImg(e: any) {
            const formData = new FormData()
            formData.append('image', e.target.files[0])
            api_upload(formData).then((res: any) => {
                blogForm.value.src = res.file
            })
        }
        function confirm() {
            if (blogForm.value.id) {
                api_update_blog(blogForm.value).then((res: any) => {
                    ElMessage({ type: 'success', message: res.message, showClose: true })
                    getBlog()
                    dialogVisible.value = false
                })
            } else {
                api_insert_blog(blogForm.value).then((res: any) => {
                    ElMessage({ type: 'success', message: res.message, showClose: true })
                    getBlog()
                    dialogVisible.value = false
                })
            }
        }
        function batchRemove() {
            if (select.value.length == 0) {
                ElMessage({ type: 'warning', message: '请选择删除项', showClose: true })
            } else {
                ElMessageBox.confirm('是否删除所选项？', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定'
                }).then(() => {
                    api_remove_blog(select.value).then((res: any) => {
                        ElMessage({ type: 'success', message: res.message, showClose: true })
                        getBlog()
                        dialogVisible.value = false
                    })
                }).catch(() => { })
            }
        }
        function handleRemove(item: any) {
            ElMessageBox.confirm('是否删除所选项？', {
                cancelButtonText: '取消',
                confirmButtonText: '确定'
            }).then(() => {
                api_remove_blog([item.id]).then((res: any) => {
                    ElMessage({ type: 'success', message: res.message, showClose: true })
                    getBlog()
                    dialogVisible.value = false
                })
            })
        }
        function getBlog() {
            api_select_page_pic(param).then((res: any) => {
                appList.value = res.message
                param.total = res.total
            })
        }
        function handleSelection(e: any) {
            select.value = e.map((item: any) => item.id)
        }
        function handlePage(index: number) {
            param.current = index
            scroll.value.setScrollTop(0)
            getBlog()
        }
        onBeforeMount(() => {
            getBlog()
        })
        return {
            appList, dialogVisible, title, blogForm, param, scroll,
            addShow, batchRemove, addImg, setImg, editShow, confirm,
            handleRemove, handleSelection, handlePage
        }
    },
    components: { IconPicture }
})
</script>

<style scoped>
.app_img {
    width: auto;
    height: 60px;
    box-shadow: 0 0 5px #e6daf8;
    background-color: white;
    cursor: pointer;
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

.app_content {
    margin: 0 5px;
}

.btn_group {
    margin: 15px 0;
}

#appImg {
    display: none;
}

.page {
    display: flex;
    justify-content: center;
    margin: 5px;
}
</style>