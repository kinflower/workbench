<template>
    <transition>
        <div class="bg" v-if="show" @click="show = false">
            <img class="preview" :src="src" alt="preview">
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue'

export default defineComponent({
    name: 'imgView',
    props: {
        src: {
            type: String,
            default: () => ''
        }
    },
    setup () {
        const show: Ref<boolean> = ref(false)
        return {
            show
        }
    }
})
</script>

<style scoped>
.bg {
    background: #5f5f5f59;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
}
.preview {
    width: 80%;
    height: 70%;
}
</style>