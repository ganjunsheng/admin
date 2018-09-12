<template>
  <div class="home">
    <el-container>
      <el-aside width="auto">
        <div class="logo"></div>
        <!-- 首页导航栏 -->
        <el-menu :router='true' class="el-menu-admin" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :unique-opened='true' :collapse='iscollapse'>
            <!-- 动态生成，需要使用绑定，以及需要转换成字符串 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
              <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                <i class="el-icon-menu"></i>
                <span slot="title">{{subItem.authName}}</span>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header id='test'>
          <!-- @click='iscollapse = !iscollapse'  实现点击按钮切换功能 -->
          <span class="myicon myicon-menu toggle-btn" @click='iscollapse = !iscollapse'></span>
          <span class="system-title">电商后台管理系统</span>
          <div>
            <span class="welcome">你好：{{$store.state.username?$store.state.username:$store.getters.getUserName}}</span>

            <el-button type="text" @click='loginout'>退出</el-button>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getLeftMenu } from '@/api/index.js'
export default {
  data () {
    return {
      iscollapse: false,
      menuList: [],
      currentUserName: ''
    }
  },
  // 调用接口
  mounted () {
    getLeftMenu().then((result) => {
      this.menuList = result.data
    })
  },
  methods: {
    //   实现退出功能
    loginout () {
      // 清除之前存储的token
      localStorage.removeItem('mytoken')
      // 重定向
      this.$router.push({ name: 'Login' })
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height: 60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #f8f8f8;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292cf;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome {
    color: white;
  }
}
</style>
