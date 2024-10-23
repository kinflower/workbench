<template>
    <Transition>
        <div v-if="visible" class="modal-overlay" :style="{backgroundColor: setBgColor, color: setColor}">
            <div class="modal-content">{{ title }}</div>
            <i class="iconfont icon-close" @click="closeModal"></i>
        </div>
    </Transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'messageBox',
    data() {
        return {
            title: '操作成功',
            autoClose: true,
            visible: false,
            type: 'success',
            delay: 2000
        }
    },
    computed: {
        setBgColor() {
            if(this.type == 'success') {
                return '#c2e7b0'
            }else if(this.type == 'error') {
                return '#f8d4d2'
            }else if(this.type == 'warn') {
                return '#f7e5cb'
            } else {
                return '#dddddd'
            }
        },
        setColor() {
            if(this.type == 'success') {
                return '#429618'
            }else if(this.type == 'error') {
                return '#d34b41'
            }else if(this.type == 'warn') {
                return '#df9931'
            } else {
                return '#dddddd'
            }
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
        },
        open(title: string, type: string) {
            this.title = title
            this.type = type
            this.visible = true
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
</style>