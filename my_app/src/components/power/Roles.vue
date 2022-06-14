<template>
  <div>
    <!-- <h3>角色列表</h3> -->
    <!-- 1. 面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 1. 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表展示 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['rowcenter','bdbottom',i1===0 ?'bdtop':'']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <!-- 第一列 一级权限 -->
              <el-col :span="5">
                <el-tag  closable @close="removeRightById(scope.row,item1.id)"  type="primary" > {{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 第2列 二三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环遍历二级权限 -->
                <el-row :class="['rowcenter', 'bdtop',i2===0 ?' ':'bdtop']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6" >
                    <el-tag closable @close="removeRightById(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="13" >
                    <el-row :class="['rowcenter3']" v-for="(item3) in item2.children" :key="item3.id">
                        <el-col  >
                          <el-tag type="warning" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                        </el-col>
                    </el-row>
                  </el-col>

                </el-row>
              </el-col>

            </el-row>
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <!-- 作用域插槽 -->
         
            <template slot-scope="scope">
             
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDilog(scope.row.id)">
                  编辑
              </el-button>

              <el-button size="mini" type="danger" @click="removeRoleById(scope.row.id)" icon="el-icon-delete">
                删除
              </el-button>

              <el-button size="mini" type="warning" @click="showSetRightDialog(scope.row)" icon="el-icon-setting">
                分配权限
              </el-button>
          </template>
        </el-table-column>
      </el-table>
     </el-card>


     <!-- 添加用户对话框 -->

     <el-dialog
      :close-on-click-modal="false"
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="fromClosed"
      >
      <!-- 添加的内容主体 -->
      <el-form
      :model="addForm"
      :rules="addFormRules"
      ref="addFormRefs"
      label-width="100px">
         <el-form-item label="角色名" prop="roleName">
            <el-input  v-model="addForm.roleName"></el-input>
         </el-form-item>
         <el-form-item  label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
         </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleDialog">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色的对话框 -->
    <el-dialog
      title="编辑角色"
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDilogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
         <el-form-item label="角色名" prop="roleName">
            <el-input  v-model="editForm.roleName"></el-input>
         </el-form-item>
         <el-form-item  label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
         </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>


     <!-- 设置权限对话框 -->
     <el-dialog
      :close-on-click-modal="false"
      title="设置权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClose"
      >
      <!-- 添加的内容主体 -->
     <el-tree show-checkbox :data="rightsListTree" :props="treePtops"
      node-key="id" default-expand-all 
       :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="alloRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
   
    return {
      // 角色编辑校验规则
      editFormRules:{
         roleName:[
          {required:true,message:'请输入角色名称',trigger:'blur'},
          {max:6,min:3,message:'角色名称长度为3--6个字符',trigger:'blur'}
        ],
        roleDesc:[
          {required:true,message:'请输入角色描述',trigger:'blur'},
          {max:15,min:0,message:'角色描述长度为0--15个字符',trigger:'blur'}
        ]
      },
      
      // 角色添加校验规则
      addFormRules:{
        roleName:[
          {required:true,message:'请输入角色名称',trigger:'blur'},
          {max:6,min:3,message:'角色名称长度为3--6个字符',trigger:'blur'}
        ],
        roleDesc:[
          {required:true,message:'请输入角色描述',trigger:'blur'},
          {max:15,min:5,message:'角色描述长度为5--15个字符',trigger:'blur'}
        ]
      },
      // 所有权限列表树
      rightsListTree:[],
      // 权限树展示字段
      treePtops:{
        children:'children',
        label:'authName'
      },
      // 显示的权限id
      defKeys:[],
      // 角色id保存
      roleId:'',

      // 所有角色列表
      roleList: [],
      // 编辑角色
      editForm:{},
      // 添加角色表单
      addForm:{
      roleName :"",
      roleDesc :"",
      },
      addDialogVisible: false, //控制添加角色对话框显示
      editDialogVisible: false,//控制编辑角色对话框显示
      setRightDialogVisible:false//控制权限设置对话框显示
    }
  },

  created() {
    this.getRoleList()
  },

  methods: {
    async alloRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      // console.log(keys);
      const idStr = keys.join(',')
      // 发起请求
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status !==200) return this.$message.error("权限设置失败")
      this.$message.success("权限分配成功")
      this.getRoleList()
      this.setRightDialogVisible = false

      // console.log(typeof idStr);
    },

    // 监听权限树的关闭事件
    setRightDialogClose(){
      this.defKeys = []
    },
    // 嵌套循环获取权限id
    getleafKeys(node,arr){
      // 
      if(!node.children){
        return arr.push(node.id)
      }

      node.children.forEach(item => {
        this.getleafKeys(item,arr)
      })

    },
    //分配权限设置
    async showSetRightDialog(role){
      // 需要分配权限的id
      this.roleId = role.id
      // console.log(this);
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status !== 200) return this.$message.error("获取权限失败")
      // 将成功获取的数据保存到data中
      this.rightsListTree = res.data
      // console.log(this.rightsListTree);
      this.getleafKeys(role,this.defKeys)
      this.setRightDialogVisible = true
    },

    // 工具id删除角色权限
    async removeRightById(role,rightId){
      console.log(role);
         // 询问是否删除
        const confirmResout = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmResout !== 'confirm') return this.$message.info('已经取消删除')
        console.log("确认删除");
        const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status !== 200) return this.$message.error("删除权限失败")
        this.$message.success("删除权限成功")
        role.children = res.data
      },


    // 删除角色
    async removeRoleById(id){
         // 询问是否删除
        const confirmResout = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
         // 1.用户点击确定删除则confirmResout返回confirm
        // 2.用户点击取消删除则confirmResout返回cancel
        // console.log(confirmResout);
        if(confirmResout !== 'confirm') return this.$message.info('已经取消删除')
        console.log("确认删除");
        const {data:res} = await this.$http.delete("roles/"+ id)
        if(res.meta.status !== 200) return this.$message.error('删除角色失败')
        this.$message.success('删除角色成功')
        // 重新加载数据
        this.getRoleList()

    },

    // 展示编辑角色对话框
    async showEditDilog(id){
        const {data:res} = await this.$http.get('roles/'+ id)
        if(res.meta.status !== 200){
          return this.$message.error("获取角色失败")
        }
        // 获取到角色对象重新赋值
        this.editForm = res.data
        this.editDialogVisible = true      
    },

    // 点击确定 提交编辑数据
    editRoleInfo(){
      // 数据预校验
       this.$refs.editFormRef.validate(async valid => {
        if(!valid) return this.$message.error('内容错误，请重新确认')
        const {data:res} = await this.$http.put('roles/'+this.editForm.roleId ,
        {roleName:this.editForm.roleName,
         roleDesc:this.editForm.roleDesc}
         )
        if(res.meta.status !== 200) return this.$message.error('角色编辑失败')
        this.$message.success('角色编辑成功')
        // 关闭对话框
        this.editDialogVisible = false
        // 重新加载数据
        this.getRoleList()
      })

    },

  
    // 编辑对话框取消重置数据
    editDilogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    // 添加对话框取消重置数据
    fromClosed(){
      this.$refs.addFormRefs.resetFields()
    },
 
    // 点击按钮添加新角色
    addRoleDialog() {
      // 数据预校验
      this.$refs.addFormRefs.validate(async (valid) => {
        if (!valid) return this.$message.error('表格内容错误，请重新确认')
        // 发起添加网络请求
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getRoleList()
      })
    },

    // 获取角色列表数据
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表失败')
      this.roleList = res.data
    },
  },
}
</script>

<style lang="less" scoped>

.el-tag{
  margin: 6px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
   border-bottom: 1px solid #eee;
}
.rowcenter{
  display: flex;
  align-items: center;
}
.rowcenter3{
  float: left;

}
</style>