<template>
    <div>
        <div class="content">
            <div class="title" @click="handleNav('/')">练习汇总平台</div>
            <div class="box">
                <el-dropdown v-show="show">
                    <span class="project">个人项目</span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="handleNav('/memo')">备忘录</el-dropdown-item>
                            <el-dropdown-item @click="handleNav('/room')">立体房间</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <div class="name">{{ info.name ? info.name : '未设置昵称' }}</div>
                <img v-if="info.imgUrl" :src="info.imgUrl" alt="headImg" @click="showSelect = true">
                <img v-else src="../assets/pic.png" alt="headImg" @click="showSelect = true">
            </div>
            <Transition>
                <div v-if="showSelect" class="select">
                    <div class="triangle"></div>
                    <div class="select_item" v-for="(item, index) in list" :key="index" @click="handleEvent(item)">
                        {{ item }}</div>
                </div>
            </Transition>
        </div>
        <dialogView ref="dialogView" @confirm="confirm"></dialogView>
        <div class="memo">
            <MemoView ref="memo"></MemoView>
        </div>
    </div>
</template>

<script lang="ts">
import { api_personalInfo } from '@/api/login';
import { useInfoStore } from '@/stores/info';
import { defineComponent, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router';
import MemoView from '@/components/memo/memoView.vue';
export default defineComponent({
    name: "HeadView",
    setup() {
        const router = useRouter();
        const list  = ref(['个人', '设置', '退出'])
        const showSelect  = ref(false)
        const info  = ref({})
        const dialogView: any = ref(null)
        const memo: any  = ref(null)
        const show = ref(true)
        const infoStores = useInfoStore()
        onBeforeMount(() => {
            const token = localStorage.getItem('token')
            if (token) {
                getPersonalInfo()
            }
            document.addEventListener("click", (e: any) => {
                if (e.target.localName != 'img') {
                    showSelect.value = false
                }
            })
            console.log(navigator.platform)
        })
        const handleEvent = (val: string) => { // 事件处理
            if (val == '个人') {
                router.push('/personage')
            } else if (val == '设置') {
                router.push('/setting')
            } else if (val == '退出') {
                dialogView.value.message = '是否退出当前账号?'
                dialogView.value.isVisible = true
            }
        }
        const confirm = () => {
            localStorage.clear()
            router.replace('/login')
            window.location.reload()
        }
        const handleNav = (url: string) => {
            if(url == '/memo') {
                memo.value.showDialog()
                return
            }
            router.push(url)
        }
        const getPersonalInfo = () => { // 获取个人信息
            api_personalInfo().then((res: any) => {
                info.value = res.message
                infoStores.setInfo(res.message)
            })
        }
        return {
            list, showSelect, dialogView, info, memo, infoStores, show,
            handleEvent, confirm, handleNav, getPersonalInfo

        };
    },
    watch: {
        ["infoStores.state"]() {
            this.getPersonalInfo()
        }
    },
    components: {MemoView}
})
</script>

<style scoped>
.content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f0e6ff;
    padding: 5px 10px;
}

.box {
    display: flex;
    align-items: center;
}

.title,
.name {
    color: #6b46c1;
    font-weight: bolder;
    font-size: 16px;
}

.title {
    cursor: pointer;
}

img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin: 0 10px;
    cursor: pointer;
    -webkit-user-drag: none;
    box-shadow: 0 0 5px #cacaca;
}

.triangle {
    margin: -9px auto 0;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 10px solid #f0e6ff;
}

.select {
    position: absolute;
    top: 50px;
    right: 10px;
    width: 50px;
    border-radius: 2px;
    background: #f0e6ff;
    text-align: center;
    font-size: 12px;
    z-index: 100;
}

.select_item {
    padding: 5px 0;
    color: #6b46c1;
    cursor: pointer;
}

.select_item:hover {
    background: #e0d2f3;
}

.project {
    margin-right: 15px;
    color: #6b46c1;
    font-weight: bolder;
    font-size: 16px;
    cursor: pointer;
}
.project:hover,
.project:focus {
    outline: none;
}
</style>