<template>
  <div class="container">
    <h1>练习汇总平台</h1>
    <div class="form-group">
      <input class="email" type="email" v-model="formData.email" placeholder="请输入邮箱" autocomplete="off">
    </div>
    <div class="title" v-show="show.email">邮箱不能为空</div>
    <div class="form-group">
      <input class="password" type="password" placeholder="请输入密码" v-model="formData.password">
    </div>
    <div class="title" v-show="show.password">密码不能为空</div>
    <div class="form-group">
      <button class="login" @click="login">登录</button>
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

export default defineComponent({
  name: 'LoginView',
  setup() {
    const formData = reactive({
      email: "",
      password: ""
    })
    const show: any = reactive({
      email: false,
      password: false
    })
    const messageBox: any = ref(null)
    const router = useRouter();

    const login = async () => {
      // console.log('登录', formData);
      resetShow()
      if (objIsNotNull(formData)) {
        objIsNullName(formData).forEach(item => show[item]=true)
        messageBox.value.open('必填项不能为空', 'warn')
        return
      }
      api_login(formData).then((res: any) => {
        localStorage.setItem('token', res.token)
        router.replace('/')
      }).catch(err => {
        messageBox.value.open(err, 'error')
      })
    };

    const register = () => {
      router.push('/register');
    };

    const forgotPassword = () => {
      router.push('/forgot');
    };

    function resetShow() {
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
</style>
