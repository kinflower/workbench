<template>
  <keep-alive>
    <HeadView v-show="show"></HeadView>
  </keep-alive>
  <RouterView />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, type Ref } from 'vue'

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
    onBeforeMount(() => {
      checkLogin()
    })
    return {
      show, checkLogin
    }
  }
})
</script>