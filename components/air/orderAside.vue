<template>
  <div class="aside">
    <div class="air-info">
      <el-row type="flex" justify="space-between" class="info-top">
        <div>{{data.dep_date}}</div>
        <div>{{data.org_city_name}} - {{data.dst_city_name}}</div>
      </el-row>
      <el-row type="flex" justify="space-between" align="middle" class="info-step">
        <el-col :span="5" class="flight-airport">
          <strong>{{data.dep_time}}</strong>
          <span>{{data.org_airport_name}}{{data.org_airport_quay}}</span>
        </el-col>
        <el-col :span="14" class="flight-time">
          <span>--- {{rankTime}} ---</span>
          <span>{{data.airline_name}}{{data.flight_no}}</span>
        </el-col>
        <el-col :span="5" class="flight-airport">
          <strong>{{data.arr_time}}</strong>
          <span>浦东机场T2</span>
        </el-col>
      </el-row>
    </div>
    <el-row type="flex" justify="space-between" class="info-bar">
      <span>订单总价</span>
      <span>金额</span>
      <span>数量</span>
    </el-row>
    <el-row type="flex" justify="space-between" class="info-bar">
      <span>成人机票</span>
      <span>￥{{data.seat_infos.org_settle_price}}</span>
      <span>{{num}}</span>
    </el-row>
    <el-row type="flex" justify="space-between" class="info-bar">
      <span>机建＋燃油</span>
      <span>¥{{data.airport_tax_audlet}}/人/单程</span>
      <span>{{num}}</span>
    </el-row>
    <el-row type="flex" justify="space-between" align="middle" class="info-bar">
      <span>应付总额：</span>
      <span class="price">￥{{allPrice}}</span>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: {}
    },
    allPrice: {
      type: Number,
      default: 0
    },
    num: {
      type: Number,
      default: 0
    }
  },

  computed: {
    rankTime() {
      // 数据还未请求回来
      if (!this.data.dep_time) return "";

      const { dep_time, arr_time } = this.data;
      let arr = arr_time.split(":"); //到达时间
      const dep = dep_time.split(":"); //出发时间

      //判断是否过来凌晨
      if (arr[0] < dep[0]) {
        arr[0] += 24;
      }

      const count = arr[0] * 60 + +arr[1] - (dep[0] * 60 + +dep[1]);

      const hours = Math.floor(count / 60);
      const minutes = count % 60;

      return `${hours}时${minutes}分`;
    }
  }
};
</script>

<style scoped lang="less">
/*aside*/
.aside {
  width: 350px;
  height: fit-content;
  border: 1px #ddd solid;
}

.air-info {
  padding: 15px;

  .info-top {
    margin-bottom: 10px;
    > div:last-child {
      font-size: 14px;
    }
  }

  .info-step {
    .flight-airport {
      strong {
        display: block;
        font-size: 22px;
        font-weight: normal;
      }

      span {
        font-size: 12px;
        color: #999;
      }
    }

    .flight-time {
      text-align: center;
      font-size: 12px;
      color: #999;
      span {
        display: block;
      }
    }
  }
}

.info-bar {
  border-top: 1px #ddd dashed;
  padding: 10px 15px;
  font-size: 14px;
  color: #666;

  .price {
    font-size: 28px;
    color: orange;
  }
}
</style>