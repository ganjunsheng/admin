<template>
    <div class="login">
        <div class="container">
            <img src="../assets/0001.jpg" alt="" class="avatar">
            <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="myicon myicon-user" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" prefix-icon="myicon myicon-key" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="login-btn" type="primary" @click="submitForm('loginForm')">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
// 解构
import { login } from '@/api/index.js'
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }

        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('登录成功')
          login(this.loginForm).then((res) => {
            console.log(res)
            if (res.meta.status === 200) {
              // this.$message({
              //   //   提示
              //   message: res.meta.msg,
              //   type: 'success'
              // })

              // 将当前用户名存储在localStorage中
              //  通过action来触发mutations中的函数，这种触发方式是异步方式
              this.$store.dispatch('setUserNameAction', res.data.username)
              // 获取token
              localStorage.setItem('mytoken', res.data.token)
              //   路由跳转
              this.$router.push({name: 'Home'})

              // getUserList({query: '', pagenum: 1, pagesize: 10}).then((result) => {
              //   console.log(result)
              // })
            } else {
              this.$message({
                //   提示
                message: res.meta.msg,
                type: 'error'
              })
            }
          })
        } else {
          console.log('登录失败')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;

  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
