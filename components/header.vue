<template>
  <div class="header">
    <el-row type="flex" justify="space-between" class="main">
      <div class="logo">
        <nuxt-link to="/">
          <img src="/images/logo.jpg" alt>
        </nuxt-link>
      </div>

      <!-- 菜单 -->
      <el-row class="nav" type="flex">
        <nuxt-link to="/" class="active">首页</nuxt-link>
        <nuxt-link to="/post">旅游攻略</nuxt-link>
        <nuxt-link to="/hotel">酒店</nuxt-link>
        <nuxt-link to="/air">国内机票</nuxt-link>
      </el-row>

      <!-- 登录状态 -->
      <el-row type="flex" align="middle" class="user">
        <!-- 用户信息下拉菜单 -->
        <el-dropdown v-if="$store.state.user.userInfo.token">
          <el-row type="flex" align="middle" class="el-dropdown-link">
            <a href="javascript:;">
              <img
                class="avatar"
                :src="$axios.defaults.baseURL + $store.state.user.userInfo.user.defaultAvatar"
                alt
              >
              <span>{{$store.state.user.userInfo.user.nickname}}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </a>
          </el-row>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item class="logout">
              <span @click="handleLogout">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 登录注册 -->
        <div class="login-link" v-else>
          <nuxt-link to="/user/login">登录/注册</nuxt-link>
        </div>
      </el-row>
    </el-row>
  </div>
</template>

<script>
export default {
  mounted() {
    // console.log(!this.$store.state.user.userInfo.token);
  },
  methods: {
    //退出
    handleLogout() {
      //清除本地存储的用户数据
      this.$store.commit("user/clearUserInfo");

      this.$message.success("成功注销用户...");
    }
  }
};
</script>

<style scoped lang="less">
.header {
  height: 60px;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 2px #f5f5f5;
  .main {
    width: 1000px;
    margin: 0 auto;
    .logo {
      width: 156px;
      padding: 8px 0 0;
    }
    .nav {
      flex: 1;
      margin: 0 20px;
      a {
        display: block;
        padding: 0 20px;
        height: 60px;
        line-height: 60px;
        box-sizing: border-box;
        &:hover {
          border-bottom: 5px solid #409eff;
          color: #409eff;
        }
        &.nuxt-link-exact-active {
          background: #409eff;
          color: #fff;
        }
      }
    }
    .user {
      .el-dropdown-link {
        height: 60px;
        .avatar {
          width: 32px;
          height: 32px;
          vertical-align: middle;
          border: 2px solid #fff;
          border-radius: 50%;
          margin-right: 3px;
          padding: 2px;
        }
        &:hover {
          .avatar {
            border-color: #409eff;
          }
        }
      }

      .login-link {
        line-height: 60px;
        color: #666;
        a {
          &:hover {
            color: #409eff;
          }
        }
      }
    }
  }
}

.logout {
  padding: 0;
  span {
    display: block;
    padding: 0 20px;
  }
}
</style>
