<template>
  <div>
        <!-- 1. 面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 2. 卡片视图区域 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList" >
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                        <el-button type="primary" icon="el-icon-search" @click="goAddGoods">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- table 表格区域 -->
            <el-table :data="goodslist" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格（元）" prop="goods_price"
                    width="95px"></el-table-column>
                <el-table-column label="商品重量（克）" prop="goods_weight"
                    width="70px"></el-table-column>
                <el-table-column label="商品创建时间" prop="add_time"
                        width="140px" >
                    <template slot-scope="scope">
                            {{scope.row.add_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="primary"
                                icon="el-icon-edit"
                               >
                                
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                icon="el-icon-delete"
                                @click="removeById(scope.row)"
                               >
                                
                        </el-button>
                    </template>
                </el-table-column>


            </el-table>

            <!-- 分页区域-->
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        
        <!-- 添加商品对话框  -->
        <!-- <el-dialog
            title="添加商品"
            :visible.sync="addDialogVisible"
            width="50%"
            >
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
        // // 添加商品对话框展示
        // addDialogVisible:false,
        // 数据总数
        total:0,
        // 商品数据列表
        goodslist:[],
        // 查询所需参数对象
        queryInfo:{
            query:"",
            pagenum:1,
            pagesize:10
        }
    }
  },

  created() {
      this.getGoodsList()
  },

  methods: {
    // 展示添加商品对话框监听
    goAddGoods(){
        this.$router.push('/goods/add')
    },
    // 删除商品事件监听
    async removeById(row){
         // 询问是否删除
        const confirmResout = await this.$confirm(
            '此操作将永久删除该商品, 是否继续?',
            '提示',
            {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            }
        ).catch((err) => err)
      // 1.用户点击确定删除则confirmResout返回confirm
      // 2.用户点击取消删除则confirmResout返回cancel
        console.log(confirmResout)
        if (confirmResout !== 'confirm') return this.$message.info('已经取消删除')
        console.log('确认删除')
        const { data: res } = await this.$http.delete('goods/' + row.goods_id)
        if (res.meta.status !== 200) return this.$message.error('删除商品失败')
        this.$message.success('删除商品成功')
        // 重新加载数据
        this.getGoodsList()
    },
    // 分页改变监听事件
    handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getGoodsList()
    },
    // 分页页码监听
    handleCurrentChange(newNum){
         this.queryInfo.pagenum = newNum
        this.getGoodsList()
    },

    // 根据分页获取商品数据
    async getGoodsList(){
        const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
        if(res.meta.status !== 200) return this.$message.error('获取商品列表失败')
        this.$message.success('获取商品列表成功')
        this.goodslist = res.data.goods
        this.total = res.data.total
        console.log(res.data);
    },

  },
}
</script>

<style lang="less" scoped>
</style>