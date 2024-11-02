<template>
    <div class="bg">
        <input class="search" v-model="search" placeholder="输入关键字">
        <div class="content">
            <div class="item" v-for="(item, index) in list" :key="index" @click="openApp(item.name)">
                <div class="icon" :class="item.icon"></div>
                <div class="title">{{ item.name }}</div>
            </div>
        </div>
        <div class="memo">
            <MemoView ref="memo"></MemoView>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import MemoView from '@/components/memo/memoView.vue';
export default defineComponent({
    name: 'HomeView',
    setup() {
        const list = ref([
            {
                name: '备忘录',
                icon: 'iconfont icon-beiwanglu'
            }
        ])
        const search: Ref<string> = ref('')
        const memo: Ref<any> = ref(null)
        function openApp(name: string) {
            switch(name) {
                case '备忘录':
                    memo.value.showDialog()
                    break
            }
        }
        return {
            list, search, memo,
            openApp
        }
    },
    components: {MemoView}
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
    overflow: hidden;
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
    font-size: 45px;
    color: #e9e9e9;
    text-align: center;
    padding-top: 15px;
}
.title {
    margin-top: 5px;
    font-weight: bolder;
}
.icon:hover {
    filter: opacity(0.9);
}
</style>