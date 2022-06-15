<template>
    <div>
         <!-- 1. 面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2.卡片视图区 -->
    <el-card>
        <!-- 添加按钮 -->
        <el-row>
            <el-col>
                <el-button type="primary" @click="showAddCate">添加分类</el-button>
            </el-col>
        </el-row>

        <!-- 表格数据 -->
        <tree-table class="treeTable" :data="catelist"
        :columns="columns" :selection-type="false"
        :expand-type="false" :show-index="true"
        index-text="#" border :show-row-hover="false">
            <!-- 是否有效 -->
            <template slot="isOk" slot-scope="scope">
               <i style="color:lightgreen" v-if="scope.row.cat_deleted === false" class="el-icon-success"></i>
               <i style="color:red" class="el-icon-error" v-else></i>
            </template>
            <!-- 排序 -->
            <template slot="order" slot-scope="scope">
                <el-tag v-if="scope.row.cat_level === 0 " type="primary">一级</el-tag>
                <el-tag v-else-if="scope.row.cat_level === 1 " type="success">二级</el-tag>
                <el-tag v-else type="warning">三级</el-tag>
            </template>
            <!-- 操作 -->
             <template slot="set" slot-scope="scope">
                 <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
                 <el-button type="danger" icon="el-icon-delete" @click="removeCateById(scope.row.cat_id)">删除</el-button>
            </template>
        </tree-table>

         <!-- 5. 页脚分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5,8, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

    </el-card>

    <!-- 添加按钮对话框 -->
    <el-dialog
       @close="addCateDialogClosed"
       :close-on-click-modal="false"
        title="添加分类"
        :visible.sync="addDialogVisible"
        width="50%"
        >
        <!-- 表单内容 -->
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
            
            <el-form-item label="分类名称：" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>

            <el-form-item label="父级分类" >
            <div class="block" >
                <!-- options:属性 指定数据源  props：指定配置类型对象  -->
                <el-cascader
                    v-model="selectedKeys"
                    :props="cascaderProps"
                    :options="ParrentCateList"
                    @change="parentCateChanged" clearable
                    change-on-select></el-cascader>
            </div>
            </el-form-item>
        </el-form>  
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 编辑按钮对话框 -->
    <el-dialog
      title="编辑分类"
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDilogClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
         <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
         </el-form-item>
       

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>



    </div>
</template>

<script>
export default  {
    data(){
        return {
            // 编辑表单对象
            editCateForm:{
                  // 将要添加的分类名称
                cat_name:'',
                // 父级id
                cat_pid:0,
                cat_id:0,
                // 分类的等级
                cat_level:0
            },
            // 编辑对话框弹出
            editDialogVisible:false,
            // 选中的父级分类的id数组
            selectedKeys:[],
            // 指定的级联选择器的props属性值
           cascaderProps:{
                expandTrigger: 'hover', 
                label:'cat_name',
                value:'cat_id',
                children:'children',
            },
            // 父级分类对象列表
            ParrentCateList:[],
            // 编辑分类的表单规则对象
             editFormRules:{
                cat_name:[
                    {required:true,message:'请输入分类名称',trigger:'blur'}
                ]
            },
            // 添加分类的表单规则对象
            addCateFormRules:{
                cat_name:[
                    {required:true,message:'请输入分类名称',trigger:'blur'}
                ]
            },
            // 添加分类表单对象
            addCateForm:{
                // 将要添加的分类名称
                cat_name:'',
                // 父级id
                cat_pid:0,
                // 分类的等级
                cat_level:0
            },
            // 添加对话框开启条件
            addDialogVisible: false,

            // 为table指定定义
            columns:[{
                label:"分类名称",
                prop:"cat_name",
            },
            {
                label:"是否有效",
                // 定义类型
                type:"template",
                // 当前作用域插槽名称
                template:"isOk"
            },
            {
                label:"排序",
                type:"template",
                template:"order"
            },
            {
                label:"操作",
                type:"template",
                template:"set"
            }
            ], 
            // 商品分类列表 默认为空
            catelist:[],
            // 查询条件
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            // 数据总条数 默认0
            total:0
        }
    },

    created(){
        this.getCateList()
    },

    methods:{
        // 删除分类
        async removeCateById(id){
         // 询问是否删除
        const confirmResout = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
         // 1.用户点击确定删除则confirmResout返回confirm
        // 2.用户点击取消删除则confirmResout返回cancel
        // console.log(confirmResout);
        console.log(confirmResout);
        if(confirmResout !== 'confirm') return this.$message.info('已经取消删除')
        console.log("确认删除");
        const {data:res} = await this.$http.delete("categories/"+ id)
        if(res.meta.status !== 200) return this.$message.error('删除分类失败')
        this.$message.success('删除分类成功')
        // 重新加载数据
        this.getCateList()

    },

        // 点击取消按钮清空数据
        editDilogClosed(){ 
            console.log('取消');
            this.$refs.editFormRef.resetFields()

        },
        // 点击确定按钮修改分类值
        editRoleInfo(){
             this.$refs.editFormRef.validate(async valid => {
                if(!valid) return 
                
                const {data:res} = await this.$http.put('categories/'+this.editCateForm.cat_id,this.editCateForm)
                console.log(res.meta);
                if(res.meta.status !==200) return this.$message.error("编辑分类失败")
                this.$message.success("编辑分类成功")
                this.getCateList()
                this.editDialogVisible = false
            })
        },
        // 点击编辑按钮展示对话框
        async showEditDialog(id){
            console.log(id);
            // 根据id查询分类属性值
            const {data:res} = await this.$http.get('categories/'+id)
            console.log(res.meta);
            if(res.meta.status !== 200) return this.$message.error('获取分类失败')
            // 保存获取对象属性并读出属性值
            this.editCateForm = res.data
            this.editDialogVisible = true
        },


        // 添加取消按钮事件
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        },
        // 添加确定按钮事件
        addCate(){
            this.$refs.addCateFormRef.validate(async valid => {
                if(!valid) return 
                const {data:res} = await this.$http.post('categories',this.addCateForm)
                if(res.meta.status !==201) return this.$message.error("添加分类失败")
                this.$message.success("添加分类成功")
                this.getCateList()
                this.addDialogVisible = false
            })
        },
        // 选中项发生变化触发
        parentCateChanged(){
            console.log(this.selectedKeys);
            if(this.selectedKeys.length > 0){
                // 获取父级分类id
               this.addCateForm.cat_pid =  this.selectedKeys[this.selectedKeys.length - 1]
                // 当前分类等级
               this.addCateForm.cat_level = this.selectedKeys.length 
               return
            }else{
                 // 获取父级分类id
               this.addCateForm.cat_pid =  0
                // 当前分类等级
               this.addCateForm.cat_level = 0 
            }
        },
        // 获取到父级分类的列表
        async getParentCateList(){
            // console.log(this.$http.get('categories'));
             const{data:res} = await this.$http.get('categories',{params:{type:2}})
             if(res.meta.status !== 200) return this.$message.error('获取父级分类失败')
             this.ParrentCateList = res.data
        },

        // 添加对话框弹出事件
        showAddCate(){
        // 先加载父级分类数据
        this.getParentCateList()

            this.getCateList()
            console.log(this.ParrentCateList);
            this.addDialogVisible = true
        },

        // 监听pagenum改变
        handleCurrentChange(newNum){
            this.queryInfo.pagenum = newNum
            this.getCateList()
        },

        // 监听pagesize改变
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },

        // 获取商品分类数据
        async getCateList() {
            // 获取用户数据
            const { data: res } = await this.$http.get('categories', {
                params: this.queryInfo,})
            if(res.meta.status !== 200) return this.$message.error("数据获取失败")
            // 存放数据到data数组中
            this.catelist = res.data.result
            // 保存数据总数
            this.total = res.data.total
        }
    }
   
}
</script>

<style lang='less' scoped>
.treeTable{
    margin-top: 15px;
}
</style>