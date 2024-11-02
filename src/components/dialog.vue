<template>
    <Transition>
        <div v-if="isVisible" class="modal">
            <div class="modal-content">
                <div class="message">{{ message }}</div>
                <div class="btn_group">
                    <button types="default" class="confirm" @click="confirm">确定</button>
                    <button types="info" class="cancel" @click="cancel">取消</button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue'
export default defineComponent({
    name: "dialogView",
    setup(props, { emit }) {
        const isVisible: Ref<boolean> = ref(false)
        const message: Ref<string> = ref('是否确定？')
        const data: Ref<string> = ref('')
        const setData = (value: string) => {
            data.value = value
        }
        const confirm = () => {
            isVisible.value = false
            emit('confirm', data.value)
        }
        const cancel = () => {
            isVisible.value = false
            emit('cancel', data.value)
        }
        return {
            isVisible, message,
            confirm, cancel, setData
        }
    }
})
</script>

<style scoped>
.modal {
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
}

.modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 10px;
    border: 1px solid #888;
    width: 300px;
}
.message {
    font-size: 15px;
    margin-top: 10px;
}

.btn_group {
    display: flex;
    align-items: center;
    justify-content: right;
    margin-top: 10px;
}

.confirm {
    margin-right: 10px;
}
</style>