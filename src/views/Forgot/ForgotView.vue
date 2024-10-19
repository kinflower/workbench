<template>
  <div class="container">
    <h1>练习汇总平台</h1>
    <div class="form-group">
      <input class="email" type="email" v-model="formData.email" placeholder="请输入邮箱" autocomplete="off">
    </div>
    <div class="title" v-show="show.email">邮箱不能为空</div>
    <div class="form-group">
      <input class="code" placeholder="请输入验证码" v-model="formData.code">
      <button class="sendCode" @click="sendCode" :disabled="!canSendCode">{{ timer ? `已发送${timer}s` : '发送验证码'
        }}</button>
    </div>
    <div class="title" v-show="show.code">验证码不能为空</div>
    <div class="form-group">
      <input class="password" type="password" placeholder="请输入新密码" v-model="formData.password">
    </div>
    <div class="title" v-show="show.password">密码不能为空</div>
    <div class="form-group">
      <button class="register" @click="forgotPassword">确认</button>
    </div>
    <div class="back" @click="back">返回</div>
    <messageBox ref="messageBox"></messageBox>
  </div>
</template>

<script lang="ts">
import { api_changePassword, api_sendCode } from '@/api/login';
import { generateRandomNumber, objIsNotNull, objIsNullName, validateEmail } from '@/assets/util';
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'ForgotPassword',
  setup() {
    const formData = reactive({
      email: "",
      password: "",
      code: ""
    })
    const show: any = reactive({
      email: false,
      password: false,
      code: false
    })
    const canSendCode = ref(true);
    const timer = ref(0);
    const messageBox: any = ref(null)
    const router = useRouter();

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

    const forgotPassword = () => {
      // console.log('忘记密码', formData);
      resetShow()
      if (objIsNotNull(formData)) {
        objIsNullName(formData).forEach(item => show[item]=true)
        messageBox.value.open('必填项不能为空', 'warn')
        return
      }
      api_changePassword(formData).then(() => {
        router.replace('/login')
      }).catch(err => {
        messageBox.value.open(err, 'error')
      })
    };

    function resetShow() {
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
