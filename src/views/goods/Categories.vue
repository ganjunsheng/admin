<template>
    <div class="categories">
        <!-- 面包屑导航栏 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 面包屑导航栏 -->
        <!-- 按钮 -->
        <div>
            <el-button type="success" round @click="showAddRoleDialog">添加分类</el-button>
        </div>
        <!-- 按钮 -->
        <!--  -->
        <tree-grid :treeStructure="true" :columns="columns" :data-source="dataSource" @deleteCate="deleteCategory" @editCate="editCategory">
        </tree-grid>
        <!--  -->
        <el-dialog title="添加商品分类" :visible.sync="adddialogFormVisible">
            <el-form :model="addform" label-width='100px'>
                <el-form-item label="分类名称">
                    <el-input v-model="addform.cat_name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="父级名称">
                    <el-cascader :options="categoreList" v-model="selectedOptions" @change="handleChange" :props='cascaderProps'>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="adddialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCategorySubmit">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 外部组件  -->
    </div>
</template>

<script>
import { getCategories, addCategory } from '@/api/index.js'
// 引入外部组件
import TreeGrid from '@/components/TreeGrid/TreeGrid.vue'
export default {
  data () {
    return {
      adddialogFormVisible: false,
      dataSource: [],
      addform: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      columns: [
        {
          text: '分类名称',
          dataIndex: 'cat_name',
          width: ''
        },
        {
          text: '是否有效',
          dataIndex: 'cat_deleted',
          width: ''
        },
        {
          text: '排序',
          dataIndex: 'cat_level',
          width: ''
        }
      ],
      categoreList: [],
      selectedOptions: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  mounted () {
    this.initList()
  },
  methods: {
    // 数据初始化
    initList () {
      getCategories(3).then((result) => {
        console.log(result)
        //   赋值在页面上显示结构
        this.dataSource = result.data
      })
    },
    //   当级联选择发生变化的时候触发
    handleChange () {},
    // 实现商品分类的添加
    addCategorySubmit () {
      // alert(123)
      if (this.selectedOptions.length === 0) {
        this.addform.cat_level = 0
        this.addform.cat_pid = 0
      } else if (this.selectedOptions.length === 1) {
        this.addform.cat_level = 1
        this.addform.cat_pid = this.selectedOptions[0]
      } else {
        this.addform.cat_level = 2
        this.addform.cat_pid = this.selectedOptions[1]
      }
      // console.log(this.addform)
      // 调用接口，发送数据请求
      addCategory(this.addform).then((result) => {
        // console.log(result)
        if (result.meta.status === 201) {
          this.$message({
            type: 'success',
            message: result.meta.msg
          })
          this.adddialogFormVisible = false
          this.initList()
          getCategories(2).then(res => {
            this.dataSource = res.data
          })
        } else {
          this.$message({
            type: 'error',
            message: result.meta.msg
          })
        }
      })
    },
    // 点击事件
    showAddRoleDialog () {
      // 显示弹框
      this.adddialogFormVisible = true
      //
      getCategories(2).then((result) => {
        this.categoreList = result.data
      })
    },
    deleteCategory () {},
    editCategory () {}
  },
  // 通过components属性可以来注入你想使用的组件
  components: {
    'tree-grid': TreeGrid
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
