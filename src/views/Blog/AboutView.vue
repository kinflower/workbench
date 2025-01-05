<template>
    <div class="bg">
        <el-scrollbar class="container" ref="scroll">
            <headView></headView>
            <div class="list"></div>
        </el-scrollbar>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import headView from './components/headView.vue';

export default defineComponent({
    name: 'AboutView',
    setup() {
        return {
            
        }
    },
    components: { headView }
})
</script>

<style scoped>
.bg {
    background-color: #cbbea6;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.container {
    background-color: #ffffff;
    margin: 0 8%;
}

.list {
    margin: 0 15%;
}

</style>