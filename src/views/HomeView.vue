
<template>
  <div class="home">
<!--    <img alt="Vue logo" src="../assets/logo.png">-->
<!--    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>-->

    <el-container class="container">
      <el-aside class="side-bar">
        <el-container style="height: 100vh; padding: 0px">
          <el-header  style="padding: 1px">
            <el-row type="flex" justify="center" align="middle" style="height: 100%;">
              <el-button color="#626aef" style="width: 90%;height:80%;color: white;font-size: large"
                         size="large;" @click="newChat($event) ">
                <el-icon color="white">
                  <Plus />
                </el-icon>
                <span style="width: 10px"></span>
                新建会话
              </el-button>

            </el-row>
          </el-header>
          <el-main style="padding: 0px;">
            <div class="infinite-list-wrapper" style="overflow: auto">
              <ul
                  v-infinite-scroll="load"
                  class="list"
                  :infinite-scroll-disabled="disable_load"
              >
                <el-row v-for="i in count" :key="i" type="flex" justify="center" align="middle" >
                  <el-button class="list-item" color="#626aef" :dark="true">{{ i }}</el-button>
                </el-row>
              </ul>
              <p v-if="loading" style="color: white">Loading...</p>
              <p v-if="noMore" style="color: white"> No more</p>
            </div>
          </el-main>
          <el-footer style="padding: 0px">
            <el-row type="flex" justify="center" align="middle" style="height: 100%;">
              <el-card class="profile-card" :body-style="{padding: '0px'}" type="flex">
                <el-row style="height: 60px;justify-content:center;align-items:center; color: white;" align="middle" type=“flex” >
                  <el-col span="4"></el-col>
                  <el-col :span="4" style="" >
                    <el-icon color="white" size="30px">
                      <User />
                    </el-icon>

                  </el-col >
                  <el-col :span="8" style="text-align: left;font-size: 18px">
                    Profile
                  </el-col>
                  <el-col :span="8" >
                    <el-button style="background-color: transparent;border: 0px" @click="openProfileBtn($event)">
                      <el-icon color="white" size="30px">
                        <Edit />
                      </el-icon >
                    </el-button>
                  </el-col>
                </el-row>
              </el-card>
            </el-row>
          </el-footer>
        </el-container>
      </el-aside>
      <el-main class="main-block">
        <el-row class="chat-block" type="flex" justify="center" align="middle">
          <el-row v-for="i in count" class="chat-list-item-wrapper" type="flex" justify="center" align="middle">
            <el-card  class="chat-list-item">
              <template #header>
                <div class="card-header">
                  <span style="border-color: transparent">Card name</span>
                </div>
              </template>
              {{ i }}
            </el-card>
          </el-row>
        </el-row>
        <el-row class="btn-block" type="flex" justify="center" align="middle">
          <el-button size="large" color="#626aef">
            结束对话并评价
            <span>&nbsp</span>
            <el-icon>
              <Star></Star>
            </el-icon>
          </el-button>
        </el-row>
        <el-row class="input-block" type="flex" justify="center" align="middle">
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules" style="width: 70%">
              <el-form-item prop="message" style="width: 100%">
                <el-input v-model="ruleForm.message" autocomplete="off"
                          style="width: 100%;background-color: transparent" placeholder="发送消息"
                          autosize
                          size="large"

                >
                  <template #suffix>
                    <el-icon class="el-input__icon" size="large"><ChatDotRound /></el-icon>
                  </template>

                </el-input>

              </el-form-item>
            </el-form>
        </el-row>

      </el-main>
    </el-container>
    <el-dialog v-model="openProfile" title="个人资料"
               class="profile-window" align-center

    >
      <el-row type="flex" justify="center" v-loading="profileLoad">
        <el-form label-width="auto" :model="profileForm"  ref="profileForm" style="width: 70%">
          <el-form-item prop="name">
            <template v-slot:label>
              <span>用户名</span>
            </template>
            <el-input style="color: white"  v-model="profileForm.name" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item prop="email"  :rules="profileRules.email">
            <template v-slot:label>
              <span>邮箱</span>
            </template>
            <el-input style="color: white" v-model="profileForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <template v-slot:label>
              <span>性别</span>
            </template>
            <el-radio-group v-model="profileForm.gender" >
              <el-radio label="男" size="large" style="color: white">男</el-radio>
              <el-radio label="女" size="large" style="color: white">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-button type="primary" @click="submitForm('profileForm')">保存</el-button>
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>

<script >
import { defineComponent } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue';
import {Plus, ChatDotRound} from "@element-plus/icons";
import {sessionStorage} from "@/utils/storage";
import {loginAPI, updateUserAPI} from "@/api/login";
import Cookies from "js-cookie"; // @ is an alias to /src

export default defineComponent({
  name: 'HomeView',
  components: {
    ChatDotRound,
    Plus,
    HelloWorld,
  },
  data() {
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else {
        const reg = /^[A-Za-z\d_-]+@[a-zA-Z\d_-]+(\.[a-zA-Z\d_-]+)+$/

        if (!reg.test(this.profileForm.email)) {
          callback(new Error('格式错误'))
        }
      }
      callback()
    }
    return {
      count: 10,
      loading: false,
      profileLoad:false,
      noMore: false,
      disable_load: false,
      openProfile: false,
      ruleForm: {
        message: ''
      },
      rules: {
        account: [
          { require: true}
        ]
      },
      profileForm: {
        name: '',
        email: '',
        gender: ''
      },
      profileRules: {
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
            name: this.profileForm.name,
            email: this.profileForm.email,
            gender: this.profileForm.gender
          }
          this.profileLoad = true
          updateUserAPI(account).then(
              (res) => {
                console.log(res.data.data)
                let data = res.data
                if (data.success) {
                  this.$message.success('保存成功')
                  let nP = data.data
                  this.profileForm.email = nP.email
                  this.profileForm.gender = nP.gender
                  sessionStorage.set("profile", nP)
                }else {
                  let nP = sessionStorage.get("profile")
                  this.profileForm.email = nP.email
                  this.profileForm.gender = nP.gender
                  this.$message.error(data.message)
                }
                this.profileLoad = false
              }
          ).catch(
              (error) => {
                this.$message.error(error.message)
                // console.log(error)
                this.profileLoad = false
              }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    load() {
      this.count+=2
      if (this.count >20) {
        this.noMore = true
        this.disable_load = this.loading || this.noMore
      }
    },
    myBlur(event) {
      let tar = event.target
      while (tar.nodeName !== "BUTTON") {
        tar = tar.parentNode
      }
      tar.blur()
    },
    newChat(event) {
      this.myBlur(event)
    },
    openProfileBtn(event) {
      this.myBlur(event)
      this.openProfile = true
    }
  },
  mounted() {
    let jsonProfile = sessionStorage.get("profile")
    this.profileForm.name = jsonProfile.name
    this.profileForm.email = jsonProfile.email
    this.profileForm.gender = jsonProfile.gender
  }
});
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
}
.side-bar{
  width: 18vw;
  background-color: #202123;
}
.main-block {
  background-color: #343541;
  padding: 0px;
}
.profile-card {
  background-color: #141417;
  width: 100%;
  border: 0px;
  height: 100%;
  padding: 0px;
}
.chat-block {
  height: 75vh;
  overflow: auto;
}
.btn-block {
  height: 10vh;
}
.input-block {
  height: 15vh;
  background-color: #1b202d;
}
.infinite-list-wrapper {
  height: 100%;
  text-align: center;
}
.infinite-list-wrapper .list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list-wrapper .list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 100%;
  background: transparent;
  color:white;
}
.infinite-list-wrapper .list-item + .list-item {
  margin-top: 10px;
}
/*.chat-list {*/
/*  padding: 0;*/
/*  margin: 0;*/
/*  list-style: none;*/
/*}*/
.chat-list-item-wrapper {
  align-items: center;
  justify-content: center;
  width: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border:0px;
  background-color: transparent;
  padding: 0px;
  height: 10px;
}
.chat-list-item {
  color: white;
  width: 100%;
  border-radius: 0px;
  background-color: transparent;
  border-color: transparent;
  border: 0px;
}
/deep/.el-card {
  --el-card-border-color:transparent !important;
}
/deep/.el-input__wrapper{
  background-color: transparent !important;
  border: 1px solid #1296db;
  color: white;
}
.el-input /deep/ .el-input__inner {
  color: #f5f5f7;
}

/deep/.el-dialog {
  background-color: #141414 !important;
  color: white;
}
/deep/.el-dialog__body {
  color: white;
}
/deep/.el-dialog__header {
  color: white;
}
/deep/.el-dialog__title {
  color: #e8e1e1;
}
/deep/ .el-form-item__label {
  color: white;
}
</style>
