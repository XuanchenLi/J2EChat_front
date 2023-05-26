<template>
  <div class="register">
    <div class="register-warp" style="border-radius: 10px">
      <el-row type="flex" justify="center" v-loading="isload">
        <el-form :model="ruleForm" label-width="auto" status-icon ref="ruleForm" >
          <h2>注册</h2>
          <hr>
          <el-form-item prop="username" :rules="rules.username">
            <template v-slot:label>
              <span style="color:red">*</span>
              <span>账号</span>
            </template>
            <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="password" :rules="rules.password">
            <template v-slot:label>
              <span style="color:red">*</span>
              <span>密码</span>
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
          <el-form-item prop="email"  :rules="rules.email">
            <template v-slot:label>
              <span style="color:red">*</span>
              <span>邮箱</span>
            </template>
            <el-input v-model="ruleForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <template v-slot:label>
              <span style="color:red">*</span>
              <span>性别</span>
            </template>
            <el-radio-group v-model="ruleForm.gender" >
              <el-radio label="男" size="large">男</el-radio>
              <el-radio label="女" size="large">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-button type="primary" @click="register('ruleForm')">注册</el-button>
        </el-form>
      </el-row>
      <router-link to="/login"
                   style="color: cornflowerblue;
                   float: right; margin-right: 20px"
      >
        返回登录
      </router-link>
    </div>
  </div>
</template>

<script>
import { registerAPI } from '@/api/login'
import storage from '@/utils/storage'

export default {
  name: 'RegisterView',
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
        gender: '男'
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
    register (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isload = true
          const account = {
            name: this.ruleForm.username,
            password: this.ruleForm.password,
            email: this.ruleForm.email,
            gender: this.ruleForm.gender
          }

          registerAPI(account).then(
              (res) => {
                let data = res.data
                if (data.success) {
                  this.$message.success('注册成功')
                  this.$router.push('/login')
                }else {
                  this.$message.error(data.message)
                }
                this.isload = false
              }
          ).catch(
              (error) => {
                this.isload = false
                this.$message.error(error.message)
                // console.log(error)
                return false
              }
          )
        } else {
          console.log('格式错误！')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted: function () {
    document.title = '注册'
  }
}
</script>

<style scoped>
.register{
  width: 100%;
  height: 100vh;
  background: url("../assets/login_back.png");
  background-size: cover;
  overflow: hidden;
  top: 0;
  left: 0;
}
.register-warp{
  background-size: cover;
  width: 400px;
  height: 45vh;
  margin-inline: auto;
  margin-top: 20vh;
  overflow: hidden;
  padding-top: 10px;
  line-height: 40px;
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
