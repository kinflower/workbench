<template>
  <keep-alive>
    <HeadView v-show="show"></HeadView>
  </keep-alive>
  <RouterView />
  <messageBox ref="messageBox"></messageBox>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, type Ref } from 'vue'

export default defineComponent({
  setup() {
    const show: Ref<boolean> = ref(true)
      const messageBox: Ref<any> = ref(null)
    function checkLogin() {
      const token = localStorage.getItem('token')
        if (token) {
          show.value = true
        } else {
          show.value = false
        }
    }
    onBeforeMount(() => {
      checkLogin()
    })
    return {
      show, checkLogin, messageBox
    }
  }
})
</script>