<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <el-form class="search-form-content" ref="form" label-width="80px">
      <el-form-item label="出发城市">
        <!-- fetch-suggestions: 每次输入时候都会执行，设置下拉菜单的数据 -->
        <!-- select：选中下拉菜单的值时候触发 -->
        <el-autocomplete
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @select="handleDepartSelect"
          class="el-autocomplete"
          v-model="form.departCity"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="到达城市">
        <el-autocomplete
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          @select="handleDestSelect"
          class="el-autocomplete"
          v-model="form.destCity"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="出发时间">
        <!-- type:声明选中器是日期的选择器 -->
        <!-- change: 选中日期时候触发的事件 -->
        <el-date-picker
          type="date"
          placeholder="请选择日期"
          style="width: 100%;"
          @change="handleDate"
          v-model="form.departDate"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">搜索</el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
// 导入momentjs
import moment from "moment";

export default {
  data() {
    return {
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      currentTab: 0,

      // 表单的数据，提交到下一个页面
      form: {
        departCity: "",
        departCode: "",
        destCity: "",
        destCode: "",
        departDate: ""
      }
    };
  },
  methods: {
    //获取城市
    getCity(value, callback, select) {
      if (!value) {
        return;
      }

      this.$axios({
        url: "/airs/city?name=" + value,
        method: "GET"
      }).then(res => {
        //   console.log(res)
        const { data } = res.data;
        const newData = data.map(v => {
          return {
            ...v,
            value: v.name.replace("市", "")
          };
        });

        switch (select) {
          case "depart":
            this.form.departCity = newData[0].value;
            this.form.departCode = newData[0].sort;
            break;
          case "dest":
            this.form.destCity = newData[0].value;
            this.form.destCode = newData[0].sort;
            break;
          default:
            break;
        }

        callback(newData);
      });
    },
    // tab切换时触发
    handleSearchTab(item, index) {
      // this.currentTab = index;
      if (index === 1) {
        this.$confirm("目前暂不支持往返", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false, //是否显示取消按钮
          type: "warning"
        });
      }
    },

    // 出发城市输入框获得焦点时触发
    // value是输入框的值
    // callback调用时候需要传入数组，这个数组就是下拉列表的数据
    queryDepartSearch(value, callback) {
      this.getCity(value, callback, "depart");
    },

    // 目标城市输入框获得焦点时触发
    // value 是输入框的值，callback是回调函数，接收要展示的列表
    queryDestSearch(value, callback) {
      this.getCity(value, callback, "dest");
    },

    // 出发城市下拉选择时触发
    handleDepartSelect(item) {
      this.form.departCity = item.value;
      this.form.departCode = item.sort;
    },

    // 目标城市下拉选择时触发
    handleDestSelect(item) {
      this.form.destCity = item.value;
      this.form.destCode = item.sort;
    },

    // 确认选择日期时触发
    handleDate(value) {
      // console.log(value)
      this.form.departDate = moment(value).format("YYYY-MM-DD");
    },

    // 触发和目标城市切换时触发
    handleReverse() {
      const { departCity, departCode, destCity, destCode } = this.form;

      //
      this.form.departCity = destCity;
      this.form.departCode = destCode;

      this.form.destCity = departCity;
      this.form.destCode = departCode;
    },

    // 提交表单是触发
    handleSubmit() {
      const rules = {
        //出发城市数据
        depart: {
          value: this.form.departCity,
          message: "请输入出发城市"
        },
        dest: {
          value: this.form.destCity,
          message: "请输入目的城市"
        },
        departDate: {
          value: this.form.departDate,
          message: "请输入出发日期"
        }
      };

      // 设置开关
      let flag = true;

      Object.keys(rules).forEach(v => {
        if (!flag) return;

        if (!rules[v].value) {
          this.$message.warning(rules[v].message);
          flag = false;
        }
      });

      //判断是否为空
      if (!flag) {
        return;
      }

      //跳转到机票列表页
      this.$router.push({
        path: "/air/flights",
        query: this.form
      });

      //存储到本地
      let arr = JSON.parse(localStorage.getItem("airs") || `[]`);
      arr.unshift(this.form);
      localStorage.setItem("airs", JSON.stringify(arr));
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
    cursor: pointer;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>
