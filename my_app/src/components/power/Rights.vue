<template>
    <div>
        <!-- <h3>权限列表</h3> -->
        <!-- 1. 面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/home' }">权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 2.卡片视图区 -->
        <el-card>
           <el-table :data="rightsList" border stripe>
               <el-table-column type="index" label="#"> </el-table-column>
               <el-table-column label="权限名称" prop="authName"> </el-table-column>
               <el-table-column label="路径" prop="path"> </el-table-column>
               <el-table-column label="权限" prop="level">
                   <template slot-scope="scope" >
                       <el-tag v-if="scope.row.level === '0'" >一级</el-tag>
                       <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                       <el-tag type="warning" v-else>三级</el-tag>
                   </template>
               </el-table-column>
           </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
  data() {
    return {
      //    权限列表
      rightsList: []
    }
  },
  created() {
    //    页面创建时加载数据
    this.getRightList()
  },
  methods: {
    async getRightList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('权限列表加载失败')
      //  this.$message.success("权限列表获取成功")
      this.rightsList = res.data
      console.log(this.rightsList)
    }
  }

}
</script>
