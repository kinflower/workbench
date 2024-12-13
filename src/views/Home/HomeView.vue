<template>
    <div id="bg">
        <div class="search">
            <img id="searchIcon" style="cursor: pointer;" width="30" height="30" :src="searchList[curSearch].imgUrl" @click="showSearch=true">
            <transition>
                <div class="select" v-if="showSearch">
                    <div class="triangle"></div>
                    <div class="search_select">
                        <div :class="curSearch==index?'active':''" v-for="(item, index) in searchList" :key="index">
                            <img class="search_img" width="28" height="28" :src="item.imgUrl" @click="setSearch(index)">
                        </div>
                    </div>
                </div>
            </transition>
            <input v-model="search" placeholder="输入关键字" @change="handleSearch">
        </div>
        
        <div class="content">
            <div class="item" :style="`width:${setting.column?setting.column:'20%'}`" v-for="(item, index) in appList" :key="index">
                <div v-if="item.type == 'url'" @click="openApp(item)">
                    <img v-if="item.imgUrl" class="app_icon" :style="iconStyle" :src="item.imgUrl">
                    <img v-else class="app_icon" :style="iconStyle" src="../../assets/pic.png">
                </div>
                <div v-else class="icon" :style="iconStyle" :class="item.icon" @click="openApp(item)"></div>
                <div class="title" :style="titleStyle">{{ item.appName }}</div>
            </div>
        </div>
        <div class="memo">
            <MemoView ref="memo"></MemoView>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, type Ref } from 'vue';
import MemoView from '@/components/memo/memoView.vue';
import { api_selectApp, api_selectSetting } from '@/api/setting';
import { useInfoStore } from '@/stores/info';
import type { Setting } from './type';
import { useRouter } from 'vue-router';
export default defineComponent({
    name: 'HomeView',
    setup() {
        const appList: Ref<any> = ref([
            {
                appName: '备忘录',
                icon: 'iconfont icon-beiwanglu',
                type: '备忘录'
            },
            {
                appName: '立体房间',
                icon: 'iconfont icon-beiwanglu',
                type: '立体房间'
            }
        ])
        const searchList: Ref<any> = ref([
            {
                appName: '',
                icon: '',
                type: ''
            }
        ])
        const setting: Ref<Setting> = ref({
            email: "",
            imgUrl: "",
            fontSize: null,
            fontColor: null,
            radius: null,
            size: null,
            column: null
        })
        const search: Ref<string> = ref('')
        const memo: Ref<any> = ref(null)
        const infoStores: any = useInfoStore()
        const curSearch: Ref<number> = ref(0)
        const showSearch: Ref<boolean> = ref(false)
        const router = useRouter()

        const iconStyle = computed(() => {
            return `border-radius: ${setting.value.radius?setting.value.radius:'5'}px;
            width:${setting.value.size?setting.value.size:'75'}px;height:${setting.value.size?setting.value.size:'75'}px;`
        })

        const titleStyle = computed(() => {
            return `font-size: ${setting.value.fontSize?setting.value.fontSize:'16'}px;
            color:${setting.value.fontColor?setting.value.fontColor:'unset'}`
        })

        function openApp(item: any) {
            switch(item.type) {
                case '备忘录':
                    memo.value.showDialog()
                    break
                case '立体房间':
                    router.push('/room')
                    break
                case 'url':
                    window.open(item.url, '_blank')
                    break
            }
        }
        function setSearch(index: number) {
            curSearch.value = index
            showSearch.value = false
        }
        function handleSearch(val: any) {
            if(!val.target.value) {
                return
            }
            window.open(searchList.value[curSearch.value].url + val.target.value, '_blank')
        }
        onMounted(() => {
            api_selectSetting({email: infoStores.info.email}).then((res: any) => {
                setting.value = res.message[0]
                const bg: any = document.getElementById('bg')?.style
                bg.backgroundImage = `url('${setting.value.imgUrl}')`
            })
            api_selectApp().then((res: any) => {
                appList.value = appList.value.concat(res.message.filter((item: any) => item.type=='url'))
                searchList.value = res.message.filter((item: any) => item.type=='search')
            })
            document.addEventListener("click", (e: any) => {
                if(e.target.id != 'searchIcon') {
                    showSearch.value = false
                }
            })
        })
        return {
            appList, search, memo, setting, curSearch, searchList, showSearch,
            iconStyle, titleStyle,
            openApp, setSearch, handleSearch
        }
    },
    components: {MemoView}
});
</script>
<style scoped>
#bg {
    background: #dfdfdf;
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}
.search {
    position: relative;
    margin-top: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.search input {
    padding: 10px;
    width: 350px;
    display: block;
    margin-left: 5px;
}
.select {
    position: absolute;
    top: 45px;
    margin-left: -375px;
}
.triangle {
    position: absolute;
    margin: -9px auto 0;
    margin-left: 20px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 10px solid #cfcfcf;
    z-index: 10;
}
.search_select {
    width: 50px;
    height: 100px;
    border-radius: 2px;
    background: #e9e9e9;
    overflow-y: scroll;
}
.search_select::-webkit-scrollbar {
    width: 0;
    background: transparent;
}
.search_img {
    cursor: pointer;
    padding: 5px 11px;
}
.search_img:hover {
    background: #cfcfcf;
}
.active {
    background: #cfcfcf;
}
.content {
    display: flex;
    flex-wrap: wrap;
    width: 60%;
    margin: 30px auto 20px;
}
.item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
}
.icon {
    background: #6b46c1;
    cursor: pointer;
    font-size: xx-large;
    color: #e9e9e9;
    display: flex;
    justify-content: center;
    align-items: center;
}
.app_icon {
    cursor: pointer;
}
.title {
    margin-top: 5px;
    font-weight: bolder;
    text-shadow: 0 0 5px #331677;
}
.icon:hover {
    filter: opacity(0.9);
}
</style>