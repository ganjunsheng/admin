<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航栏 -->
    <!-- 按钮 -->
    <div style="margin-top:15px">
      <el-button type="success" plain @click="showAddRoleDialog">添加角色</el-button>
    </div>
    <!-- 按钮 -->
    <!-- 表格 -->
    <template>
      <el-table :data="rolelist" style="width: 100%" border>
        <el-table-column type="expand">
          <!-- 使用模板 -->
          <template slot-scope="scope">
            <el-row v-for='first in scope.row.children' :key='first.id' style="padding:5px 0;">
              <el-col :span='4'>
                <el-tag closable type="success" @close='deleterolesright(scope.row,first.id)'>
                  {{first.authName}}
                </el-tag>
              </el-col>
              <el-col :span='20'>
                <el-row v-for='second in first.children' :key='second.id' style='padding:2px'>
                  <el-col :span='4'>
                    <el-tag closable type="info" @close='deleterolesright(scope.row,second.id)'>
                      {{second.authName}}
                    </el-tag>
                  </el-col>
                  <el-col :span='20'>
                    <el-tag closable type="warning" v-for='third in second.children' :key='third.id' style='padding:0px 4px;margin:0px 3px' @close='deleterolesright(scope.row,third.id)'>
                      {{third.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row v-if='scope.row.children.length === 0'>
              <el-col>该角色没有任何的权限，请前往添加</el-col>
            </el-row>
          </template>

        </el-table-column>
        <!-- 序列号 -->
        <el-table-column type="index" width="50">
        </el-table-column>
        <!-- 序列号 -->
        <el-table-column label="角色名称" prop="roleName">
        </el-table-column>
        <el-table-column label="描述" prop="roleDesc">
        </el-table-column>
        <el-table-column label="操作" prop="desc">
          <!-- 编辑 -->
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button type="success" icon="el-icon-edit" plain></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" plain></el-button>
            </el-tooltip>
            <el-tooltip content="分配权限" placement="top">
              <!-- 通过点击事件触发tree树状图的显示 -->
              <el-button type="primary" icon="el-icon-share" plain @click="showGrantDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
          <!-- 编辑 -->
        </el-table-column>
      </el-table>
    </template>
    <!-- 表格 -->

    <!-- 授权对话框 -->
    <!-- dialog弹框 -->
    <el-dialog title="角色授权" :visible.sync="grantdialogTableVisible" :before-close="handleClose">
      <div style="height:400px;overflow:auto">
        <!-- tree图 -->
        <el-tree :data="rightList" show-checkbox node-key="id" ref='tree' :default-expand-all='true' :default-checked-keys="checkArr" :props="defaultProps">
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="grantdialogTableVisible = false">取 消</el-button>
        <!-- 点击确定按钮时候进行授权 -->
        <el-button type="primary" @click="grantRightSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 授权对话框 -->
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible">
      <el-form :model="addroleform" label-width='100px' :rules="rules" ref='addRoleForm'>
        <el-form-item label="角色名称" prop='roleName'>
          <el-input v-model="addroleform.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop='roleDesc'>
          <el-input v-model="addroleform.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色对话框 -->
  </div>
</template>

<script>
import {
  getAllRoleList,
  deleteroleright,
  getAllRightsList,
  grantroleright,
  addRole
} from '@/api/index.js'
export default {
  data () {
    return {
      rolelist: [],
      // 授权对话框数据
      rightList: [],
      checkArr: [],
      //   刚开始的时候，默认样tree图隐藏
      grantdialogTableVisible: false,
      // 默认是添加用户的框框是隐藏的
      addRoleDialogVisible: false,
      defaultProps: {
        children: 'children',
        // 这里原来是lable,需要换为authName才能显示数据
        label: 'authName'
      },
      addroleform: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [{}]
      }
    }
  },
  mounted () {
    this.initList()
  },
  methods: {
    //   角色的添加
    showAddRoleDialog () {
      // 显示弹框
      this.addRoleDialogVisible = true
    },
    // 通过点击确认按钮实现添加用户成功操作功能
    addRoleSubmit () {
      // 调用接口
      addRole(this.addroleform).then(result => {
        console.log(result)
        if (result.meta.status === 201) {
          this.$message({
            type: 'success',
            message: '添加角色成功'
          })
          // 刷新页面
          this.initList()
          // 隐藏框框
          this.addRoleDialogVisible = false
        } else {
          this.$message({
            type: 'warning',
            message: '失败'
          })
        }
      })
    },
    //   角色的添加
    // 角色授权提交
    grantRightSubmit () {
      console.log(this.$refs.tree.getCheckedKeys())
      //    1.获取了对象数组，我们需要的数据在每个对象的id和pid中
      var nodeArr = this.$refs.tree.getCheckedNodes()
      //   console.log(nodeArr)
      //   2  遍历数组，获取到每个对象的id和pid,拼接，并返回一个新的字符串存储在数组中
      var idArr = nodeArr.map(value => {
        return value.id + ',' + value.pid
      })
      //   console.log(idArr) // 得到的结果:["105,104,101", "116,104,101"]
      //   3.将数组的元素拆分以,连接,
      var strArr = idArr.join(',')
      //   console.log(strArr) // 得到的结果:105,104,101,116,104,101
      //   4  去除重复值：不能直接对字符串去除重复，所以我们要将这个字符串转换为数组，再对数组去除重复值
      var ridsArr = strArr.split(',')
      //   console.log(ridsArr)
      //   5 数组去重
      var tempSet = new Set(ridsArr)
      //   console.log(tempSet)
      //
      var final = Array.from(tempSet)
      console.log(final.join(','))
      // 这个就是接口中的参数
      var rids = final.join(',')
      //   调用接口，为角色授权
      grantroleright({ roleid: this.roleid, rids: rids }).then(result => {
        // console.log(result)
        if (result.meta.status === 200) {
          this.$message({
            message: result.meta.msg,
            type: 'success'
          })
          //   关闭框框
          this.grantdialogTableVisible = false
          // 刷新
          this.initList()
          //   清空
          this.$refs.tree.setCheckedKeys([])
        }
      })
    },
    // 显示授权对话框
    showGrantDialog (row) {
      //   console.log(row)
      //   显示对话框
      this.grantdialogTableVisible = true
      //   加载所有的数据
      getAllRightsList('tree').then(res => {
        // console.log(res)
        this.rightList = res.data
      })
      //   在这里得到的结果是:tree图出来了，但是没有数据,所以下一步需要把数据循环渲染在tree上面
      // 在将角色的id存储到data属性中
      this.roleid = row.id
      //   console.log(row)
      //   加载默认选项-----遍历当前角色的权限数组
      this.checkArr.length = 0
      if (row.children.length > 0) {
        row.children.forEach(first => {
          if (first.children.length > 0) {
            first.children.forEach(second => {
              if (second.children.length > 0) {
                second.children.forEach(third => {
                  this.checkArr.push(third.id)
                })
              }
            })
          }
        })
      }
    },

    // 加载角色列表
    initList () {
      getAllRoleList().then(res => {
        //   console.log(res)
        // 重新赋值
        this.rolelist = res.data
      })
    },
    //   删除指定角色的指定权限
    deleterolesright (row, rightid) {
      deleteroleright(row.id, rightid).then(res => {
        // console.log(res)
        // 通过状态值判断
        if (res.meta.status === 200) {
          // 给出提示
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
          //   刷新页面
          row.children = res.data
        } else {
          this.$message({
            message: res.meta.msg,
            type: 'error'
          })
        }
      })
    },

    //
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
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
