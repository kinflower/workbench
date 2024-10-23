<template>
  <keep-alive>
    <HeadView v-show="show"></HeadView>
  </keep-alive>
  <RouterView />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup () {
    const show = ref(true)
    return {
      show
    }
  },
  created() {
    const token = localStorage.getItem('token')
    if(token) {
      this.show = true
    }else {
      this.show = false
    }
  }
})
</script>