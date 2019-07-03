<template>
  <div class="form">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item class="form-item" prop="username">
        <el-input v-model="ruleForm.username" placeholder="用户名/手机"></el-input>
      </el-form-item>

      <el-form-item class="form-item" prop="password">
        <el-input type="password" v-model="ruleForm.password" placeholder="密码"></el-input>
      </el-form-item>

      <p class="form-text">
        <nuxt-link to="javascript:;">忘记密码</nuxt-link>
      </p>
      <!-- 按钮 -->
      <el-button type="primary" class="submit" @click="handleSubmit">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入手机号码", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleSubmit() {
      this.$refs["ruleForm"].validate(valid => {
        //   console.log(valid)
        if (valid) {
        //   this.$axios({
        //     url: "/accounts/login",
        //     method: "POST",
        //     data: this.ruleForm
        //   }).then(res => {
        //     // console.log(res);
        //     const { status, data } = res;
        //     if (status === 200) {
        //       console.log(data);
        //       this.$store.commit("user/setUserInfo",data);
        //     }
        //   });
        this.$store.dispatch("user/login",this.ruleForm).then(res=>{
            // console.log('12333')
            // console.log(res)
            this.$message.success("登录成功，正在跳转...");
            setTimeout(() => {
                this.$router.push("/")
            }, 2000);
        })
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.form {
  padding: 25px;
  .form-item {
    margin-bottom: 20px;
  }

  .form-text {
    font-size: 12px;
    color: #409eff;
    text-align: right;
    line-height: 1;
  }
  .submit {
    width: 100%;
    margin-top: 10px;
  }
}
</style>

