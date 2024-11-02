import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'

export const useInfoStore = defineStore('info', () => {
  const info: Ref<object> = ref({})
  const state: Ref<boolean> = ref(false)
  const getInfo = computed(() => info.value)
  function setInfo(value: object) {
    info.value = value
  }

  return { info, state, getInfo, setInfo }
})
