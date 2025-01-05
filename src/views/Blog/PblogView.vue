vb<template>
    <div class="bg">
        <el-scrollbar class="container" ref="scroll">
            <headView></headView>
            <div class="list">
                <div class="item" v-for="(item, index) in list" :key="index">
                    <el-image :src="item.src" lazy></el-image>
                    <h3 class="title">{{ item.title }}</h3>
                    <div class="box">
                        <div class="time">
                            <el-icon style="margin-right: 5px;">
                                <Calendar />
                            </el-icon>
                            <div>{{ item.time }}</div>
                        </div>
                        <div>
                            <el-tag type="success">{{ item.type }}</el-tag>
                        </div>
                    </div>
                    <div class="commit">
                        <el-input v-model="item.commit" style="width: 100%" :rows="2" type="textarea"
                            placeholder="给个善意的评论..." />
                        <el-button class="submit" type="primary">提交</el-button>
                    </div>
                </div>
            </div>
            <div class="page">
                <el-pagination background layout="prev, pager, next" :current-page="param.current" :total="param.total" @current-change="handlePage" />
            </div>
        </el-scrollbar>
    </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive, ref } from 'vue'
import headView from './components/headView.vue';
import { api_select_page_pic } from '@/api/blog';
import { Calendar } from '@element-plus/icons-vue'

export default defineComponent({
    name: 'PblogView',
    setup() {
        const list: any = ref([])
        const scroll: any = ref()
        const param: any = reactive({
            size: 10,
            current: 1,
            total: 0
        })
        function getPicList() {
            api_select_page_pic(param).then((res: any) => {
                list.value = res.message
                param.total = res.total
            })
        }
        function handlePage(index: number) {
            param.current = index
            scroll.value.setScrollTop(0)
            getPicList()
        }
        onBeforeMount(() => {
            getPicList()
        })
        return {
            param, list, scroll,
            handlePage
        }
    },
    components: { headView, Calendar }
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

.box {
    display: flex;
    align-items: center;
}

.time {
    display: flex;
    align-items: center;
    color: #aaaaaa;
    font-size: 16px;
    margin-right: 15px;
}

.commit {
    margin-top: 20px;
    width: 100%;
}

.submit {
    margin: 20px 0;
}

.page {
    display: flex;
    justify-content: center;
    margin: 20px;
}
</style>