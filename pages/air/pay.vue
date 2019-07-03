<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥ {{price}}</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row type="flex" justify="space-between" align="middle" class="pay-qrcode">
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas id="qrcode-stage"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
// 生成二维码的包
import QRCode from "qrcode";

export default {
  data() {
    return {
      price: 0,
      timer: null
    };
  },
  mounted() {
    //添加定时器，确保本地的store的赋值
    setTimeout(() => {
      const { id } = this.$route.query;
      const { token } = this.$store.state.user.userInfo;

      //请求订单详情
      this.$axios({
        url: `/airorders/${id}`,
        headers: {
          Authorization: `bearer ${token}`
        }
      }).then(res => {
        const { payInfo, price } = res.data;

        //生成二维码
        const stage = document.querySelector("#qrcode-stage");
        //第一个参数是canva的dom对象，第二个参数是二维码的链接，第三个是宽高的配置
        QRCode.toCanvas(stage, payInfo.code_url, {
          width: 200
        });
        this.price = price;

        //支付轮询
        this.timer = setInterval(async() => {
            const isResolve = await this.isPay(payInfo);
            console.log(isResolve)
            if(isResolve){
                clearInterval(this.timer);
                return;
            }
        }, 3000);
      });
    }, 10);
  },
  //销毁时清除定时器
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    // 检查付款状态
    async isPay(data) {
      const { id } = this.$route.query;
      const { token } = this.$store.state.user.userInfo;

      return this.$axios({
        url: `/airorders/checkpay`,
        method: "POST",
        data: {
          id,
          nonce_str: data.nonce_str,
          out_trade_no: data.order_no
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => {
        const { statusTxt } = res.data;

        if (statusTxt === "支付完成") {
          this.$confirm("订单支付成功", "提示", {
            confirmButtonText: "确定",
            showCancelButton: false,
            type: "success"
          });

          return Promise.resolve(true);
        }

        return Promise.resolve(false);
      });
    }
  }
};
</script>

<style scoped lang="less">
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>