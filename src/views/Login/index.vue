<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">LOGO</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

      <div style="position:relative">
        <div class="tips">
          <span>Username : admin</span>
          <span>Password : any</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">Username : editor</span>
          <span>Password : any</span>
        </div>

        <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
          Or connect with
        </el-button>
      </div>
    </el-form>

    <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>

import { validatePass, validateEmail, validateVCode } from '@/utils/validate';
import { reactive, ref, isRef, toRefs, onMounted, watch, defineComponent } from '@vue/composition-api';

export default defineComponent({
  setup(props ,{root, refs}) {
    watch(() => {
      //will print when props.count1 changed
      let { query } =  root.$route
      if (query) {
          redirect.value = query.redirect
          otherQuery = getOtherQuery(query)
      }
    });
  
    const validateUsername = (rule, value, callback) => {
      if (validateEmail(value)) {
        callback(new Error('请输入正确邮箱错误'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (validatePass(value)) {
        callback(new Error('密码必须6位以上带字母'))
      } else {
        callback()
      }
    }
    const loginForm = reactive({
      username: 'admin',
      password: '111111a'
    })

    // 表单的验证
    const loginRules = reactive({
      username: [{ required: true, trigger: 'blur', validator: validateUsername }],
      password: [{ required: true, trigger: 'blur', validator: validatePassword }]
    });

    const passwordType = ref('password')

    const capsTooltip = ref(false)

    const loading = ref(false)

    const showDialog = ref(false)
    
    const redirect = ref(undefined)

    let otherQuery = {}


    // 外部调用方法
    const checkCapslock = (e) => {
      const { key } = e
      capsTooltip.value = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    }

    const showPwd = () => {
      if (passwordType.value === 'password') {
        passwordType.value = ''
      } else {
        passwordType.value = 'password'
      }
      root.$nextTick(() => {
        refs.password.focus()
      })
    }

    const handleLogin = (formName) => {

      refs.loginForm.validate((valid) => {
        if (valid) {
          loading.value = true

          root.$store.dispatch('user/login', loginForm)
          .then(() => {
            root.$router.push({ path: redirect.value || '/', query: otherQuery })
            loading.value = false
          })
          .catch(() => {
            loading.value = false
        })
          return
        }
        console.log('error submit!!')
        return false
      })

    }

    const getOtherQuery = (query) => {

      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }

    return {
      loginForm,
      loginRules,
      passwordType,
      capsTooltip,
      loading,
      showDialog,
      redirect,
      otherQuery,
      showPwd,
      checkCapslock,
      handleLogin,
    }
  }
})
</script>
<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {

  .el-input {
    width: 85%;
    height: 47px;

    display: inline-block;

    input {
      padding: 12px 5px 12px 15px;

      height: 47px;
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;

      color: $light_gray;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.1);
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;

  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;

    width: 520px;
    overflow: hidden;
  }

  .tips {
    margin-bottom: 10px;

    font-size: 14px;
    color: #fff;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    width: 30px;

    vertical-align: middle;
    display: inline-block;

    color: $dark_gray;
  }

  .title-container {
    position: relative;

    .title {
      margin: 0px auto 40px auto;

      font-size: 26px;
      color: $light_gray;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;

    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
