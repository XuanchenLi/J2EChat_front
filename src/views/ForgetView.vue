<template>
<div id="main">
  <div id="forget-wrap" style="border-radius: 10px">
    <el-row type="flex" justify="center" v-loading="isload">
  <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="auto" >
    <h2 style="height: 25px">重置密码</h2>
    <hr>
    <el-form-item prop="username" :rules="rules.username">
      <template v-slot:label>
        <span style="color:red">*</span>
        <span>账号</span>
      </template>
      <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item prop="email"  :rules="rules.email">
      <template v-slot:label>
        <span style="color:red">*</span>
        <span>个人邮箱</span>
      </template>
      <el-input v-model="ruleForm.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item prop="password" :rules="rules.password">
      <template v-slot:label>
        <span style="color:red">*</span>
        <span>新密码</span>
      </template>
      <el-input v-model="ruleForm.password" autocomplete="off"
                placeholder="8-20位且包含字符和数字"
                type="password">
      </el-input>
    </el-form-item>
    <el-form-item prop="password2" :rules="rules.password2">
      <template v-slot:label>
        <span style="color:red">*</span>
        <span>重复密码</span>
      </template>
      <el-input v-model="ruleForm.password2" type="password" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item >
      <span style="float: left;width: 15%">&ensp;</span>
      <el-button type="primary" @click="this.$router.push('/login')">返回登陆</el-button>
      <span style="float: left;width: 20%">&ensp;</span>
      <el-button type="primary" @click="submitForm('ruleForm')">重置</el-button>
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
import {forgetAPI, loginAPI} from "@/api/login";
import storage from "@/utils/storage";
import Cookies from 'js-cookie'


export default {
  name: "ForgetView",
  data () {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'))
      } else {
        if (this.ruleForm.username.trim() === '') {
          callback(new Error('非法格式'))
        }
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (this.ruleForm.password !== '') {
        const reg = /^(?!\d+$)(?![a-zA-Z]+$)(?![@$!%*#?&.()]+$)[\dA-Za-z@$!%*#?&￥{}|^~: ;\-=+/\\.()]{8,20}$/
        if (!reg.test(this.ruleForm.password)) {
          callback(new Error('密码为6-20位，且同时包含数字和字符'))
        }
        // if ( this.ruleForm.password2 !== '') {
        //   this.$refs.ruleForm.validateField('password2')
        // }
        this.$refs.ruleForm.validateField('password2', () => null)
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请重复输入密码'))
      } else if (this.ruleForm.password2 !== this.ruleForm.password) {
        callback(new Error('两次密码不一致'))
      }
      callback()

    }
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else {
        const reg = /^[A-Za-z\d_-]+@[a-zA-Z\d_-]+(\.[a-zA-Z\d_-]+)+$/
        if (!reg.test(this.ruleForm.email)) {
          callback(new Error('格式错误'))
        }
      }
      callback()
    }
    return {
      ruleForm: {
        username: '',
        password: '',
        password2: '',
        email: '',
      },
      isload: false,
      rules: {
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        password2: [
          { validator: validatePassword2, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const account = {
            name: this.ruleForm.username,
            password: this.ruleForm.password,
            email: this.ruleForm.email
          }
          this.isload = true
          forgetAPI(account).then(
              (res) => {
                let data = res.data
                if (data.success) {
                  this.$message.success('重置密码成功')
                  //根据store中set_token方法将token保存至localStorage/sessionStorage中，data["Authentication-Token"]，获取token的value值
                  //this.$store.commit('set_token', data.data['token'])
                  //storage.set("token", data.data['token'])
                  this.$router.push({path: '/login'})
                  Cookies.set('name', "", -1);
                  Cookies.set('password', "", -1);
                }else {
                  this.$message.error(data.message)
                }
                this.isload = false
              }
          ).catch(
              (error) => {
                this.$message.error(error.message)
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
  }
}
</script>

<style scoped>
#main{
  width: 100%;
  height: 100vh;
  background: url("../assets/login_back.png");
  background-size: cover;
  overflow: hidden;
  top: 0;
  left: 0;
}
#forget-wrap{
  background-size: cover;
  width: 400px;
  height: 40vh;
  margin-inline: auto;
  margin-top: 20vh;
  overflow: hidden;
  padding-top: 10px;
  line-height: 40px;
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
