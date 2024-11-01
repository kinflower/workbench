<template>
  <div class="container">
    <h1 class="login_title">练习汇总平台</h1>
    <div class="form-group">
      <input class="email" type="email" v-model="formData.email" placeholder="请输入邮箱" autocomplete="off" @change="checkAccount">
    </div>
    <div class="title" v-show="show.email">邮箱不能为空</div>
    <div class="title" v-show="isRegister">当前账号已注册，可以直接登录</div>
    <div class="form-group">
      <input class="code" placeholder="请输入验证码" v-model="formData.code">
      <button types="default" class="sendCode" @click="sendCode" :disabled="!canSendCode">{{ timer ? `已发送${timer}s` : '发送验证码'
        }}</button>
    </div>
    <div class="title" v-show="show.code">验证码不能为空</div>
    <div class="form-group">
      <input class="password" type="password" placeholder="请输入密码" v-model="formData.password">
    </div>
    <div class="title" v-show="show.password">密码不能为空</div>
    <div class="form-group">
      <input class="password" type="password" placeholder="请再次输入密码" v-model="formData.tmp_password">
    </div>
    <div class="title" v-show="show.tmp_password">密码不能为空</div>
    <div class="form-group">
      <button types="default" class="register" @click="register">注册</button>
    </div>
    <div class="back" @click="back">已有账号，去登录</div>
    <messageBox ref="messageBox"></messageBox>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api_checkAccount, api_register, api_sendCode } from '@/api/login';
import { generateRandomNumber, objIsNotNull, objIsNullName, validateEmail } from '@/assets/util';

export default defineComponent({
  name: 'RegisterView',
  setup() {
    const formData = reactive({
      email: "",
      password: "",
      tmp_password: "",
      code: ""
    })
    const show: any = reactive({
      email: false,
      password: false,
      tmp_password: false,
      code: false
    })
    const canSendCode = ref(true);
    const timer = ref(0);
    const visible = ref(false)
    const messageBox: any = ref(null)
    const router = useRouter();
    const isRegister = ref(false)

    function register() {
      // console.log('注册', formData);
      if(isRegister.value) {
        messageBox.value.open('当前账号已注册，可以直接登录', 'warn')
        return
      }
      resetShow()
      if (objIsNotNull(formData)) {
        objIsNullName(formData).forEach(item => show[item]=true)
        messageBox.value.open('必填项不能为空', 'warn')
        return
      }
      if(formData.password != formData.tmp_password) {
        messageBox.value.open('两次密码输入不一致', 'warn')
      }
      formData.password = btoa('pass' + btoa(formData.password) + 'word').split('').reverse().join('')
      api_register(formData).then((res: any) => {
        localStorage.setItem('token', res.token)
        localStorage.setItem('email', formData.email)
        router.replace('/')
        setTimeout(() => {
          window.location.reload()
        }, 100)
      }).catch(err => {
        messageBox.value.open(err, 'error')
      })
    }

    function sendCode() {
      if(!validateEmail(formData.email)) {
        messageBox.value.open('邮箱验证有误', 'warn')
        return
      }
      canSendCode.value = false;
      timer.value = 60;
      const interval = setInterval(() => {
        timer.value--;
        if (timer.value <= 0) {
          clearInterval(interval);
          canSendCode.value = true;
        }
      }, 1000);
      var s = generateRandomNumber(14) + btoa(generateRandomNumber(6))
      api_sendCode({code: s, email: formData.email}).then(() => {
        messageBox.value.open('验证码发送成功', 'success')
      })
    }

    function resetShow() {
      show.email = false
      show.password = false
      show.tmp_password = false
      show.code = false
    }

    function checkAccount() {
      api_checkAccount({ email: formData.email }).then(() => {
        isRegister.value = false
      }).catch(() => {
        isRegister.value = true
      })
    }

    const back = () => {
      router.replace('/login')
    };

    return {
      formData, visible, messageBox, canSendCode, timer, show, isRegister,
      register, back, sendCode, resetShow, checkAccount
    };
  },
});
</script>

<style scoped>
.email,
.password,
.register {
  width: 100%;
}

.code {
  width: 180px;
}

.sendCode {
  width: 100px;
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
</style>