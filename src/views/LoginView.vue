<template>
  <div class="LoginView">
    <div class="login-warp" style="border-radius: 10px">
      <el-row type="flex" justify="center" v-loading="isload">
      <el-form v-loading="isload" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="auto">
        <h2 style="height: 25px">登录</h2>
        <hr>
        <el-form-item prop="account" label="用户名" style="margin-left:10px">
          <el-input v-model="ruleForm.account" autocomplete="on" style="width: 90%" ></el-input>
        </el-form-item>
        <el-form-item prop="password" style="margin-left:10px" label="密码" >
          <el-input type="password" v-model="ruleForm.password" autocomplete="off" style="width: 90%" >
          </el-input>
        </el-form-item>

        <el-form-item >
          <span style="float: left;width: 20px">&ensp;</span>
          <el-checkbox style="float: left;" v-model="rememberMe">记住我</el-checkbox>
          <span style="float: left;width: 20px">&ensp;</span>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <span style="float: left;width: 20px">&ensp;</span>
          <el-button type="primary" @click="this.$router.push('/register')">注册</el-button>
          <span style="float: left;width: 20px">&ensp;</span>
          <el-button type="primary" @click="this.$router.push('/forget')">忘记密码</el-button>
        </el-form-item>
        <!--          <el-form-item style="margin-top: 15px">-->
        <!--            <p></p>-->
        <!--            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>-->
        <!--            <el-button type="primary" @click="this.$router.push('/register')">注册</el-button>-->
        <!--          </el-form-item>-->
      </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import { loginAPI } from '@/api/login'
import Cookies from 'js-cookie'
import storage, {sessionStorage} from '@/utils/storage'
import store from '@/store'
import {defineComponent} from "vue";
export default defineComponent({
  name: 'LoginView',
  data () {
    return {
      isload: false,
      rememberMe: false,
      ruleForm: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { require: true, trigger: 'blur' }
        ],
        password: [
          { require: true, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const account = {
            name: this.ruleForm.account,
            password: this.ruleForm.password
          }
          this.isload = true
          loginAPI(account).then(
              (res) => {
                console.log(res.data.data)
                let data = res.data
                if (data.success) {
                  this.$message.success('登录成功')
                  //根据store中set_token方法将token保存至localStorage/sessionStorage中，data["Authentication-Token"]，获取token的value值
                  //this.$store.commit('set_token', data.data['token'])
                  //storage.set("token", data.data['token'])
                  //console.log(storage.get("token"))
                  if (this.rememberMe) {
                    Cookies.set('name', this.ruleForm.account, 3)
                    Cookies.set('password', this.ruleForm.password, 3)
                  }else {
                    Cookies.set('name', null, -1)
                    Cookies.set('password', null, -1)
                  }
                  sessionStorage.set("profile", data.data)
                  this.$router.push({path: '/home'})
                }else {
                  this.$message.error("用户名或密码错误")
                }
                this.isload = false
              }
          ).catch(
              (error) => {
                this.$message.error("用户名或密码错误")
                // console.log(error)
                this.isload = false
              }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted: function () {
    document.title = '登录'
    let name = Cookies.get('name')
    let password = Cookies.get('password')
    if (name != null && password != null) {
      this.rememberMe = true
      this.ruleForm.account = name
      this.ruleForm.password = password
    }
    // this.getCookie();
  }
})
</script>
<style scoped>

.LoginView{
  width: 100%;
  height: 100vh;
  background: url("../assets/login_back.png");
  background-size: cover;
  overflow: hidden;
  top: 0;
  left: 0;
}
.login-warp{
  background-size: cover;
  width: 400px;
  height: 250px;
  margin-top: 30vh;
  margin-inline: auto;
  overflow: hidden;
  padding-top: 10px;
  line-height: 40px;
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
