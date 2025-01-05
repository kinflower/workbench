<template>
    <div class="bg">
        <el-scrollbar class="container" ref="scroll">
            <headView></headView>
            <div class="list">
                <div>美食是记录生活最好的证明，绘画是记录生活最好的印象</div>
                <div class="tab_box">
                    <div :class="tab_active == 1 ? 'tab_active' : 'tab'" @click="changeTab(1)">ALL</div>
                    <div :class="tab_active == 2 ? 'tab_active' : 'tab'" @click="changeTab(2)">Painting</div>
                    <div :class="tab_active == 3 ? 'tab_active' : 'tab'" @click="changeTab(3)">Food</div>
                </div>
                <div class="content">
                    <div v-for="(item, index) in list" class="box" :key="index" @mouseover="item.active = true"
                        @mouseleave="item.active = false">
                        <transition>
                            <div v-if="item.active" class="mask"></div>
                        </transition>
                        <el-image width="100%" height="100%" :src="item.src" :initial-index="index"
                            :preview-src-list="imgList" lazy></el-image>
                        <transition>
                            <div v-if="item.active" class="message">
                                <div>{{ item.title }}</div>
                                <div>{{ item.time }}</div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script lang="ts">
import { api_select_all_pic, api_select_pic } from '@/api/blog';
import { defineComponent, onBeforeMount, ref, type Ref } from 'vue'
import headView from './components/headView.vue';

export default defineComponent({
    name: 'BlogView',
    setup() {
        const list: any = ref([])
        const imgList: any = ref([])
        const tab_active: Ref<number> = ref(1)
        function handleTab(name: string) {
            switch (name) {
                case 'About':
                    break
                case 'Blog':
                    break
            }
        }
        function getAllPicList() {
            api_select_all_pic().then((res: any) => {
                list.value = res.message.map((item: any) => {
                    item.active = false
                    return item
                })
                imgList.value = res.message.map((item: any) => item.src)
            })
        }
        function getPicList(data: object) {
            api_select_pic(data).then((res: any) => {
                list.value = res.message.map((item: any) => {
                    item.active = false
                    return item
                })
                imgList.value = res.message.map((item: any) => item.src)
            })
        }
        function changeTab(index: number) {
            tab_active.value = index
            if (index == 1) {
                getAllPicList()
            } else if (index == 2) {
                getPicList({ type: 'art' })
            } else if (index == 3) {
                getPicList({ type: 'food' })
            }
        }
        onBeforeMount(() => {
            getAllPicList()
        })
        return {
            list, tab_active, imgList,
            handleTab, changeTab
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

@media screen and (min-width: 800px) {
    .content {
        column-count: 2;
        margin-bottom: 50px;
    }
}

@media screen and (max-width: 800px) {
    .content {
        column-count: 1;
        margin-bottom: 50px;
    }
}

.tab_box {
    display: flex;
    align-items: center;
    margin: 20px 0;
    overflow: scroll;
}

.tab_box::-webkit-scrollbar {
    width: 0;
    background-color: transparent;
}

.tab {
    margin-right: 20px;
    padding: 5px 20px;
    color: #917c55;
    border: 1px solid #917c55;
    border-radius: 5px;
    background-color: #ffffff;
    transition-duration: 400ms;
    cursor: pointer;
}

.tab:hover {
    color: #ffffff;
    border: 1px solid #ffffff;
    background-color: #917c55;
    transition-duration: 400ms;
}

.tab_active {
    margin-right: 20px;
    padding: 5px 20px;
    color: #ffffff;
    border: 1px solid #ffffff;
    border-radius: 5px;
    background-color: #917c55;
    cursor: pointer;
}

.box {
    position: relative;
    width: 100%;
    margin: 0 auto 20px;
    user-select: none;
}

.mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background-color: #0000005c;
    pointer-events: none;
}

.message {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    text-align: center;
    transform: translateY(-50%);
    color: #ffffff;
    font-weight: bolder;
    z-index: 2;
    cursor: pointer;
    pointer-events: none;
}
</style>