<template>
    <div class="head">
        <div class="left" @click="handleTab('Home')">个人作品相册</div>
        <div class="right_moblie">
            <el-dropdown placement="bottom">
                <el-icon>
                    <MoreFilled />
                </el-icon>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="handleTab('Home')">主页</el-dropdown-item>
                        <el-dropdown-item @click="handleTab('About')">关于</el-dropdown-item>
                        <el-dropdown-item @click="handleTab('Blog')">博客</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="right">
            <div :class="index==1?'active_title':'right_title'" @click="handleTab('Home')">主页</div>
            <div :class="index==2?'active_title':'right_title'" @click="handleTab('About')">关于</div>
            <div :class="index==3?'active_title':'right_title'" @click="handleTab('Blog')">博客</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { MoreFilled } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router';
export default defineComponent({
    name: 'headView',
    setup() {
        const router = useRouter()
        const index = ref(1)
        let name = useRoute().name
        if(name == 'Blog') {
            index.value = 1
        }else if(name == 'About') {
            index.value = 2
        }else if(name == 'Pblog') {
            index.value = 3
        }
        function handleTab(name: string) {
            switch (name) {
                case 'Home':
                    router.push('/blog')
                    break
                case 'About':
                    router.push('/about')
                    break
                case 'Blog':
                    router.push('/pblog')
                    break
            }
        }
        return {
            index, handleTab
        }
    },
    components: {MoreFilled}
})
</script>

<style scoped>
@media screen and (min-width: 800px) {
    .right {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: bolder;
    }

    .right_moblie {
        display: none;
    }
}

@media screen and (max-width: 800px) {
    .right {
        display: none;
    }

    .right_moblie {
        display: flex;
        align-items: center;
        cursor: pointer;
    }
}

.head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 50px 15%;
}

.left {
    font-size: 18px;
    font-weight: bolder;
    cursor: pointer;
}

.right_title {
    margin-left: 20px;
    cursor: pointer;
    color: #818181;
}

.right_title:hover {
    color: #000000;
}

.active_title {
    margin-left: 20px;
    cursor: pointer;
    color: #000000;
}
</style>