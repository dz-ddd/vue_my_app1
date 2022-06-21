<template>
  <div>
    <!-- 1. 面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 2.卡片视图区 -->
    <el-card class="box-card">
      <!-- 卡片顶部警告 -->
      <el-alert
        show-icon
        title="注意：只允许设置第三级商品参数!"
        :closable="false"
        type="warning"
      ></el-alert>

      <!-- 选中商品分类区域  -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cascaderCateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab 页签区 -->
      <el-tabs v-model="activeName" @tab-click="handTableClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
            <el-button :disabled="isBtnDisable"
                type="primary" size="mini"
                @click="showAddParamsDialog">
                添加参数
            </el-button>

            <!-- 动态参数表格 -->
            <el-table :data="manyData" border stripe>
                <!-- 展开行 -->
                <el-table-column type="expand" prop="">
                    <template slot-scope="scope">
                        <el-tag closable @close="handleClose(i,scope.row)" :key="i" v-for="(item,i) in scope.row.attr_vals">
                            {{item}}
                        </el-tag>

                        <!-- 添加内容 -->
                        <el-input
                            class="input-new-tag"
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row) "
                            >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" :disabled="isBtnDisable" size="mini"
                @click="showAddParamsDialog">
                添加属性
            </el-button>

            <!-- 静态属性表格 -->
            <el-table :data="onlyData" border stripe>
                <!-- 展开行 -->
                <el-table-column type="expand" prop="">
                    <template slot-scope="scope">
                        <el-tag closable @close="handleClose(i,scope.row)" :key="i" v-for="(item,i) in scope.row.attr_vals">
                            {{item}}
                        </el-tag>

                        <!-- 添加内容 -->
                        <el-input
                            class="input-new-tag"
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row) "
                            >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit"  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加按钮对话框 -->
    <el-dialog
        @close='addDialogClosed'
        :title='"添加"+titleText'
        :visible.sync="addParamsDialogVisible"
        width="50%">
        <!-- 添加参数输入 -->
        <el-form :model="addParamsForm"
            :rules="addParamsRuleForm"
            ref="addParamsFormRef"
            label-width="100px">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="addParamsForm.attr_name"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="addParamsDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 编辑按钮对话框 -->
    <el-dialog
        @close='editDialogClosed'
        :title='"编辑"+titleText'
        :visible.sync="editParamsDialogVisible"
        width="50%">
        <!-- 添加参数输入 -->
        <el-form :model="editParamsForm"
            :rules="editParamsRuleForm"
            ref="editParamsFormRef"
            label-width="100px">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="editParamsForm.attr_name"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="editParamsDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {

      // 文本框输入内容
      // inputValue:'',
      // 控制按钮与文本框切换显示
      // inputVisible:false,
      // 修改参数校验规则对象
      editParamsRuleForm: {
        attr_name: [
          { required: true, message: '请输入动态参数', trigger: 'blur' }
        ]
      },
      // 表单对象
      editParamsForm: {
        attr_name: ''
      },
      // 编辑对话框弹出
      editParamsDialogVisible: false,
      // 添加参数校验规则对象
      addParamsRuleForm: {
        attr_name: [
          { required: true, message: '请输入动态参数', trigger: 'blur' }
        ]
      },
      // 添加表单对象
      addParamsForm: {
        attr_name: ''
      },
      // 添加按钮对话框开关
      addParamsDialogVisible: false,
      // 保存静态属性数据
      onlyData: [],
      // 保存动态参数数据
      manyData: [],
      // tab 页面绑定数组
      // 被激活的活动页面名称
      activeName: 'many',
      // 选中的分类的id数组
      selectedCateKeys: [],
      // 商品分类数据列表
      cateList: [],
      // 级联选择器Props属性的值
      cascaderCateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }
    }
  },

  computed: {
    // 添加参数属性按钮是否禁用计算属性
    isBtnDisable() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 添加对话框展示文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },

  created() {
    // 页面加载获取数据
    this.getCateList()
  },

  methods: {
    // 将对attr_vals处理的操作保存到数据库
    async saveAttrVals(row) {
      // 发起请求保存此次数据操作
      const { data: res } = await this.$http.put(`categories/${this.cateId}
            /attributes/${row.attr_id}`,
      {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join('')
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('参数操作失败')
      this.$message.success('参数操作成功')
      row.inputValue = ''
      row.inputVisible = false
    },
    // 展示出输入文本框
    showInput(row) {
      // console.log(row);
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick方法作用 当页面上元素被重新渲染后才会执行指定回调函数
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 文本框事件监听
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return则需要后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    //   标签点击删除参数可选项
    async handleClose(index, row) {
      console.log(index)
      // 从第几项开始删除,删除几个
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    },

    //   删除按钮事件监听
    async removeParams(id) {
      // 删除分类
      // 询问是否删除
      const confirmResout = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      // 1.用户点击确定删除则confirmResout返回confirm
      // 2.用户点击取消删除则confirmResout返回cancel
      // console.log(confirmResout);
      //   console.log(confirmResout)
      if (confirmResout !== 'confirm') return this.$message.info('已经取消删除')
      console.log('确认删除')
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除参数失败')
      this.$message.success('删除参数成功')
      // 重新加载数据
      this.getParamsData()
    },

    //   编辑对话框关闭监听
    editDialogClosed() {
      this.$refs.editParamsFormRef.resetFields()
    },
    // 编辑确定按钮事件
    editParams() {
      this.$refs.editParamsFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,
          { attr_name: this.editParamsForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) return this.$message.error('编辑参数失败')
        this.$message.success('编辑参数成功')
        this.getParamsData()
        this.editParamsDialogVisible = false
      })
    },
    //   点击编辑展示修改对话框
    async showEditDialog(id) {
      // 查询当前分类的属性值
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,
        { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('获取参数失败')
      this.editParamsForm = res.data
      // console.log(this.editParamsForm);

      this.editParamsDialogVisible = true
    },
    //   添加的确定按钮事件
    addParams() {
      // 预校验添加的参数
      this.$refs.addParamsFormRef.validate(async valid => {
        if (!valid) return
        // console.log(this.cateId);
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) return this.$message.error('添加参数失败')
        this.$message.success('添加参数成功')

        this.getParamsData()
        this.addParamsDialogVisible = false
      })
    },
    //   添加对话框关闭监听
    addDialogClosed() {
      this.$refs.addParamsFormRef.resetFields()
    },
    //   添加按钮展示对话框事件
    showAddParamsDialog() {
      this.addParamsDialogVisible = true
    },
    // 获取参数列表数据
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyData = []
        this.onlyData = []
        return
      }
      //   console.log(this.selectedCateKeys)
      // 根据所选分类的id 和当前所处面板 获取对应参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
      // 将参数转为数组
      res.data.forEach(item => {
        //   三元表达式判断元数据是否为空值
        item.attr_vals = item.attr_vals
          ? item.attr_vals.split(' ')
          : []
        // 添加两个属性
        //   控制文本框显示与隐藏
        item.inputVisible = false
        //  文本框输入值
        item.inputValue = ''
      })

      if (this.activeName === 'many') {
        this.manyData = res.data
      } else {
        this.onlyData = res.data
      }
    },
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) { return this.$message.error('获取商品分类失败') }
      this.cateList = res.data
    },
    // 标签页点击事件
    handTableClick() {
      // console.log(this.activeName)
      this.getParamsData()
    },
    // 级联选择器中选中项变化触发
    handleChange() {
      this.getParamsData()
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px;
}
.el-tag,.button-new-tag{
    margin: 10px;
}
.input-new-tag{
    width: 150px;
}
</style>
