<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="form">
      <el-form-item prop="username" class="form-item">
        <el-input placeholder="用户手机" v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item class="form-item" prop="captcha">
        <el-input placeholder="验证码" v-model="ruleForm.captcha">
          <template slot="append">
            <el-button @click="handleSendCaptcha">发送验证码</el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="nickname" class="form-item">
        <el-input placeholder="你的名字" v-model="ruleForm.nickname"></el-input>
      </el-form-item>

      <el-form-item prop="password" class="form-item">
        <el-input placeholder="密码" type="password" v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item prop="checkPassword" class="form-item">
        <el-input placeholder="确认密码" type="password" v-model="ruleForm.checkPassword"></el-input>
      </el-form-item>
      <el-form-item class="form-item">
        <el-button type="primary" @click="handleRegSubmit">注册</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPassword !== "") {
          this.$refs.ruleForm.validateField("checkPassword");
        }
        callback();
      }
    };
    //确认密码
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        username: "",
        captcha: "",
        nickname: "",
        password: "",
        checkPassword: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户手机", trigger: "blur" }
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        nickname: [
          { required: true, message: "请输入你的名字", trigger: "blur" }
        ],
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPassword: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    //发送验证码
    handleSendCaptcha() {
      const { username } = this.ruleForm;
      //判断手机号码是否为空
      if (!username) {
        this.$confirm("手机号码不能为空，请重新输入", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        return;
      }
      //发起异步请求获取验证码
      this.$axios({
        url: "/captchas",
        method: "POST",
        data: {
          tel: username
        }
      }).then(res => {
        const { code } = res.data;

        this.$confirm("模拟手机验证码为：" + code, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });

      });
    },

    //点击注册
    handleRegSubmit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          //解构赋值去除对象中的属性checkPassword
          const { checkPassword, ...props } = this.ruleForm;

          this.$axios({
            url: "/accounts/register",
            data: props,
            method: "POST"
          }).then(res => {
            //注册成功并登陆，存储用户信息到本地
            this.$store.commit("user/setUserInfo", res.data);

            this.$message.success("注册成功，正在登陆...");
            setTimeout(() => {
              this.$router.push("/");
            }, 2000);
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.form {
  padding: 25px;
}

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
</style>

