<template>
    <div>
        <div class="content">
            <div class="title" @click="handleNav">练习汇总平台</div>
            <div class="box">
                <div class="name">{{ info.name?info.name:'未设置昵称' }}</div>
                <img v-if="info.imgUrl" :src="info.imgUrl" alt="headImg" @click="setShow">
                <img v-else src="../assets/pic.png" alt="headImg" @click="setShow">
            </div>
            <Transition>
                <div v-if="showSelect" class="select">
                    <div class="triangle"></div>
                    <div class="select_item" v-for="(item, index) in list" :key="index" @click="handleEvent(item)">{{item}}</div>
                </div>
            </Transition>
        </div>
        <dialogView ref="dialogView" @confirm="confirm"></dialogView>
    </div>
</template>

<script lang="ts">
import { api_personalInfo } from '@/api/login';
import { useInfoStore } from '@/stores/info';
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router';
export default defineComponent({
    name: "HeadView",
    setup () {
        const router = useRouter();
        const list = ref([ '个人', '退出' ])
        const showSelect = ref(false)
        const info: any = ref({})
        const dialogView: any = ref(null)
        const infoStores = useInfoStore()
        const handleEvent = (val: string) => {
            if(val == '个人') {
                router.push('/personage')
            }else if(val == '退出') {
                dialogView.value.message = '是否退出当前账号?'
                dialogView.value.isVisible = true
            }
        }
        const setShow = () => {
            showSelect.value = true
        }
        const confirm = () => {
            localStorage.clear()
            router.replace('/login')
            window.location.reload()
        }
        const handleNav = () => {
            router.push('/')
        }
        const getPersonalInfo = () => {
            api_personalInfo().then((res: any) => {
                info.value = res.message
                infoStores.setInfo(res.message)
            })
        }
        return {
            list, showSelect, dialogView, info, infoStores,
            handleEvent, setShow, confirm, handleNav, getPersonalInfo
            
        };
    },
    watch: {
        ["infoStores.state"]() {
            this.getPersonalInfo()
        }
    },
    created() {
        const token = localStorage.getItem('token')
        if(token) {
            this.getPersonalInfo()
        }
        document.addEventListener("click", (e: any) => {
            if(e.target.localName != 'img') {
                this.showSelect = false
            }
        })
    }
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
    font-size: 14px;
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
    border-radius: 5px;
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
</style>