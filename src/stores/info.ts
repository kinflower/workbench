import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useInfoStore = defineStore('info', () => {
  const info = ref({})
  const getInfo = computed(() => info.value)
  function setInfo(value: object) {
    info.value = value
  }

  return { info, getInfo, setInfo }
})
