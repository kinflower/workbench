<template>
    <transition>
        <div v-if="show" :class="zoom?'memo_container_max':'memo_container'" id="memo">
            <div class="head">
                <div class="head_title">备忘录</div>
                <div class="tool_group">
                    <div v-if="type == 'list'" class="iconfont icon-shanchu" @click="batchRemove"></div>
                    <div v-if="type == 'list'" class="iconfont icon-add" @click="handleAdd"></div>
                    <div v-if="type == 'edit'" class="iconfont icon-baocun" @click="handleSave"></div>
                    <div v-if="type == 'edit'" class="iconfont icon-arrow-corner-left" @click="back"></div>
                    <div v-if="!zoom" class="iconfont icon-zuidahuajiantou" @click="setZoom"></div>
                    <div v-else class="iconfont icon-zuixiaohuajiantou" @click="setZoom"></div>
                    <div class="iconfont icon-close" @click="show = false"></div>
                </div>
            </div>
            <div v-if="type == 'list'">
                <div class="content">
                    <input class="search" type="text" v-model="keyword" placeholder="输入关键字">
                    <button types="default" @click="search">搜索</button>
                </div>
                <div class="box">
                    <div class="list_content" v-for="(item, index) in list" :key="index">
                        <input class="chose" type="checkbox" v-model="item.chose">
                        <div class="list" @click="handleEdit(item)">
                            <div class="list_foot">
                                <div>{{ item.title }}</div>
                                <div class="iconfont icon-sandian" @click.stop="item.showSelect = true"></div>
                            </div>
                            <transition>
                                <div v-if="item.showSelect" class="select">
                                    <div class="triangle"></div>
                                    <div @click.stop="handleRemove(item)">删除</div>
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="type == 'edit'">
                <div>
                    <input class="title_input" v-model="form.title" type="text" placeholder="输入标题">
                </div>
                <div class="tool_box">
                    <div class="iconfont icon-bold" @click="handleConfig('bold')"></div>
                    <div class="iconfont icon-italic" @click="handleConfig('italic')"></div>
                    <div class="iconfont icon-underline" @click="handleConfig('underline')"></div>
                    <div class="iconfont icon-font-color" @click="handleConfig('color')"></div>
                    <input class="color_select" type="color" id="selectColor" @change="getColor">
                    <div class="iconfont icon-heading-h1" @click="handleConfig('h1')"></div>
                    <div class="iconfont icon-heading-h2" @click="handleConfig('h2')"></div>
                    <div class="iconfont icon-heading-h3" @click="handleConfig('h3')"></div>
                    <div class="iconfont icon-heading-h4" @click="handleConfig('h4')"></div>
                    <div class="iconfont icon-heading-h5" @click="handleConfig('h5')"></div>
                    <div class="iconfont icon-heading-h6" @click="handleConfig('h6')"></div>
                    <div class="iconfont icon-text-align-left" @click="handleConfig('left')"></div>
                    <div class="iconfont icon-text-align-center" @click="handleConfig('center')"></div>
                    <div class="iconfont icon-text-align-right" @click="handleConfig('right')"></div>
                    <div class="iconfont icon-image" @click="handleConfig('image')"></div>
                    <input class="file_select" type="file" id="file_select" @change="getImage" accept="image/*">
                </div>
                <div id="text_content" :style="`height:${height}px`" contenteditable="true" spellcheck="false" @input="changeValue"></div>
            </div>
        </div>
    </transition>
    <imgView ref="imgView" :src="src"></imgView>
    <messageBox ref="messageBox"></messageBox>
    <dialogView ref="dialogView" @confirm="confirm"></dialogView>
</template>

<script lang="ts">
import { api_upload } from '@/api/login';
import { defineComponent, ref } from 'vue'
import imgView from '../imgView.vue';
import { api_insertMemo, api_removeMemo, api_searchMemo, api_selectMemo, api_updateMemo } from '@/api/memo';

export default defineComponent({
    name: 'memoView',
    setup() {
        const show = ref(false)
        const list: any = ref([])
        const type = ref('list')
        const editType = ref('add')
        const messageBox: any = ref(null)
        const dialogView: any = ref(null)
        const imgView: any = ref(null)
        const zoom = ref(false)
        const height = ref(0)
        const keyword = ref('')
        const form: any = ref({
            title: "",
            content: ""
        })
        const state: any = ref({
            'bold': false,
            'italic': false,
            'underline': false
        })
        const src = ref('')
        let tmp: any = {}
        function drag() {
            const draggable: any = document.getElementById('memo');
            let active = false;
            let currentX: any;
            let currentY: any;
            let initialX: any;
            let initialY: any;
            let xOffset = 0;
            let yOffset = 0;
            draggable.onmousedown = (e: any) => {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                if (e.target === draggable) {
                    active = true;
                }
            }
            document.onmousemove = (e: any) => {
                if (active) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    xOffset = currentX;
                    yOffset = currentY;
                    draggable.style.transform = "translate3d(" + currentX + "px, " + currentY + "px, 0)"
                }
            }
            document.onmouseup = () => {
                initialX = currentX;
                initialY = currentY;
                active = false;
            }
            document.onmouseleave = () => {
                initialX = currentX;
                initialY = currentY;
                active = false;
            }
        }
        function resetDrag() {
            document.onmousemove = () => {}
            document.onmouseup = () => {}
            document.onmouseleave = () => {}
        }
        function setZoom() {
            zoom.value = !zoom.value
            const draggable: any = document.getElementById('memo');
            if(zoom.value) {
                draggable.style.transform = 'none'
                draggable.onmousedown = () => {}
                resetDrag()
            }else {
                drag()
            }
            setTimeout(() => {
                height.value = draggable.offsetHeight - 100
            }, 10)
        }
        function showDialog() {
            show.value = true
            getList()
            setTimeout(() => {
                drag()
                const draggable: any = document.getElementById('memo');
                height.value = draggable.offsetHeight - 100
            }, 500)
        }
        function getList() {
            api_selectMemo().then((res: any) => {
                list.value = res.message.map((item: any) => {
                    item.content = JSON.parse(item.content)
                    return {
                        ...item,
                        showSelect: false,
                        chose: false
                    }
                })
            })
        }
        function handleAdd() {
            type.value = 'edit'
            editType.value = 'add'
            form.value.title = ''
            setTimeout(() => {
                const content: any = document.getElementById('text_content')
                content.innerHTML = ''
            }, 100)
        }
        function handleEdit(item: any) {
            form.value = item
            type.value = 'edit'
            editType.value = 'edit'
            setTimeout(() => {
                const content: any = document.getElementById('text_content')
                content.innerHTML = item.content
                const imgs = content.querySelectorAll("img")
                imgs.forEach((img: any) => {
                    img.onclick = (e: any) => {
                        src.value = e.target.src
                        imgView.value.show = true
                    }
                })
            }, 100)
        }
        function back() {
            type.value = 'list'
            getList()
        }
        function handleRemove(item: any) {
            dialogView.value.message = '是否删除所选项?'
            dialogView.value.isVisible = true
            dialogView.value.setData('remove')
            tmp = item
        }
        function changeValue() {
            // console.log(e)
        }
        function handleSave() {
            if(!form.value.title) {
                messageBox.value.open('标题不能为空', 'warn')
                return
            }
            const content = document.getElementById('text_content')?.innerHTML
            if(editType.value == 'add') {
                api_insertMemo({
                    title: form.value.title, 
                    content: JSON.stringify(content)
                }).then((res: any) => {
                    messageBox.value.open(res.message, 'success')
                })
            }else if(editType.value == 'edit') {
                api_updateMemo({
                    id: form.value.id,
                    title: form.value.title, 
                    content: JSON.stringify(content)
                }).then((res: any) => {
                    messageBox.value.open(res.message, 'success')
                })
            }
        }
        function handleConfig(flag: string) {
            state.value[flag] = !state.value[flag]
            const selection: any = window.getSelection();
            const range = selection.getRangeAt(0);
            // console.log(range.endContainer.parentNode.nodeName, range.endContainer.nodeName)
            if(flag == 'image') {
                document.getElementById('file_select')?.click()
                tmp = document.createElement('img')
                tmp.onclick = (e: any) => {
                    src.value = e.target.src
                    imgView.value.show = true
                }
                tmp.style.width = '100px'
                tmp.style.height = '60px'
                range.insertNode(tmp);
                return
            }
            if(['h1','h2','h3','h4','h5','h6'].includes(flag)) {
                const h: any = document.createElement(flag);
                h.innerText = range.toString()
                range.extractContents();
                range.insertNode(h);
                return
            }
            const span: any = document.createElement('span');
            span.innerText = range.toString()
            tmp = span
            switch (flag) {
                case 'bold':
                    span.style.fontWeight = state.value[flag]?'bolder':'normal'
                    break
                case 'italic':
                    span.style.fontStyle = state.value[flag]?'italic':'normal'
                    break
                case 'underline':
                    span.style.textDecoration = state.value[flag]?'underline':'none'
                    break
                case 'color':
                    document.getElementById('selectColor')?.click()
                    break
                case 'left':
                    span.style.display = 'block'
                    span.style.textAlign = 'left'
                    break
                case 'center':
                    span.style.display = 'block'
                    span.style.textAlign = 'center'
                    break
                case 'right':
                    span.style.display = 'block'
                    span.style.textAlign = 'right'
                    break
            }
            range.extractContents();
            range.insertNode(span);
        }
        function getColor(e: any) {
            tmp.style.color = e.target.value
        }
        function getImage(e: any) {
            const formData = new FormData()
            formData.append('image', e.target.files[0])
            api_upload(formData).then((res: any) => {
                tmp.src = res.file
            })
        }
        function batchRemove() {
            if(list.value.filter((item: any) => item.chose).length == 0) {
                messageBox.value.open('请选择任意一项', 'warn')
                return
            }
            dialogView.value.message = '是否删除所选项?'
            dialogView.value.isVisible = true
            dialogView.value.setData('batch')
        }
        function confirm(flag: string) {
            if(flag == 'batch') {
                api_removeMemo(list.value.filter((item: any) => item.chose).map((item: any) => item.id)).then(() => {
                    messageBox.value.open('删除成功', 'success')
                    getList()
                })
            }else if(flag == 'remove') {
                api_removeMemo([tmp.id]).then(() => {
                    messageBox.value.open('删除成功', 'success')
                    getList()
                })
            }
        }
        function search() {
            api_searchMemo({title: keyword.value}).then((res: any) => {
                list.value = res.message
            })
        }
        return {
            show, list, type, src, form, messageBox, editType, imgView, dialogView, zoom,
            height, keyword,
            drag, showDialog, handleAdd, handleEdit, back, handleRemove, changeValue,
            handleSave, handleConfig, getColor, getImage, batchRemove, confirm, setZoom,
            search
        }
    },
    components: {imgView},
    created() {
        document.addEventListener("click", (e: any) => {
            if (!e.target.className.includes('icon-sandian')) {
                if(this.list.length) {
                    this.list.forEach((item: any) => item.showSelect = false)
                }
            }
        })
    }
})
</script>

<style scoped>
@import url('./memoView.css');
</style>