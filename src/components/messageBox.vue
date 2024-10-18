<template>
    <Transition>
        <div v-if="visible" class="modal-overlay">
            <div class="modal-content">{{ title }}</div>
            <i class="iconfont icon-close" @click="closeModal"></i>
        </div>
    </Transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'MessageBox',
    data() {
        return {
            title: '操作成功',
            autoClose: true,
            visible: false,
            delay: 2000
        }
    },
    watch: {
        visible(newVal) {
            if(newVal && this.autoClose) {
                setTimeout(() => {
                    this.visible = false
                }, this.delay)
            }
        }
    },
    methods: {
        closeModal() {
            this.visible = false
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

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>