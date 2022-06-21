<template>
  <div>
    <!-- 1. 面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 2. 卡片视图区域 -->
    <el-card>
      <!-- 消息提示区 -->
      <el-alert
        title="添加商品消息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        align-center
        :active="activeIndex - 0"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFromRules"
        ref="addFromRef"
        label-width="100px"
        label-position="top"
      >
        <!-- Tab标签页 -->
        <el-tabs
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
          tab-position="left"
          v-model="activeIndex"
        >
          <!-- 渲染基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!--  渲染表单参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox size="mini" :label="cb" border v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <!--  -->
              <el-input v-model="item.attr_vals">

              </el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 1.action图片要上传的地址 -->
            <el-upload
              :headers="headerObj"
              :action="uploadUrl"
              :on-success="handleSuccess"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture">
              <el-button size="small" type="primary" >点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce">
            </quill-editor>
            <el-button type="primary" class="btnAdd" @click="add" >添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <img :src="previewPath" alt=""  class="previewImg">
    </el-dialog>

  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {

      // 图片预览对话框展开
      previewVisible: false,
      // 图片预览url
      previewPath: '',
      // 图片上传组件的请求头对象
      headerObj: {
        Authorization:
        window.sessionStorage.getItem('token')
      },
      // 上传图片的url地址
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 商品静态属性参数渲染列表
      onlyTableData: [],
      // 商品动态参数渲染数据列表
      manyTableData: [],
      // 级联选择器props属性对象
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 商品分类列表数据
      cateList: [],
      // 表单数据校验规则对象
      addFromRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 添加商品表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属分类数组 级联选择器model属性值
        goods_cat: [],
        // 图片临时路径
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        attrs: []

      },
      // 标签也样式
      // tabPosition:'left',
      // 添加商品步骤条索引
      activeIndex: '0'
    }
  },

  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async add() {
      this.$refs.addFromRef.validate(valid => {
        if (!valid) return this.$message.error('请写入必要表单项')
      })
      // 执行添加操作
      const form = _.cloneDeep(this.addForm)
      form.goods_cat = form.goods_cat.join(',')
      // 处理动态参数和静态属性
      this.manyTableData.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_val: item.attr_vals.join(' ')
        }
        this.addForm.attrs.push(newInfo)
      })
      this.onlyTableData.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_val: item.attr_vals
        }
        this.addForm.attrs.push(newInfo)
      })
      form.attrs = this.addForm.attrs
      // 最终提交的是克隆的form数据 因为绑定的addForm中的attrs数据类型不能改变
      console.log('添加成功', form)

      // 发起网络请求
      const { data: res } = await this.$http.post('goods', form)
      if (res.meta.status !== 201) return this.$message.error('添加商品失败')
      this.$message.success('商品添加成功')
      this.$router.push('/goods')
    },

    // 监听图片上传成功事件
    handleSuccess(response) {
      console.log(response)
      // 拼接得到图片信息
      const picsInfo = {
        pic: response.data.tmp_path
      }
      // 将图片信息push发送到pics数组中
      this.addForm.pics.push(picsInfo)
      console.log(this.addForm.pics)
    },
    // 处理图片删除事件
    handleRemove(file) {
      // console.log(file);
      // 获取临时路径
      // console.log(this.addForm.pics);

      const filePath = file.response.data.tmp_path
      // 找到此路径在数组中的索引位置
      const i = this.addForm.pics.findIndex(x => { return x.pic === filePath })
      // 删除此索引位置的对象
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 处理图片预览事件
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 标签页点击商品参数/商品属性事件监听
    async tabClicked() {
      console.log(this.activeIndex)
      // 证明访问的是动态参数
      if (this.activeIndex === '1') {
        console.log('动态参数面板')
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
          { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error('获取动态参数失败')
        console.log(res.data)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0
            ? []
            : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        console.log('静态属性面板')
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
          { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error('获取动态参数失败')
        console.log(res.data)
        this.onlyTableData = res.data
      }
    },
    // 级联选择器变化监听 触发分页改变
    beforeTabLeave(activeName, oldActiveName) {
      // console.log(activeName,oldActiveName);
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品的分类')
        return false
      }
    },
    //  商品分类级联选择器改变
    handleChange() {
      // console.log(this.addForm.goods_cat);
      // 只能选中三级分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) { return this.$message.error('获取商品分类失败') }
      this.cateList = res.data
      // console.log(this.cateList);
    }
  }
}
</script>

<style scoped long="less">
.el-checkbox{
  margin:0 10px 0 0 !important ;
}
.previewImg{
  width: 100%;
}
.btnAdd{
  margin: 15px;
}
</style>
