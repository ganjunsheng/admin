<template>
    <div class="user">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 面包屑导航 -->
        <!-- 搜索框 -->
        <div style="margin: 15px 0;">
            <!-- 实现搜索功能 -->
            <el-input placeholder="请输入内容" v-model="serachKey" class="input-with-select" style="width:250px" @keyup.native.enter='searchUserList'>
                <el-button slot="append" icon="el-icon-search" @click='searchUserList'></el-button>
            </el-input>
            <!-- 按钮 -->
            <el-button type="success" plain @click='adddialogFormVisible = true'>添加用户</el-button>
        </div>
        <!-- 搜索框 -->
        <!-- 表格 -->
        <template>
            <el-table :data="userList" border style="width: 100%">
                <el-table-column type="index" width="50">
                </el-table-column>
                <el-table-column prop="username" label="姓名" width="180">
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="180">
                </el-table-column>
                <el-table-column prop="mobile" label="电话">
                </el-table-column>

                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <!-- 开关 -->
                        <!-- @change='changeUserState(scope.row)修改用户状态 -->
                        <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change='changeUserState(scope.row)'>
                        </el-switch>
                        <!-- 开关 -->
                    </template>
                </el-table-column>
                <!-- 编辑按钮 -->
                <!-- 将来我们点击这个按钮，不仅仅需要让用户看到按钮，而且还要能够获取这个按钮所在行的数据，那么template就能够实现这个愿望。它里面有一个属性slot-scope，这个属性的值scop.row就是我们需要的这一行所对应的数据 -->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip content="编辑" placement="top">
                            <!-- 绑定编辑事件 -->
                            <el-button type="primary" icon="el-icon-edit" plain @click='showEditDialog(scope.row)'></el-button>
                        </el-tooltip>
                        <el-tooltip content="授权角色" placement="top">
                            <!-- 授权角色事件 -->
                            <el-button type="primary" icon="el-icon-share" plain @click='showGrantDialog(scope.row)'></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top">
                            <!-- 绑定删除功能 -->
                            <el-button type="primary" icon="el-icon-delete" plain @click='deleteUser(scope.row.id)'></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <!-- 编辑按钮 -->
            </el-table>
        </template>
        <!-- 分页 -->
        <el-pagination style='margin-top:15px' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[1, 2, 3, 4]" :page-size="1" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 分页 -->
        <!-- 添加用户弹出提示框 -->
        <el-dialog title="添加用户" :visible.sync="adddialogFormVisible">
            <el-form :model="addform" ref='addform' label-width="100px" :rules='rules'>
                <el-form-item label="用户名：" prop="username">
                    <el-input v-model="addform.username" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="password">
                    <el-input v-model="addform.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" prop="email">
                    <el-input v-model="addform.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话：" prop="mobile">
                    <el-input v-model="addform.mobile" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="adddialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUserSubmit('addform')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 添加用户弹出提示框 -->
        <!-- 编辑用户对话框 -->
        <el-dialog title="编辑用户" :visible.sync="editdialogFormVisible">
            <el-form :model="editform" ref='editform' label-width="100px" :rules='rules'>
                <el-form-item label="用户名：" prop="username">
                    <el-input v-model="editform.username" auto-complete="off" disabled=""></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" prop="email">
                    <el-input v-model="editform.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话：" prop="mobile">
                    <el-input v-model="editform.mobile" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editdialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserSubmit('editform')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑用户对话框 -->
        <!-- 授权角色用户框 -->
        <el-dialog title="授权角色" :visible.sync="grantdialogFormVisible">
            <el-form :model="grantform" ref='grantform' label-width="100px">
                <el-form-item label="用户名：">
                    <el-input v-model="grantform.username" auto-complete="off" disabled="" style='width:200px'></el-input>
                </el-form-item>
                <el-form-item label="角色：">
                    <template>
                        <!-- v-model:这可以自动的获取:value所绑定的数据，意味着rolevalue就是item.id -->
                        <el-select v-model="grantform.rid" placeholder="请选择">
                            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="grantdialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="grantUserSubmit">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 授权角色用户框 -->
    </div>
</template>

<script>
import {
  getUserList,
  addUser,
  editUser,
  deleteUserById,
  updateUserStateById,
  getAllRoleList,
  grantRoleById
} from '@/api/index'
export default {
  data () {
    return {
      roleList: [],
      userList: [],
      pagenum: 1,
      pagesize: 4,
      total: 0,
      serachKey: '',
      // 添加用户对话框可见属性
      adddialogFormVisible: false,
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editform: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 授权角色
      grantform: {
        id: '',
        rid: '',
        username: ''
      },
      grantdialogFormVisible: false,
      // 编辑用户对话框的可见属性
      editdialogFormVisible: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          // type: 'email':如果填写了内容，就必须满足邮箱的格式
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur,change'
          }
        ],
        mobile: [{ required: true, message: '电话不能为空' }]
      }
    }
  },

  mounted () {
    this.initList()
  },
  methods: {
    //   实现用户授权
    grantUserSubmit () {
      grantRoleById(this.grantform).then(res => {
        // console.log(res)
        if (res.meta.status === 200) {
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
        }
        this.grantdialogFormVisible = false
      })
    },
    //   显示授权角色对话框
    showGrantDialog (row) {
      // 弹出授权提示框
      this.grantdialogFormVisible = true
      // 填充默认数据
      this.grantform.id = row.id
      this.grantform.username = row.username
      // alert(row.id)

      // 加载角色用户列表数据
      getAllRoleList().then(res => {
        // alert(123)
        // console.log(res)
        this.roleList = res.data
      })
    },
    //   修改用户状态
    changeUserState (row) {
      console.log(row)
      updateUserStateById({ id: row.id, state: row.mg_state }).then(res => {
        if (res.meta.status === 200) {
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
          this.initList()
        } else {
          this.$message({
            message: res.meta.msg,
            type: 'error'
          })
        }
      })
    },
    //   删除功能
    deleteUser (id) {
      this.$confirm(
        `此操作将永久删除id号为${id}的数据, 是否继续?`,
        '删除提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          deleteUserById(id).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                message: res.meta.msg,
                type: 'success'
              })
              this.initList()
            } else {
              this.$message({
                message: res.meta.msg,
                type: 'error'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 弹出编辑用户对话框，同时填充默认数据
    showEditDialog (row) {
      console.log(row)
      this.editdialogFormVisible = true
      this.editform.id = row.id
      this.editform.username = row.username
      this.editform.email = row.email
      this.editform.mobile = row.mobile
    },
    // 实现编辑用户
    editUserSubmit (editform) {
      this.$refs[editform].validate(valid => {
        if (valid) {
          // 通过验证
          editUser(this.editform).then(res => {
            console.log(res + '==============')
            if (res.meta.status === 200) {
              this.$message({
                message: res.meta.msg,
                type: 'success'
              })
              this.editdialogFormVisible = false
              this.initList()
            }
          })
        } else {
          this.$message({
            message: '输入数据不合法',
            type: 'error'
          })
        }
      })
    },
    // 实现添加用户功能
    addUserSubmit (addform) {
      this.$refs[addform].validate(valid => {
        if (valid) {
          // 调用接口发送请求
          addUser(this.addform).then(res => {
            console.log(res)
            if (res.meta.status === 201) {
              this.$message({
                message: res.meta.msg,
                type: 'success'
              })
            }
            // 将对话框隐藏
            this.adddialogFormVisible = false
            // 重置表单元素的数据
            this.$refs[addform].resetFields()
            // 刷新页面显示
            this.initList()
          })
        } else {
          this.$message({
            message: '输入数据不合法',
            type: 'error'
          })
        }
      })
    },
    // 查询用户数据
    searchUserList () {
      this.initList()
    },
    // 获取动态数据
    initList () {
      getUserList({
        query: this.serachKey,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(res => {
        // console.log(res)
        this.userList = res.data.data.users
        this.total = res.data.data.total
      })
    },
    edituser (row) {
      console.log(row)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.initList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.initList()
    }
  }
}
</script>

<style lang="scss" scoped>
/* 覆盖element导航菜单的样式 */
.el-breadcrumb {
  background-color: #f5f5f5;
  height: 45px;
  font-size: 15px;
  padding-left: 10px;
  line-height: 45px;
  margin-bottom: 15px;
}
</style>
