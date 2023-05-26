
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
                         size="large;" @click="newChat($event) "
                         :disabled="disableNew"
              >
                <el-icon color="white">
                  <Plus />
                </el-icon>
                <span style="width: 10px"></span>
                新建会话
              </el-button>

            </el-row>
          </el-header>
          <el-main style="padding: 0px;" v-loading="entryListLoad">
            <el-row v-for="i in entries" class="entry-list-item-wrapper" type="flex" justify="center" align="middle">
              <el-button class="entry-list-item" color="#626aef" :dark="true"
                        @click="viewHistory(i.id, $event);this.grade=i.grade"
              >
              <el-row type="flex" justify="start" align="middle" style="width: 100%" gutter="10">
                  <el-col span="4">
                    <el-icon>
                      <ChatSquare/>
                    </el-icon>
                  </el-col>
                  <el-col span="16" v-if="i.brief.length > 25">
                    {{i.brief.slice(0, 25)}}...
                  </el-col>
                <el-col span="16" v-if="i.brief.length <= 25">
                  {{i.brief}}
                </el-col>
              </el-row>
              </el-button>
            </el-row>

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
                  <el-col :span="4" >
                    <el-button style="background-color: transparent;border: 0px" @click="openProfileBtn($event)">
                      <el-icon color="white" size="30px">
                        <Edit />
                      </el-icon >
                    </el-button>
                  </el-col>
                  <el-col :span="4" >
                    <el-button style="background-color: transparent;border: 0px" @click="Return">
                      <el-icon color="white" size="30px">
                        <SwitchButton />
                      </el-icon >
                    </el-button>
                  </el-col>
                </el-row>
              </el-card>
            </el-row>
          </el-footer>
        </el-container>
      </el-aside>
      <el-main class="main-block" v-loading="mainLoad">
        <div class="chat-block" type="flex" justify="center" ref="chatBlock">
          <el-row v-for="i in items" class="chat-list-item-wrapper" type="flex" justify="center" align="middle">
            <el-card  class="chat-list-item">
              <template #header>
                <div class="card-header">
                  <span style="border-color: transparent">
                    <el-icon>
                      <Cpu v-if="i.from=='ChatJ2E'"/>
                      <UserFilled v-if="i.from!='ChatJ2E'"/>
                    </el-icon>
                    <span>&nbsp;</span>
                    {{ i.from }}
                  </span>
                </div>
              </template>
              <div class="content">
                {{ i.content }}
              </div>
            </el-card>
          </el-row>
        </div>
        <el-row class="btn-block" type="flex" justify="center" align="middle">
          <span v-if="!disableInput" style="color: white">结束对话并评价&nbsp</span>
          <el-rate :disabled="disableInput" v-model="this.grade" @click="rateChat"/>
        </el-row>
        <el-row class="input-block" type="flex" justify="center" align="middle">
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules"
                     style="width: 70%"
                     @submit.native.prevent
            >
              <el-form-item prop="message" style="width: 100%">
                <el-input v-model="ruleForm.message" autocomplete="off"
                          style="width: 100%;background-color: transparent" placeholder="发送消息"
                          autosize
                          size="large"
                          :disabled="disableInput"
                          @keyup.enter.native="fetchAnswer()"
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
import {Plus, ChatDotRound, ChatSquare, Cpu, UserFilled, SwitchButton} from "@element-plus/icons";
import {sessionStorage} from "@/utils/storage";
import {loginAPI, updateUserAPI} from "@/api/login";
import Cookies from "js-cookie";
import {cancelChatAPI, fetchAnswerAPI, getChatEntryAPI, getChatItemAPI, retriveChatAPI} from "@/api/chat"; // @ is an alias to /src

export default defineComponent({
  name: 'HomeView',
  components: {
    SwitchButton,
    UserFilled,
    Cpu,
    ChatSquare,
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
      grade: 0,
      disableNew: false,
      disableInput: false,
      loading: false,
      profileLoad:false,
      noMore: false,
      disable_load: false,
      openProfile: false,
      mainLoad: false,
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
      },
      entryListLoad: false,
      entries: [],
      items: []

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
    myBlur(event) {
      let tar = event.target
      while (tar.nodeName !== "BUTTON") {
        tar = tar.parentNode
      }
      tar.blur()
    },
    newChat(event) {
      this.myBlur(event)
      this.items = []
      this.grade = 0
      this.disableInput = false
    },
    openProfileBtn(event) {
      this.myBlur(event)
      this.openProfile = true
    },
    viewHistory(id, event) {
      this.myBlur(event)
      this.mainLoad = true
      this.disableInput = true
      getChatItemAPI(id).then(
          (res) => {
            console.log(res)
            let data = res.data
            if (data.success) {
              this.items = res.data.data
            }else {
              this.$message.error(data.message)
            }
            this.mainLoad = false
          }
      ).catch(
          (error) => {
            this.$message.error(error.message)
            // console.log(error)
            this.mainLoad  = false
          }
      )
    },
    fetchAnswer() {
      let pack= {
        uId: this.profileForm.id,
        name: this.profileForm.name,
        msg: this.ruleForm.message
      }
      let item0= {
        from: this.profileForm.name,
        to: "AI",
        content: this.ruleForm.message,
      }
      this.items.push(item0)
      this.$refs.chatBlock.scrollTop = this.$refs.chatBlock.scrollHeight
      fetchAnswerAPI(pack).then(
          (res) => {

            let data = res.data
            if (data.success) {
              this.items.push(data.data)
              this.$nextTick(function(){
                this.$refs.chatBlock.scrollTop = this.$refs.chatBlock.scrollHeight

              })
            }else {
              this.$message.error(data.message)

            }
          }
      ).catch(
          (error) => {
            this.$message.error(error.message)
          }
      )
      this.ruleForm.message = ""
    },
    rateChat() {
      if (this.disableInput) return
      this.disableInput = true
      let jsonProfile = sessionStorage.get("profile")
      let pack = {
        uId: jsonProfile.id,
        grade: this.grade
      }

      cancelChatAPI(pack).then(
          (res) => {
            //console.log(res)
            let data = res.data
            if (data.success) {
              this.entries.unshift(data.data)
              this.disableNew = false
            }else {
              this.$message.error(data.message)
              this.disableInput = false
              this.grade = 0
            }
          }
      ).catch(
          (error) => {
            this.$message.error(error.message)
            this.disableInput = false
            this.grade = 0
          }
      )

    },
    Return() {
      this.$router.push("/login")
    }
  },
  mounted() {
    let jsonProfile = sessionStorage.get("profile")
    this.profileForm.name = jsonProfile.name
    this.profileForm.email = jsonProfile.email
    this.profileForm.gender = jsonProfile.gender
    this.entryListLoad = true
    this.disableInput = true
    getChatEntryAPI(jsonProfile.id).then(
        (res) => {
          console.log(res)
          let data = res.data
          if (data.success) {
            this.entries = res.data.data
          }else {
            this.$message.error(data.message)
          }
          this.entryListLoad = false
        }
    ).catch(
        (error) => {
          this.$message.error(error.message)
          // console.log(error)
          this.entryListLoad  = false
        }
    )
    if (Cookies.get("JSESSIONID") != null) {
      retriveChatAPI().then(
          (res) => {
            console.log(res)
            let data = res.data
            if (data.success) {
              //this.entries = res.data.data
              //this.entries.unshift(data.data)
              this.items = data.data.conversations
              this.disableInput = false
              this.disableNew = true
            }else {
              //this.$message.error(data.message)
            }
            this.entryListLoad = false
          }
      ).catch(
          (error) => {
            this.$message.error(error.message)
            // console.log(error)
            this.entryListLoad  = false
          }
      )
    }
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
.entry-list-item-wrapper {
  width: 100%;
  padding: 0;
  margin-bottom: 5px;
  list-style: none;
}
.entry-list-item {
  width: 100%;
  border-radius: 0px;
  background-color: transparent;
  padding: 0;
  margin: 0;
  font-size: medium;
  list-style: none;
}
/deep/.entry-list-item span {
  margin-left: 5%;
  width: 100%;
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
  border: 0px transparent;
}
.content {
  background-color: #4a4c5e;
  border-radius: 3px;
  margin-left: 10%;
  width: 80%;
  text-align: left;
  white-space: pre-line;
}
/deep/.el-card {
  --el-card-border-color:transparent !important;
}
/deep/.el-card__body {
  padding: 0px;
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
