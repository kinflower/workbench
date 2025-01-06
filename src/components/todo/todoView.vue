<template>
    <div v-if="show" :class="zoom?'todo_container_max':'todo_container'" id="todo_con">
        <div class="title" id="todo">
            <div class="title_text">代办事项</div>
            <div class="tool_group">
                <el-dropdown>
                    <span class="menu">菜单</span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="todoCreate">新增</el-dropdown-item>
                            <el-dropdown-item @click="setHide">{{ hide ? '显示' : '隐藏' }}已完成</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <div v-if="!zoom" class="iconfont icon-zuidahuajiantou" @click="setZoom"></div>
                <div v-else class="iconfont icon-zuixiaohuajiantou" @click="setZoom"></div>
                <div class="iconfont icon-close" @click="show = false"></div>
            </div>
        </div>

        <div style="display: flex;">
            <el-input v-model="todoKeyword" size="small" style="width: 100%;margin-right: 10px;" placeholder="输入事项名称"
                clearable @change="todoSearch"></el-input>
            <el-select v-model="todoKeyType" size="small" placeholder="选择待办类型" clearable @change="todoSearch">
                <el-option label="工作方面" value="工作方面"></el-option>
                <el-option label="学习方面" value="学习方面"></el-option>
                <el-option label="生活方面" value="生活方面"></el-option>
            </el-select>
        </div>
        <el-scrollbar :height="height + 'px'" style="margin-top: 10px; padding-right: 10px;">
            <div v-for="(item, index) in todoList" :key="index">
                <div class="todo_item">
                    <el-checkbox v-model="item.state" @change="todoFinish(item)"><span class="grade">{{ item.grade
                            }}</span><span :style="setTime(item) ? '' : 'color:red;'">{{ item.title
                            }}</span></el-checkbox>
                    <el-popover placement="left" trigger="hover" width="200px">
                        <div>{{ item.detail ? item.detail : '未设置' }}</div>
                        <template #reference>
                            <el-icon>
                                <MoreFilled class="el-icon-more" color="#8d8d8d" @click="handleEditTodo(item)" />
                            </el-icon>
                        </template>
                    </el-popover>
                </div>
                <div class="line"></div>
            </div>
        </el-scrollbar>
        <el-drawer v-model="drawer" direction="ltr" size="100%" :title="edit ? '编辑' : '新增'">
            <el-form ref="todoForms" :model="todoForm" style="width: auto;margin: -20px 30px 0;">
                <el-form-item>
                    <el-date-picker v-model="todoForm.start" type="datetime" clearable placeholder="选择开始时间"
                        style="width: 100%;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="todoForm.end" type="datetime" clearable placeholder="选择结束时间"
                        style="width: 100%;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="todoForm.title" clearable placeholder="输入待办名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <div style="display: flex;width: 100%;">
                        <el-select v-model="todoForm.type" clearable placeholder="选择分区类型">
                            <el-option label="工作方面" value="工作方面"></el-option>
                            <el-option label="学习方面" value="学习方面"></el-option>
                            <el-option label="生活方面" value="生活方面"></el-option>
                        </el-select>
                        <el-select v-model="todoForm.grade" clearable placeholder="选择优先级">
                            <el-option label="Ⅰ级" value="Ⅰ级"></el-option>
                            <el-option label="Ⅱ级" value="Ⅱ级"></el-option>
                            <el-option label="Ⅲ级" value="Ⅲ级"></el-option>
                            <el-option label="Ⅳ级" value="Ⅳ级"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-input type="textarea" v-model="todoForm.detail" :autosize="{ minRows: 8, maxRows: 8 }"
                        placeholder="输入待办详情"></el-input>
                </el-form-item>
                <el-form-item>
                    <div style="text-align: right;width: 100%;">
                        <el-button type="primary" size="small" @click="todoSave">保存</el-button>
                        <el-button v-if="edit" type="danger" size="small" @click="todoRemove">删除</el-button>
                    </div>
                </el-form-item>
            </el-form>
            <div class="finish" v-show="todoForm.finish">完成时间：{{ todoForm.finish }}</div>
        </el-drawer>
    </div>
</template>



<script lang="ts">
import { defineComponent, type Ref } from 'vue'
import { MoreFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { computed, reactive, ref } from "vue";
import dayjs from "dayjs";
import { api_deletetodo, api_inserttodo, api_searchtodo, api_selectalltodo, api_updatetodo } from "@/api/todo";
import { drag, resetDrag, type TodoForm } from './type';
export default defineComponent({
    name: "TodoView",
    setup() {
        const drawer = ref(false)
        const edit = ref(false)
        const hide = ref(false)
        const todoForm: TodoForm = reactive({
            id: '',
            title: '',
            state: false,
            detail: '',
            type: '',
            start: '',
            end: '',
            finish: '',
            grade: ''
        })
        const todoList: Ref<any> = ref([])
        const todoKeyword = ref("")
        const todoKeyType = ref("")
        const height = ref(0)
        const show = ref(false)
        const zoom = ref(false)

        const setTime = computed(() => {
            return function (val: TodoForm) {
                if (!val.end) return true
                if (val.state) return true
                return parseInt(dayjs(val.end).format('DD')) >= parseInt(dayjs().format('DD'))
            }
        })
        function handleEditTodo(item: TodoForm) {
            todoForm.detail = item.detail
            todoForm.end = item.end
            todoForm.finish = item.finish
            todoForm.grade = item.grade
            todoForm.start = item.start
            todoForm.state = item.state
            todoForm.title = item.title
            todoForm.type = item.type
            todoForm.id = item.id
            edit.value = true
            drawer.value = true
        }
        function getTodoList() {
            api_selectalltodo().then((res: any) => {
                let finList: Array<object> = []
                let unfinList: Array<object> = []
                res.msg.forEach((item: TodoForm) => {
                    item.state = item.state === 0 ? false : true
                    if (item.state) {
                        finList.push(item)
                    } else {
                        unfinList.push(item)
                    }
                })
                if (hide.value) {
                    todoList.value = unfinList
                } else {
                    todoList.value = [...unfinList, ...finList]
                }
            }).catch((err) => ElMessage.error(JSON.stringify(err)))
        }
        function todoCreate() {
            todoForm.detail = ""
            todoForm.end = ""
            todoForm.finish = ""
            todoForm.grade = ""
            todoForm.start = ""
            todoForm.state = false
            todoForm.title = ""
            todoForm.type = ""
            todoForm.id = ""
            edit.value = false
            drawer.value = true
        }
        function todoSave() {
            if (!edit.value) {
                api_inserttodo(todoForm).then(() => {
                    ElMessage({
                        type: 'success',
                        message: '保存成功!',
                        showClose: true
                    });
                }).catch(() => ElMessage.error('提交失败'))
            } else {
                api_updatetodo(todoForm).then(() => {
                    ElMessage({
                        type: 'success',
                        message: '保存成功!',
                        showClose: true
                    });
                }).catch(() => ElMessage.error('提交失败'))
            }
            getTodoList()
            drawer.value = false
        }
        function todoRemove() {
            api_deletetodo({ id: todoForm.id }).then(() => {
                ElMessage({
                    type: 'success',
                    message: '删除成功!',
                    showClose: true
                });
                getTodoList()
                drawer.value = false
            }).catch(() => ElMessage.error('删除失败'))
        }
        function todoFinish(item: TodoForm) {
            item.finish = item.state ? dayjs().format('YYYY-MM-DD HH:mm:ss') : ''
            api_updatetodo(item).then(() => {
                ElMessage({
                    type: 'success',
                    message: item.state ? '事件已完成!' : '已取消',
                    showClose: true
                });
                getTodoList()
            }).catch(() => ElMessage.error('提交失败'))
        }
        function todoSearch() {
            hide.value = false
            if (!todoKeyword.value && !todoKeyType.value) {
                getTodoList()
            } else {
                api_searchtodo({ todoKeyword: todoKeyword.value, todoKeyType: todoKeyType.value }).then((res: any) => {
                    let finList: Array<object> = []
                    let unfinList: Array<object> = []
                    res.msg.forEach((item: TodoForm) => {
                        item.state = item.state === 0 ? false : true
                        if (item.state) {
                            finList.push(item)
                        } else {
                            unfinList.push(item)
                        }
                    })
                    todoList.value = [...unfinList, ...finList]
                }).catch((err) => ElMessage.error(JSON.stringify(err)))
            }
        }
        function setHide() {
            hide.value = !hide.value
            getTodoList()
        }
        function showDialog() {
            show.value = true
            getTodoList()
            setTimeout(() => {
                drag()
                const draggable: any = document.getElementById('todo_con');
                height.value = draggable.offsetHeight - 100
            }, 500)
        }
        function setZoom() { // 设置窗口大小
            zoom.value = !zoom.value
            const draggable: any = document.getElementById('todo_con');
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
        return {
            drawer, edit, hide, todoForm, todoList, todoKeyword, todoKeyType,
            height, setTime, show, zoom,
            handleEditTodo, getTodoList, todoCreate, todoSave, todoRemove, todoFinish,
            todoSearch, setHide, showDialog, setZoom
        };
    },
    components: {MoreFilled}
})
</script>

<style scoped>
.todo_container {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    width: 400px;
    height: 550px;
    z-index: 5;
    background: #fff;
    margin: auto;
    border-radius: 5px;
    padding: 0 10px 10px;
}

.todo_container_max {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    background: #fff;
    margin: auto;
    padding: 10px;
    box-shadow: 0 0 5px #aaa;
}

.title {
    display: flex;
    justify-content: space-between;
    margin: 5px;
    align-items: center;
}

.title_text {
    color: #6b46c1;
    font-size: 14px;
}

.el_icon {
    padding: 4px 5px;
    color: #6b46c1;
    transition-duration: 500ms;
}

.el_icon:hover {
    cursor: pointer;
    background: #e6e6e6;
    transition-duration: 500ms;
}

.url_table {
    width: 100%;
}

.name {
    text-decoration: none;
    font-weight: bold;
    color: rgb(43, 128, 226);
}

.menu {
    color: #6b46c1;
}

.menu:hover,
.menu:focus {
    outline: none;
    cursor: pointer;
}

.item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
    width: 25%;
    cursor: pointer;
}

.title {
    color: #666666;
    font-weight: bold;
    font-size: 16px;
    margin-top: 5px;
}

.lnk {
    display: flex;
    flex-wrap: wrap;
}

.icon {
    width: 80px;
    height: 80px;
    color: #ffffff;
    text-shadow: 2px 1px 2px rgb(138, 120, 120);
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
}

.key_search {
    display: block;
    width: 250px;
    margin: 20px auto 100px;
}

.header {
    position: absolute;
    top: 15px;
    right: 15px;
    text-align: right;
    z-index: 1;
}

.study {
    text-decoration: none;
    text-align: right;
    color: #8d8d8d;
}

.todo_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.grade {
    font-size: 12px;
    color: #8d8d8d;
    margin: 0 5px 0 -5px;
}

.el-icon-more,
.el-icon-edit {
    cursor: pointer;
}

.line {
    border-bottom: 1px solid #d8d8d8;
    margin: 5px 0;
}

.finish {
    position: absolute;
    right: 10px;
    bottom: 5px;
    font-size: 14px;
    color: #8d8d8d;
}

.tool_group {
    display: flex;
    align-items: center;
}

.iconfont {
    margin-left: 8px;
    cursor: pointer;
}
.icon-close {
    font-size: 14px;
    font-weight: bolder;
}
</style>