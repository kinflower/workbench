<template>
  <div class="bg"></div>
  <div class="container">
    <h1 class="login_title">练习汇总平台</h1>
    <div class="form-group">
      <input class="email" type="email" v-model="formData.email" placeholder="请输入邮箱" autocomplete="off">
    </div>
    <div class="title" v-show="show.email">邮箱不能为空</div>
    <div class="form-group">
      <input class="password" type="password" placeholder="请输入密码" v-model="formData.password">
    </div>
    <div class="title" v-show="show.password">密码不能为空</div>
    <div class="form-group">
      <button types="default" class="login" @click="login">登录</button>
    </div>
    <div class="foot">
      <div class="back" @click="register">注册</div>
      <div class="back" @click="forgotPassword">忘记密码?</div>
    </div>
    <messageBox ref="messageBox"></messageBox>
  </div>
</template>

<script lang="ts">
import { api_login } from '@/api/login';
import { objIsNotNull, objIsNullName } from '@/assets/util';
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { FormData, Show } from './type';

export default defineComponent({
  name: 'LoginView',
  setup() {
    const formData: FormData = reactive({
      email: "",
      password: ""
    })
    const show: Show = reactive({
      email: false,
      password: false
    })
    const messageBox: any = ref(null)
    const router = useRouter();

    const login = async () => { // 账号登录
      resetShow()
      if (objIsNotNull(formData)) {
        objIsNullName(formData).forEach(item => show[item] = true)
        messageBox.value.open('必填项不能为空', 'warn')
        return
      }
      formData.password = btoa('pass' + btoa(formData.password) + 'word').split('').reverse().join('')
      api_login(formData).then((res: any) => {
        localStorage.setItem('token', res.token)
        localStorage.setItem('email', formData.email)
        router.replace('/')
        setTimeout(() => {
          window.location.reload()
        }, 200)
      }).catch(err => {
        messageBox.value.open(err, 'error')
        formData.password = ''
      })
    };

    const register = () => {
      router.push('/register');
    };

    const forgotPassword = () => {
      router.push('/forgot');
    };

    function resetShow() { // 隐藏提示
      show.email = false
      show.password = false
    }

    return {
      formData,
      show,
      messageBox,
      login,
      register,
      forgotPassword
    };
  },
});
</script>

<style scoped>
.bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('../../assets/bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(1px);
  z-index: 0;
}

.email,
.password,
.login {
  width: 100%;
}

.code {
  width: 180px;
}

.back {
  color: #6b46c1;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}

.title {
  font-size: 10px;
  font-weight: normal;
  color: red;
  margin-top: -12px;
  margin-bottom: 10px;
}

.foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.container {
  background-color: #f0e6ff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  margin: 150px auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

input {
  padding: 5px;
  border-radius: 4px;
  outline: none;
  border: 1px solid #fff;
  transition-duration: 500ms;
}

input:focus {
  border: 1px solid #6b46c1;
  transition-duration: 500ms;
}
</style>
