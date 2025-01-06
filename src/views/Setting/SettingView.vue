<template>
    <div id="set_container">
        <div class="sidebar">
            <div class="item" :class="active == '1' ? 'active' : ''" @click="active = '1'">主页样式</div>
            <div class="item" :class="active == '2' ? 'active' : ''" @click="active = '2'">应用配置</div>
            <div class="item" :class="active == '3' ? 'active' : ''" @click="active = '3'">博客管理</div>
        </div>
        <div class="content" v-show="active == '1'">
            <styleView></styleView>
        </div>
        <div class="content" v-show="active == '2'">
            <appView></appView>
        </div>
        <div class="content" v-show="active == '3'">
            <blogAdmin></blogAdmin>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue'
import styleView from './components/styleView.vue';
import appView from './components/appView.vue';
import blogAdmin from './components/blogAdmin.vue';

export default defineComponent({
    name: 'SettingView',
    setup() {
        const active: Ref<string> = ref('1')
        return {
            active
        }
    },
    components: {
        styleView, appView, blogAdmin
    }
})
</script>

<style scoped>
@media screen and (max-width: 800px) {
    .app_list {
        margin: 0 10px;
        border-top: 1px solid #e6daf8;
        overflow: scroll;
        height: 70vh;
    }
}

@media screen and (min-width: 800px) {
    .app_list {
        margin: 0 10px;
        border-top: 1px solid #e6daf8;
        overflow: scroll;
        height: 80vh;
    }
}

#set_container {
    display: flex;
    width: 100%;
}

.sidebar {
    display: flex;
    flex-direction: column;
    width: 15%;
    background: #f6f2fc;
    position: absolute;
    top: 40px;
    bottom: 0;
    padding-top: 10px;
}

.item {
    padding: 10px;
    font-size: 13px;
    text-align: center;
    cursor: pointer;
    color: #6b46c1;
    font-weight: bolder;
    transition-duration: 500ms;
}

.item:hover {
    background: #e6daf8;
    transition-duration: 500ms;
}

.active {
    background: #e6daf8;
}

.content {
    width: 85%;
    margin-left: 15%;
}

#bgImg {
    display: none;
}

label {
    color: #6b46c1;
    font-weight: bolder;
    font-size: 14px;
    margin: 3px;
}

.app_img {
    width: 60px;
    height: 60px;
    box-shadow: 0 0 5px #e6daf8;
    background-color: white;
    cursor: pointer;
}

input {
    padding: 5px;
    border-radius: 4px;
    outline: none;
    border: 1px solid #fff;
    background: #f6f2fc;
    transition-duration: 500ms;
}

input:focus {
    border: 1px solid #6b46c1;
    transition-duration: 500ms;
}

.head {
    display: flex;
    justify-content: space-between;
    width: 110px;
    margin: 20px;
    white-space: nowrap;
}

.app_list::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}

.app_list::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #c7bae4;
}


.app_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 5px;
    padding-left: 10px;
    border: 1px solid #e6daf8;
    border-top: none;
    min-width: 800px;
}

#appImg {
    display: none;
}
</style>