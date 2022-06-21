<template>
  <div>
    <!-- 1. 面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2.卡片视图区 -->
    <el-card class="box-card">
      <!-- 3. 搜索与添加区 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>

      <!-- 4. 用户列表区 -->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column
          type="index"
          label="编号"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="名称"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
          width="180"
        ></el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-row>
              <!-- 修改 -->
              <el-tooltip
                :open-delay="300"
                :enterable="false"
                class="item"
                effect="dark"
                content="修改用户"
                placement="top"
              >
                <el-button
                  @click="showEditDilog(scope.row.id)"
                  type="primary"
                  icon="el-icon-edit"
                  circle
                ></el-button>
              </el-tooltip>

              <!-- 删除 -->
              <el-tooltip
                :open-delay="300"
                :enterable="false"
                class="item"
                effect="dark"
                content="删除用户"
                placement="top"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeUserById(scope.row.id)"
                  circle
                ></el-button>
              </el-tooltip>
              <!-- 分配权限 -->
              <el-tooltip
                :open-delay="300"
                :enterable="false"
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
              >
                <el-button
                  @click="setUserRole(scope.row)"
                  type="warning"
                  icon="el-icon-setting"
                  circle
                ></el-button>
              </el-tooltip>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!-- 5. 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!--6. 对话框区 -->
    <!-- 6.1点击击添加用户对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="fromClosed"
    >
      <!-- 添加的内容主体区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>

        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <!-- 底部按钮区 -->
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 6.2修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :close-on-click-modal="false"
      :visible.sync="editDilogVisible"
      width="50%"
      @close="editDilogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮  箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>

        <el-form-item label="电  话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDilogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

<!-- 6.3 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setUserRoleDialog"
      width="50%"
      @close="setRoleDialogClosed"
      >
      <div>
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
           <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName "
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setUserRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义验证邮箱规则
    const checkEmail = (rules, value, cb) => {
      // 邮箱正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([[a-zA-Z0-9_-])+(\.[[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法
        cb()
      } else {
        cb(new Error('邮箱格式不正确'))
      }
    }
    // 自定义验证电话规则
    const checkMobile = (rules, value, cb) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        cb()
      } else {
        cb(new Error('手机号码格式不正确'))
      }
    }

    return {
      // 修改对象
      editForm: {},
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1, // 当前页数
        pagesize: 2 // 每页显示条数
      },
      userlist: [{}],
      total: 0, // 总的用户数据条数
      // 控制添加对话框是否弹出
      dialogVisible: false,
      // 控制分配角色对话框是否弹出
      setUserRoleDialog: false,
      // 修改用户信息对话框是否展示
      editDilogVisible: false,
      // 需要分配角色用户信息
      userInfo: {},
      // 已选择的角色id值
      selectRoleId: '',
      // 角色列表
      roleList: [],
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单验证规则对象
      addFormRules: {
        // 用户名验证规则
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3--10字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 6,
            max: 10,
            message: '用户名的长度在6--15字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
          // {min:6 , max: 10,message:"用户名的长度在6--15字符之间" ,trigger:"blur"}
        ],
        mobile: [
          { required: true, message: '请输入用户电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }

          // {min:6 , max: 10,message:"用户名的长度在6--15字符之间" ,trigger:"blur"}
        ]
      },
      // 修改表单验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    // 分配角色对话框关闭
    setRoleDialogClosed() {
      this.selectRoleId = ''
      this.userInfo = ''
    },
    // 确定分配角色
    async saveRoleInfo() {
      if (!this.selectRoleId) return this.$message.error('请选择用户角色')
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId })
      if (res.meta.status !== 200) return this.$message.error('分配角色失败')
      this.$message.success('分配角色成功')
      this.getUserList()
      this.setUserRoleDialog = false
    },
    // 分配角色对话框弹出
    async setUserRole(userInfo) {
      // console.log(userInfo);
      this.userInfo = userInfo
      // 获取全部角色信息
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      console.log(res.data)
      this.roleList = res.data
      this.setUserRoleDialog = true
    },

    // 删除用户
    async removeUserById(id) {
      // console.log(id);
      // 询问是否删除
      const confirmResout = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 1.用户点击确定删除则confirmResout返回confirm
      // 2.用户点击取消删除则confirmResout返回cancel
      // console.log(confirmResout);
      if (confirmResout !== 'confirm') return this.$message.info('已经取消删除')
      console.log('确认删除')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success('删除用户成功')
      // 重新加载数据
      this.getUserList()
    },
    // 点击确定修改用户数据
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('修改内容错误，请重新确认')
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) return this.$message.error('修改用户失败')
        this.$message.success('修改用户成功')
        // 关闭对话框
        this.editDilogVisible = false
        // 重新加载数据
        this.getUserList()
      })
    },
    // 修改表单关闭事件
    editDilogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击修改按钮弹出对话框
    async showEditDilog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询失败了')
      this.$message.success('查询成功了')
      this.editForm = res.data
      this.editDilogVisible = true
    },
    // 点击按钮添加新用户
    addUser() {
      // 数据预校验
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return this.$message.error('表格内容错误，请重新确认')
        // 发起添加网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        // alert(res.data.status)
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    // 添加用户表单关闭
    fromClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 获取用户数据列表内容
    async getUserList() {
      // 获取用户数据
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      // console.log(res)
      if (res.meta.status !== 200) { return this.$message.error('获取用户列表失败') }
      this.userlist = res.data.users
      this.total = res.data.total
    },

    //  监听 switch开关 用户状态
    async userStateChanged(data) {
      // console.log(data);
      const { data: res } = await this.$http.put(
        `users/${data.id}/state/${data.mg_state}`
      )
      data.mg_state = !data.mg_state
      if (res.meta.status !== 200) return this.$message.error('状态修改失败')
      this.$message.success('状态修改成功')
      this.getUserList()
    },

    // 每页显示条数选择
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },

    // 分页切换
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    }
  },
  created() {
    this.getUserList()
  }
}
</script>
