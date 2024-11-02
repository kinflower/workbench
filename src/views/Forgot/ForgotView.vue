<template>
  <div class="container">
    <h1 class="login_title">练习汇总平台</h1>
    <div class="form-group">
      <input class="email" type="email" v-model="formData.email" placeholder="请输入邮箱" autocomplete="off">
    </div>
    <div class="title" v-show="show.email">邮箱不能为空</div>
    <div class="form-group">
      <input class="code" placeholder="请输入验证码" v-model="formData.code">
      <button types="default" class="sendCode" @click="sendCode" :disabled="!canSendCode">{{ timer ? `已发送${timer}s` : '发送验证码'
        }}</button>
    </div>
    <div class="title" v-show="show.code">验证码不能为空</div>
    <div class="form-group">
      <input class="password" type="password" placeholder="请输入新密码" v-model="formData.password">
    </div>
    <div class="title" v-show="show.password">密码不能为空</div>
    <div class="form-group">
      <button types="default" class="register" @click="forgotPassword">确认</button>
    </div>
    <div class="back" @click="back">返回</div>
    <messageBox ref="messageBox"></messageBox>
  </div>
</template>

<script lang="ts">
import { api_changePassword, api_sendCode } from '@/api/login';
import { generateRandomNumber, objIsNotNull, objIsNullName, validateEmail } from '@/assets/util';
import { defineComponent, reactive, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import type { FormData, Show } from './type';

export default defineComponent({
  name: 'ForgotPassword',
  setup() {
    const formData: FormData = reactive({
      email: "",
      password: "",
      code: ""
    })
    const show: Show = reactive({
      email: false,
      password: false,
      code: false
    })
    const canSendCode: Ref<boolean> = ref(true);
    const timer: Ref<number> = ref(0);
    const messageBox: Ref<any> = ref(null)
    const router = useRouter();

    function sendCode() { // 发送验证码
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

    const forgotPassword = () => { // 确认修改
      resetShow()
      if (objIsNotNull(formData)) {
        objIsNullName(formData).forEach(item => show[item]=true)
        messageBox.value.open('必填项不能为空', 'warn')
        return
      }
      formData.password = btoa('pass' + btoa(formData.password) + 'word').split('').reverse().join('')
      api_changePassword(formData).then(() => {
        router.replace('/login')
      }).catch(err => {
        messageBox.value.open(err, 'error')
      })
    };

    function resetShow() { // 隐藏提示
      show.email = false
      show.password = false
      show.code = false
    }

    const back = () => {
      router.back()
    };

    return {
      formData, show, canSendCode, timer, messageBox,
      sendCode, forgotPassword, back,
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
