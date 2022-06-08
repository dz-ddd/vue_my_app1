<template>
  <el-container class="home-container">
    <!-- 头部区 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>

      <!-- 侧边栏 -->
      <el-aside :width="asideWidth+'px'"   >
        <!-- 菜单折叠按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--  侧边栏菜单区 -->
        <el-menu
          :router="true"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="!toggle"
          :collapse-transition="false"
          :default-active="itemPath"
          >

          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" 
            :key="item.id"
            v-for="item in menulist"
          >
            <!-- 一级菜单模 板区域 -->
            <template slot="title" >
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item 
            :index="'/'+i.path"
            :key="i.id"
            v-for="i in item.children"
            @click="togglePoint('/'+i.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{i.authName}}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {

  data(){
    return {
      // 左侧菜单的数据
      menulist:[],
      iconObj:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',
      },
      // 二级菜单的路径
      itemPath:'',
      // 是否折叠
      toggle:"true",
      asideWidth:200
    }
  },
  // 加载所有菜单
  created(){
    this.getMenuList()
    this.itemPath = window.sessionStorage.getItem('itemPath')
  },
  methods: {
    // 选中菜单高亮
    togglePoint(path){
      // 保持激活状态
        window.sessionStorage.setItem('itemPath',path)
        this.itemPath = path
    },
    // 点击折叠所有菜单
    toggleCollapse(){
      this.toggle = !this.toggle
      if(this.asideWidth === 64) {
        this.asideWidth = 200
      }else{
        this.asideWidth = 64
      }
    },

    //退出按钮 
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },

    // 获取所有菜单
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')
      // 失败
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    }
  },
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  color: #fff;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  color: black;
}

.el-main {
  background-color: #eaedf1;
  color: black;
}
// icon
.iconfont{
  margin-right: 10px;
}
// 菜单
.el-menu{
  border-right: 0;
}

// 菜单收缩按钮
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;

}
</style>