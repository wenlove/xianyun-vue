<template>
  <div class="container">
    <!-- 幻灯片 -->
    <el-carousel :interval="5000" arrow="always">
      <el-carousel-item
        v-for="(item,index) in banners"
        :key="index"
        :style="
        `background:url(${$axios.defaults.baseURL}${item.url}) center center no-repeat;
        background-size:contain contain;`
      "
        class="banner-img"
      ></el-carousel-item>
    </el-carousel>

    <!-- 搜索框 -->
    <div class="banner-content">
      <div class="search-bar">
        <!-- tab栏 -->
        <el-row type="flex" class="search-tab">
          <span v-for="(item,index) in options" 
          :key="index"
          :class="{active:currentOption==index}"
          @click="handleOption(index)">
            <i>{{item.name}}</i>
          </span>
        </el-row>

        <!-- 输入框 -->
        <el-row type="flex" align="middle" class="search-input">
          <input :placeholder="options[currentOption].placeholder"
          v-model="searchValue"
          @keyup.enter="handleSearch">
          <i class="el-icon-search" @click="handleSearch"></i>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 轮播图数据
      banners: [
        // {
        //   url: "http://157.122.54.189:9095/assets/images/th03.jfif"
        // },
        // {
        //   url: "http://157.122.54.189:9095/assets/images/th04.jfif"
        // }
      ],
      options: [
        // 搜索框tab选项
        {
          name: "攻略",
          placeholder: "搜索城市",
          pageUrl: "/post"
        },
        {
          name: "酒店",
          placeholder: "请输入城市搜索酒店",
          pageUrl: "/hotel"
        },
        {
          name: "机票",
          placeholder: "请输入出发地",
          pageUrl: "/air"
        }
      ],
      searchValue: "", // 搜索框的值
      currentOption: 0 // 当前选中的选项
    };
  },
  mounted() {
    this.$axios({
      url: "/scenics/banners"
    }).then(res => {
      let { data } = res.data;
      if (res.status === 200) {
        this.banners = data;
      }
    });
  },
  methods: {
    handleOption(index){
      // console.log(index);
      this.currentOption=index;
      if(index===2){
        this.$router.push('/air')
      }
    },
    //搜索
    handleSearch(){

    }
  }
};
</script>

<style scoped lang="less">
.container {
  min-width: 1000px;
  margin: 0 auto;
  position: relative;
  //deep用于穿透scoped
  /deep/ .el-carousel__container {
    height: 700px;
  }
  .banner-img {
    width: 100%;
    height: 100%;
  }
  .banner-content {
    position: absolute;
    left: 50%;
    margin-left: -500px;
    width: 1000px;
    top: 50%;
    z-index: 10;
    .search-bar {
      width: 552px;
      margin: 0 auto;
      .search-tab {
        .active {
          i {
            color: #333;
          }
          &:after {
            background: #eee;
          }
        }
        span {
          width: 82px;
          height: 36px;
          display: block;
          position: relative;
          margin-right: 8px;
          cursor: pointer;
          i {
            position: absolute;
            z-index: 11;
            display: block;
            width: 100%;
            height: 100%;
            line-height: 30px;
            text-align: center;
            color: #fff;
          }
          &:after {
            content: "";
            display: block;
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            border: 1px rgba(255, 255, 255, 0.2) solid;
            border-bottom: none;
            background: rgba(0, 0, 0, 0.5);
            box-sizing: border-box;
            transform: scale(1.1, 1.3) perspective(0.7em) rotateX(2.2deg);
            transform-origin: bottom left;
            border-radius: 1px 2px 0 0;
          }
        }
      }
      .search-input {
        width: 100%;
        height: 46px;
        line-height: 46px;
        border-radius: 0 4px 4px 4px;
        background-color: #fff;
        input {
          flex: 1;
          height: 100%;
          padding-left: 15px;
        }
        .el-icon-search {
          cursor: pointer;
          font-size: 22px;
          padding: 12px 10px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>