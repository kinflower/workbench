<template>
    <div>
        <el-form ref="formRef" :model="form" label-width="auto">
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" autocomplete="off" placeholder="输入标题" />
            </el-form-item>
            <el-form-item label="时间" prop="time">
                <el-date-picker v-model="form.time" type="date" placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="图片" prop="url">
                <el-upload class="upload-demo" drag :action="baseURL + 'upload'" @on-success="getPicUrl">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                        Drop file here or <em>click to upload</em>
                    </div>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm(formRef)">提交</el-button>
                <el-button @click="resetForm(formRef)">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { baseURL, picURL } from '@/api';
import type { FormInstance, UploadFile } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup() {
        const form: any = ref({})
        const formRef = ref<FormInstance>()
        function submitForm(formEl: FormInstance | undefined) {
            if (!formEl) return
            formEl.validate((valid) => {
                if (valid) {
                    console.log('submit!')
                } else {
                    console.log('error submit!')
                }
            })
        }
        function resetForm(formEl: FormInstance | undefined) {
            if (!formEl) return
            formEl.resetFields()
        }
        function getPicUrl(response: any, uploadFile: UploadFile) {
            console.log(response, uploadFile)
        }
        return {
            form, formRef, picURL, baseURL,
            submitForm, resetForm, getPicUrl
        }
    },
    components: {UploadFilled}
})
</script>

<style scoped></style>