<template>
  <keep-alive>
    <HeadView v-show="show"></HeadView>
  </keep-alive>
  <div>
    <div class="wood"></div>
    <div class="line"></div>
    <canvas id="canvas_view"></canvas>
  </div>
  <RouterView />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref, type Ref } from 'vue'
import * as live2d from "live2d-render"
export default defineComponent({
  setup() {
    const show: Ref<boolean> = ref(true)
    function checkLogin() {
      const token = localStorage.getItem('token')
      if (token) {
        show.value = true
      } else {
        show.value = false
      }
    }
    const config: any = {
        BackgroundRGBA: [0.0, 0.0, 0.0, 0.0],
        ResourcesPath: "/model/naxidaqwq.model3.json",
        CanvasId: 'canvas_view',
        CanvasSize: {
          height: 150,
          width: 150,
        },
        ShowToolBox: false,
        LoadFromCache: true
      }
    async function init() {
      await live2d.initializeLive2D(config)
    }

    onBeforeMount(() => {
      checkLogin()
    })
    onMounted(() => {
      init()
    })
    return {
      show, checkLogin
    }
  }
})
</script>
<style>
.wood {
  -webkit-app-region: drag;
  background-color: #814c05;
  width: 115px;
  height: 15px;
  position: absolute;
  right: 0;
  bottom: 144px;
  margin: auto;
  z-index: 0;
  z-index: 99;
}

.line {
  border-left: 1px solid #87e6b9;
  border-right: 1px solid #87e6b9;
  border-bottom: 4px solid #87e6b9;
  height: 120px;
  width: 100px;
  position: absolute;
  right: 5px;
  bottom: 20px;
  margin: auto;
  z-index: 99;
}
#canvas_view {
  position: fixed;
  right: 0;
  bottom: 0;
  margin-bottom: -10px;
  margin-right: -20px;
  z-index: 100;
}
</style>