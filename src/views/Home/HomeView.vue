<template>
    <div class="bg">
        <input class="search" v-model="search" placeholder="输入关键字">
        <div class="content">
            <div class="item" v-for="(item, index) in list" :key="index">
                <div class="icon"></div>
                <div class="title">{{ item.name }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
    name: 'HomeView',
    setup() {
        const list = ref([
            {
                name: '应用1'
            },
            {
                name: '应用2'
            },
            {
                name: '应用3'
            },
            {
                name: '应用4'
            },
            {
                name: '应用5'
            },
            {
                name: '应用6'
            },
            {
                name: '应用7'
            },
            {
                name: '应用8'
            }
        ])
        const search = ref('')
        return {
            list, search
        }
    },
});
</script>
<style scoped>
.bg {
    background: #dfdfdf;
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
}
.search {
    margin: 100px auto 0;
    padding: 10px;
    width: 350px;
    display: block;
}
.content {
    display: flex;
    flex-wrap: wrap;
    width: 80%;
    margin: 30px auto 20px;
}
.item {
    width: 25%;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
}
.icon {
    width: 75px;
    height: 80px;
    border-radius: 5px;
    background: #6b46c1;
    cursor: pointer;
}
.title {
    margin-top: 5px;
    font-weight: bolder;
}
.icon:hover {
    filter: opacity(0.9);
}
</style>