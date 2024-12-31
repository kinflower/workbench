<template>
    <Transition>
        <div v-if="visible" class="modal-overlay" :style="{backgroundColor: setBgColor, color: setColor}">
            <div class="modal-content">{{ title }}</div>
            <i class="iconfont icon-close" @click="visible = false"></i>
        </div>
    </Transition>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, type Ref } from 'vue';
export default defineComponent({
    name: 'messageBox',
    setup() {
        const title: Ref<string> = ref('操作成功')
        const autoClose: Ref<boolean> = ref(true)
        const visible: Ref<boolean> = ref(false)
        const type: Ref<string> = ref('success')
        const delay: Ref<number> = ref(2000)
        const setBgColor = computed(() => {
            if(type.value == 'success') {
                return '#c2e7b0'
            }else if(type.value == 'error') {
                return '#f8d4d2'
            }else if(type.value == 'warn') {
                return '#f7e5cb'
            } else {
                return '#dddddd'
            }
        })
        const setColor = computed(() => {
            if(type.value == 'success') {
                return '#429618'
            }else if(type.value == 'error') {
                return '#d34b41'
            }else if(type.value == 'warn') {
                return '#df9931'
            } else {
                return '#dddddd'
            }
        })
        watch(visible, (newVal) => {
            if(newVal && autoClose.value) {
                setTimeout(() => {
                    visible.value = false
                }, delay.value)
            }
        })
        function open(title_val: string, type_val: string) {
            title.value = title_val
            type.value = type_val
            visible.value = true
        }
        return {
            title, autoClose, visible, type, delay,
            setBgColor, setColor, open
        }
    }
})
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 300px;
    z-index: 100;
    margin: 10px auto;
    padding: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    background-color: rgb(244, 241, 247);
    box-shadow: 0 0 5px rgb(235, 221, 250);
}

.modal-content {
    width: 300px;
    font-size: 14px;
}

.icon-close {
    font-size: 12px;
    cursor: pointer;
}
</style>