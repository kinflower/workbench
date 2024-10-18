<template>
    <div>
        xxx
        <button @click="exit">退出</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
    name: 'ForgotPassword',
    setup() {
        const router = useRouter();
        const exit = () => {
            localStorage.clear()
            router.replace('/login')
        }
        return {
            exit
        };
    },
});
</script>