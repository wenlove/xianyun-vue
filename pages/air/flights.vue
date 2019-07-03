<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters :data="cacheFlightsData" @setDataList="setDataList" />

        <!-- 航班头部布局 -->
        <FightsListHead />

        <!-- 航班信息 -->
        <div>
          <!-- 航班列表 -->
          <FlightsItem v-for="(item,index) in dataList" :key="index" :data="item" />

          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
        <FlightsAside />
      </div>
    </el-row>
  </section>
</template>

<script>
import moment from "moment";
import FightsListHead from "@/components/air/fightsListHead";
import FlightsItem from "@/components/air/flightsItem";
import FlightsFilters from "@/components/air/flightsFilters.vue";
import FlightsAside from "@/components/air/flightsAside.vue";

export default {
  components: {
    FightsListHead,
    FlightsItem,
    FlightsFilters,
    FlightsAside
  },
  data() {
    return {
      //航班总数据，可以用来修改的
      flightsData: {
        // 默认机票列表
        flights: [],
        info: {},
        options: {}
      },
      //一旦被赋值不会被修改的数据
      cacheFlightsData: {
        // 缓存一份数据，只会修改一次
        flights: [],
        info: {},
        options: {}
      },
      //航班列表数据,分页数据
      dataList: [],

      pageSize: 5, //默认显示条数
      pageIndex: 1, //默认显示第一页
      total: 0 //总条数
    };
  },
  methods: {
    //处理分页数据
    setDataList(arr) {
      if (arr) {
        this.pageIndex = 1;
        this.flightsData.flights = arr;
        this.total = arr.length;
      }

      const start = (this.pageIndex - 1) * this.pageSize;
      const end = this.pageIndex * this.pageSize;
      this.dataList = this.flightsData.flights.slice(start, end);
    },
    //请求机票列表数据
    getData() {
      this.$axios({
        url: "/airs",
        params: this.$route.query
      }).then(res => {
        // console.log(res);
        const { data } = res;

        if (res.status === 200) {
          this.flightsData = data;
          //总页数
          this.total = data.total;
          // 缓存一份新的列表数据数据，这个列表不会被修改
          // 而flightsData会被修改
          this.cacheFlightsData = { ...data };

          this.pageIndex=1;
          //获取分页数据
          this.setDataList();
        }
      });
    },

    //切换分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;

      this.setDataList();
    },
    //当前页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageIndex = val;
      this.setDataList();
    }
  },
  mounted() {
    //请求机票列表数据
    this.getData();
  },
  watch: {
    //监视路由改变
    $route(){
      this.getData();
    }
  },
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>