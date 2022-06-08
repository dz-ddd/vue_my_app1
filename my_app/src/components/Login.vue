<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区   -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        class="login_form"
        label-width="80px"
      >
        <!-- 用户名 -->
        <el-form-item prop="username" label="用户名">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password" label="密码">
          <el-input
            show-password
            type="password"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 登录表单数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      // 登录表单验证规则对象
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度在3--10字符之间',
            trigger: 'blur',
          },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度在6--15字符之间',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    // 点击重置按钮重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
      // console.log(this);
    },
    // 登录预验证
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res);
        if (res.meta.status !== 200) {
          // return console.log("登录失败");
          return this.$message.error('登录失败了')
        }
        // console.log('登陆成功');
        this.$message.success('登录成功了')
        // 1.登录成功后需要保存token 到客户端的sessionStorage中
        //   1.1项目中除了登录之外的api接口都需要在登录之后才能访问
        //   1.2token 只应在当前网站打开期间生效,所以需要将token保存在sessionStorage中
        // console.log(res.data.token);
        window.sessionStorage.setItem('token', res.data.token)
        // 2.通过编程式导航跳转到后台主页 路由地址是/home
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style lang='less' scoped>
// 整体
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
// 内容
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
// 头像
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid black;
  box-shadow: 0 0 10px #ddd;
  border-radius: 50%;
  position: relative;
  left: 50%;
  top: 0%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
// 表单
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
}
// 按钮
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>