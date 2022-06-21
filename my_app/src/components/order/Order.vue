<template>
    <div>
         <!-- 1. 面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 2.卡片视图区 -->
        <el-card class="box-card">
            <!-- 搜索栏 -->
            <el-row>
                <el-col :span="8">  
                    <el-input placeholder="请输入内容" >
                        <el-button slot="append" icon="el-icon-search">
                        </el-button>
                    </el-input>

                </el-col>
            </el-row>

            <!-- 订单列表数据展示  -->
            <el-table :data="orderlist" border  stripe>
                <!-- 索引栏 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="primary" v-if="scope.row.pay_status === '1'">已付款 </el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            size="mini"
                            icon="el-icon-edit"

                            @click="showEditDialog(scope)"
                            ></el-button>  
                        <el-button
                            type="success"
                            size="mini"
                            icon="el-icon-location"
                            ></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 点击编辑对话框 -->
        <el-dialog
            title="修改地址"
            :visible.sync="editdialogVisible"
            width="50%"
            @close="editDialogClosed">
            <!-- 展示内容 -->
            <el-form :model="addressForm" :rules="addressRules" ref="addressFormRef"
             label-width="100px" >
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
                </el-form-item>
                 <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 物流对话框 -->
        <el-dialog
            title="物流进度"
            :visible.sync="progressVisible"
            width="50%"
            >
            <span>这是一段信息</span>
           
        </el-dialog>

    </div>
</template>

<script>
import cityData from "./citydata"
export default {
    data() {
        return {
            // 物流信息保存
            progressInfo:[],
            // 物流对话框展示
            progressVisible:false,
            cityData,
            // 数据校验对象
            addressRules:{
                address1:
                    { required: true, message: '请选择省市区/县', trigger: 'blur' },
                address2:
                    { required: true, message: '请输入详细地址', trigger: 'blur' },

            },
            // 对话框展示内容数据列表
            addressForm:{
                address1:[],
                address2:''
            },
            // 编辑对话框打开
            editdialogVisible:false,
            // 订单总数据条数
            total:0,

            // 获取的订单数据列表
            orderlist:[],

            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            }
        }
    },

    created(){
        this.getOrderList()
    },

    methods:{

        // 物流进度展示
        // 快递信息接口失效无法查询
        async showProgressBox(){
            const {data:res} = await this.$http.get('kuaidi/JD0075877797746')
            console.log(res);
            if(res.meta.status !==200 )return this.$message.error('获取物流信息失败')
            this.progressInfo = res.data
            console.log(this.progressInfo);
            this.progressVisible = true
        },
        // 对话框关闭事件
        editDialogClosed(){
            this.$refs.addressFormRef.resetFields()
        },

        // 修改对话框展示
        showEditDialog(){
            this.editdialogVisible = true
        },
        // 
        handleCurrentChange(nwePage){
            this.queryInfo.pagenum = nwePage
            this.getOrderList()
        },
        // 分页改变事件监听
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        // 获取订单数据
        async getOrderList(){
           const {data:res} =
           await this.$http.get('orders',{params:this.queryInfo})
           if(res.meta.status !== 200) return this.$message.error('获取订单列表失败')
           console.log(res);
        //    获取列表数据
           this.orderlist = res.data.goods
           this.total = res.data.total
        },
    },


}
</script>

<style lang="less" scoped>
.el-cascader{
    width: 100%;
}
</style>