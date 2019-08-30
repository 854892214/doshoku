<template>
    <div>
        <home-header v-show="!isGetData"></home-header>
        <div v-if="isGetData">
            <header class="mui-bar mui-bar-nav">
                <h1 class="mui-title">账单详情</h1>
                <span class="float-right nav-bar-btn">桌号:{{this.$store.getters.getTableName}}</span>
            </header>
            <div class="mui-content">
                <div class="tips"><span class="icon-success"><i
                        class="mui-icon mui-icon-checkmarkempty"></i></span><span class="text">您的菜品已经下单成功</span></div>
                <div class="info">
                    <div class="title">订单详情</div>
                    <div class="goods-cell">
                        <div class="goods-item" v-for="goods of goodsList">
                            <div class="group-name">
                                <p class="name">{{goods.name}}</p>
                                <p class="spec-list">
                                    <span v-for="(itemSpec,i) of goods.specificationInfoList" :key="i"> {{(i==0?'':'/')+itemSpec.name}}</span>
                                    <span v-if="!(goods.remark === '' || goods.remark ==null)">{{goods.specificationInfoList && goods.specificationInfoList.length > 0 ? '/'+goods.remark : goods.remark}}</span>
                                </p>
                            </div>
                            <div class="group-count">x{{goods.quantity}}</div>
                            <div class="group-amount">${{goods.amount.toFixed(2)}}</div>
                        </div>
                    </div>
                    <div class="subtotal">
                        <div class="total">小计：<span class="price">${{total.toFixed(2)}}</span></div>
                        <div class="total" v-if="discountAmount > 0">优惠金额({{this.$store.getters.getDiscount *
                            10}}折)：<span class="price">${{discountAmount.toFixed(2)}}</span></div>
                        <div class="total" v-if="discountAmount > 0">实际金额：<span class="price">${{afterDiscountTotal.toFixed(2)}}</span>
                        </div>
                    </div>
                </div>
                <div class="order-info">
                    <div class="title">订单信息</div>
                    <div class="info-cell">
                        <div class="info-item">
                            <p>下单时间</p>
                            <p>
                                {{common.toTimeZone(goodsOrderInfo.updatetime,'UTC',this.$store.getters.getTimeZone)}}</p>
                        </div>
                        <div class="info-item">
                            <p>人数</p>
                            <p>{{goodsOrderInfo.person_num}}人</p>
                        </div>
                        <div class="info-item">
                            <p>下单号</p>
                            <p>{{goodsOrderInfo.pick_no}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <div class="text">合计<span class="price">${{afterDiscountTotal.toFixed(2)}}</span></div>
                <div class="btn">
                    <div class="add-order" @click="clickAddOrder">加单</div>
                    <div class="check-payment" @click="checkPayment">买单</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import HomeHeader from "@/components/transition/trans";
    import {MessageBox, Indicator, Toast} from "mint-ui";

    export default {
        name: "home",
        components: {
            HomeHeader
        },
        data() {
            return {
                isGetData: false,
                //商品数据
                goodsList: [],
                //订单数据
                goodsOrderInfo: {},
                //小计
                total: 0,
                //优惠金额
                discountAmount: 0,
                //折后金额
                afterDiscountTotal: 0
            };
        },
        methods: {
            //加单
            clickAddOrder() {
                this.isGetData = false;
                this.$store.commit("shopCartList", JSON.stringify([]));
                this.axios.get(this.common.baseURL + "mobi/goodsorder/one?num=" + this.$store.getters.getOrderNum).then(result => {
                    if (result.data.goodsOrder.paystatus == 0) {
                        this.$router.replace("/order");
                    } else {
                        this.$router.replace("/home");
                    }
                });
            },
            //买单
            checkPayment() {
                this.$store.commit("orderGoodsList", JSON.stringify({
                    "goodsList": this.goodsList,
                    "personNum": this.goodsOrderInfo.person_num
                }));
                this.$router.replace("/bill");
            }
        },
        created() {
            if (this.$store.getters.getOrderNum == "" || this.$store.getters.getOrderNum == null) {
                MessageBox.alert("非法访问").then(action => {
                    if (this.common.is_weixin()) {
                        this.common.closeWx();
                    } else if (this.common.is_alipay()) {
                        this.common.closeAli();
                    } else {
                        history.back();
                    }
                });
                return;
            }
            this.axios.get(this.common.baseURL + "mobi/goodsorder/one?num=" + this.$store.getters.getOrderNum).then(result => {
                if (result.data.result_code == "ok" && result.data.result_msg == "SUCCESS") {
                    this.goodsOrderInfo = result.data.goodsOrder;
                    if (result.data.goodsOrder.hasOwnProperty('deduction_integral')) {
                        this.$store.commit("deductionIntegral", result.data.goodsOrder.deduction_integral)
                    }
                    if (result.data.goodsOrder.paystatus == 0) {
                        for (let item of result.data.goodsOrder.goodsOrderInfoList) {
                            if (item.type == 0) {
                                if (item.reduced_quantity > 0) {
                                    let quantity = item.quantity - item.reduced_quantity; //当前商品数量 购买数量 - 减菜数量
                                    if (quantity > 0) {
                                        let goodsTotalAmount = this.common.round(item.univalent * quantity, 2);
                                        if (item.specificationInfoList && item.specificationInfoList.length > 0) {
                                            for (let specificationInfo of item.specificationInfoList) {
                                                if (specificationInfo.amount != "") {
                                                    goodsTotalAmount = goodsTotalAmount + this.common.round(specificationInfo.amount * quantity, 2)
                                                }
                                            }
                                        }
                                        item.quantity = quantity;
                                        item.total_amount = goodsTotalAmount;
                                        item.amount = goodsTotalAmount;
                                        this.goodsList.push(item)
                                    }
                                } else {
                                    this.goodsList.push(item);
                                }
                            }
                        }
                        this.total = this.goodsOrderInfo.goods_total_amount;
                        this.discountAmount = this.total - this.common.round(this.total * this.$store.getters.getDiscount, 2);
                        this.afterDiscountTotal = this.total - this.discountAmount;
                        this.isGetData = true;
                    } else {
                        this.$router.replace("/home");
                    }
                }
                else {
                    MessageBox.alert('系统错误!!').then(result=>{
                        this.$router.replace('/home')
                    })
                }
            });
        },
        mounted: function () {
        },
        computed: {},
        watch: {
            // 如果路由有变化，会再次执行该方法
            $route: {
                handler: function () {
                }
            }
        }
    };
</script>

<style scoped>
    .mui-content {
        position: relative;
        color: #333;
        background-image: linear-gradient(0deg, #efeff4, #efeff4 65%, hsla(0, 0%, 96%, .3) 75%, hsla(0, 0%, 96%, 0)), linear-gradient(270deg, #ed5b5b, #f16f6f);
        padding: 44px 5% 60px 5%;
        font-size: 14px;
    }

    .mui-content .tips {
        text-align: center;
        padding: 1.5rem 0rem;
        color: #fff;
        font-weight: 600;
    }

    .mui-content .tips .icon-success {
        line-height: 25px;
        width: 25px;
        height: 25px;
        display: inline-block;
        text-align: center;
        background-color: rgba(237, 91, 91, 1);
        border: 1px solid #ffffff;
        border-radius: 12.5px;
        background-clip: padding-box;
    }

    .mui-content .tips .icon-success .mui-icon {
        font-weight: 600;
    }

    .mui-content .tips .text {
        position: relative;
        top: -0.1rem;
        left: .5rem;
    }

    .mui-content .info {
        background: #ffffff;
        border-radius: 5px;
        padding: 1rem 5%;
    }

    .mui-content .info .title {
        width: 100%;
        display: flex;
        justify-content: space-between;
        -webkit-align-items: center;
        align-items: center;
        padding-bottom: 1rem;
        border-bottom: 1px dashed #ece4e4;
        margin-bottom: 1rem;
        font-weight: bold;
    }

    .mui-content .info .goods-cell {
        width: 100%;
        position: relative;
        overflow: hidden;
        margin-bottom: 1rem;
        border-bottom: 1px dashed #ece4e4;
    }

    .mui-content .info .goods-cell .goods-item {
        display: flex;
        align-items: center;
        width: 100%;
        padding-bottom: 1rem;
    }

    .mui-content .info .goods-cell .goods-item .group-name {
        overflow: hidden;
        -webkit-box-flex: 6;
        flex: 6;
    }

    .mui-content .info .goods-cell .goods-item .group-name .name {
        color: #000;
        margin: 0;
        font-weight: 600;
    }

    .mui-content .info .goods-cell .goods-item .group-name .spec-list {
        margin: 0;
    }

    .mui-content .info .goods-cell .goods-item .group-name .spec-list span {
        font-size: 12px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
    }

    .mui-content .info .goods-cell .goods-item .group-count {
        -webkit-box-flex: 1;
        flex: 1;
        text-align: right;
    }

    .mui-content .info .goods-cell .goods-item .group-amount {
        -webkit-box-flex: 3;
        flex: 3;
        text-align: right;
        font-size: 16px;
        color: #ED5B5B;
    }

    .mui-content .info .subtotal {
        text-align: right;
        width: 100%;
        position: relative;
    }

    .mui-content .info .subtotal .total {
        padding-bottom: 5px;
    }

    .mui-content .info .subtotal .total .price {
        color: rgba(237, 91, 91, 1);
        font-size: 16px;
        font-weight: 600;
    }

    .mui-content .order-info {
        background: #ffffff;
        border-radius: 5px;
        padding: 1rem 5%;
        margin-top: 1.5rem;
    }

    .mui-content .order-info .title {
        width: 100%;
        display: flex;
        justify-content: space-between;
        -webkit-align-items: center;
        align-items: center;
        padding-bottom: 1rem;
        border-bottom: 1px dashed #ece4e4;
        font-weight: bold;
    }

    .mui-content .order-info .info-cell {
        padding-top: .8rem;
    }

    .mui-content .order-info .info-cell .info-item {
        display: flex;
        justify-content: space-between;
        -webkit-align-items: center;
        align-items: center;
        padding-bottom: .8rem;
    }

    .mui-content .order-info .info-cell .info-item p {
        margin: 0;
    }

    .footer {
        position: fixed;
        bottom: 0;
        background: #ffffff;
        height: 50px;
        line-height: 50px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        -webkit-align-items: center;
        align-items: center;
        padding: 0 .8rem;
        font-size: 14px;
    }

    .footer .price {
        font-size: 18px;
        color: rgba(237, 91, 91, 1);
        padding-left: 5px;
    }

    .footer .text {
        width: 40%;
    }

    .footer .btn {
        width: 60%;
    }

    .footer .btn .add-order {
        color: #fff;
        background: rgba(255, 185, 80, 1);
        border-radius: 18px;
        width: 45%;
        height: 36px;
        line-height: 36px;
        box-shadow: 0px 0px 3px 0px rgba(255, 185, 80, 1);
        text-align: center;
        float: left;
        margin-right: 10%;
    }

    .footer .btn .check-payment {
        color: #fff;
        background: #ed5b5b;
        border-radius: 18px;
        width: 45%;
        height: 36px;
        line-height: 36px;
        box-shadow: 0px 0px 3px 0px red;
        text-align: center;
        float: left;
    }

</style>
