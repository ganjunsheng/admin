<template>
    <div class="goodsAdd">
        <el-steps :active="activeName-0" finish-status="success">
            <el-step title="步骤 1"></el-step>
            <el-step title="步骤 2"></el-step>
            <el-step title="步骤 3"></el-step>
            <el-step title="步骤 4"></el-step>
            <el-step title="步骤 5"></el-step>
        </el-steps>
        <template>
            <el-form :model="addform" label-width='80px'>
                <el-tabs v-model="activeName" tab-position='left' style='margin-top:20px'>
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称">
                            <el-input auto-complete="off" v-model="addform.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格">
                            <el-input auto-complete="off" type="number" v-model="addform.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量">
                            <el-input auto-complete="off" type="number" v-model="addform.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量">
                            <el-input auto-complete="off" type="number" v-model="addform.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类">
                            <el-cascader :options="cateList" v-model="selectedOptions" :props='cateProps' @change='handleChange'>
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <div class="amap-wrapper">
                            <el-amap class="amap-box" :vid="'amap-vue'"></el-amap>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload class="upload-demo" action="http://localhost:8888/api/private/v1/upload" :headers='getToken()' :on-success='uploadDone' :before-upload='beforeUpload' :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addform.goods_introduce" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)" style='height:400px'>
                        </quill-editor>
                    </el-tab-pane>
                </el-tabs>
                <el-button type="success" class="addBtn" @click='addGoodsSubmit'>添加商品</el-button>
            </el-form>
        </template>
        <!-- 大图预览 -->
        <el-dialog title="提示" :visible.sync="previewdialogVisible" width="70%">
            <img :src="imgsrc" alt="">
        </el-dialog>
    </div>
</template>

<script>
import { getCategories, addGoods } from '@/api/index.js'
export default {
  data () {
    return {
      editorOption: {},
      previewdialogVisible: false,
      imgsrc: '',
      activeName: '',
      addform: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      cateList: [],
      selectedOptions: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      fileList: []
    }
  },
  mounted () {
    getCategories({ type: 3 }).then(res => {
      this.cateList = res.data
    })
  },
  methods: {
    //   添加商品
    addGoodsSubmit () {
      addGoods(this.addform).then(res => {
        console.log(res)

        if (res.meta.status === 201) {
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
        }
        this.$router.push({'path': 'list'})
      })
    },
    //   选择分类时触发函数
    handleChange (value) {
      this.addform.goods_cat = value.join(',')
      console.log(this.addform)
    },
    // 文件上传之前的处理函数
    // 参数为上传的文件
    beforeUpload (file) {
      console.log(file)
      if (file.size > 500 * 1024) {
        this.$message({
          type: 'warning',
          message: '文件大小必须在500KB内'
        })
        return false
      }
    },
    //   文件上传成功之后的钩子处理函数
    uploadDone (response, file, fileList) {
      this.addform.pics.push({ pic: response.data.tmp_path })
    },
    // 获取token
    getToken () {
      var token = localStorage.getItem('mytoken')
      return { Authorization: token }
    },
    // 当从上传组件移除上传文件的时候，会触发下面这个函数
    // file:当前被删除的文件
    // fileList：当前上传组件中剩余的文件
    // 就算beforeUpload中return了false,也会触发handleRemove这个函数
    // 先将这个图片加载到组件中，只不过发现上传操作取消了，所以会将组件中的图片移除
    handleRemove (file, fileList) {
      if (!file.response) {
        return
      }
      //   衔获取当前用户已经删除了的文件路径（相对路径 ）
      var delFile = file.response.data.tmp_path
      //  在this.addform.pics中查找这个文件名称对应的索引，将对应的元素删除
      var index = this.addform.pics.findIndex(value => {
        return value.pic === delFile
      })
      this.addform.pics.splice(index, 1)
    },
    // 实现图片的预览
    handlePreview (file) {
      // tmp_uploads/eb659f90df5bc6f176b6893919b05cc4.jpg
      this.imgsrc = 'http://localhost:8888/' + file.response.data.tmp_path
      this.previewdialogVisible = true
    },
    onEditorBlur (quill) {
      console.log('editor blur!', quill)
    },
    onEditorFocus (quill) {
      console.log('editor focus!', quill)
    },
    onEditorReady (quill) {
      console.log('editor ready!', quill)
    }
  }
}
</script>

<style scoped>
.addBtn {
  float: right;
  margin: 20px 0px;
}
.amap-wrapper {
  width: 500px;
  height: 500px;
}
</style>
