<template>
    <div>
        <home-header v-show="!isGetData"></home-header>
        <div v-if="isGetData">
            <header class="mui-bar mui-bar-nav">
                <h1 class="mui-title">结账单</h1>
            </header>
            <div class="mui-content">
                <div class="info">
                    <div class="total-amount">${{goodsOrderInfo.amount.toFixed(2)}}</div>
                    <div class="desk-no">桌号:{{goodsOrderInfo.desk_no}}</div>
                    <div class="goods-header">
                        <div class="name">菜名</div>
                        <div class="count">数量</div>
                        <div class="price">价格</div>
                    </div>
                    <div class="goods-item" v-for="goods of goodsList">
                        <div class="group-name">
                            <p class="name">{{goods.name}}</p>
                            <p class="spec-list">
                                <span v-for="(itemSpec,i) of goods.specificationInfoList" :key="i"> {{(i==0?'':'/')+itemSpec.name}}</span>
                                <span>{{goods.specificationInfoList && goods.specificationInfoList.length > 0 ? '/'+goods.remark : goods.remark}}</span>
                            </p>
                        </div>
                        <div class="group-count">x{{goods.quantity}}</div>
                        <div class="group-amount">${{goods.amount.toFixed(2)}}</div>
                    </div>
                    <div class="cost-info">
                        <div class="item">
                            <p>小计</p>
                            <p class="subtotal">${{goodsOrderInfo.goods_total_amount.toFixed(2)}}</p>
                        </div>
                        <div class="item" v-if="goodsOrderInfo.discount_amount > 0">
                            <p>折扣金额({{goodsOrderInfo.discount * 10}}折)</p>
                            <p>-${{goodsOrderInfo.discount_amount.toFixed(2)}}</p>
                        </div>
                        <div class="item" v-if="goodsOrderInfo.is_tax === 'TRUE'">
                            <p>税费</p>
                            <p class="">${{goodsOrderInfo.tax.toFixed(2)}}</p>
                        </div>
                        <div class="item" v-if="goodsOrderInfo.is_tip === 'TRUE'">
                            <p>小费</p>
                            <p class="">${{goodsOrderInfo.tip.toFixed(2)}}</p>
                        </div>
                    </div>
                    <div class="total">合计：<span class="price">${{goodsOrderInfo.amount.toFixed(2)}}</span></div>
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
                            <p>支付时间</p>
                            <p>{{common.toTimeZone(goodsOrderInfo.paytime,'UTC',this.$store.getters.getTimeZone)}}</p>
                        </div>
                        <div class="info-item">
                            <p>人数</p>
                            <p>{{goodsOrderInfo.person_num}}人</p>
                        </div>
                        <div class="info-item">
                            <p>下单号</p>
                            <p>{{goodsOrderInfo.pick_no}}</p>
                        </div>
                        <div class="info-item">
                            <p></p>
                            <p class="item-btn" @click="showReceipt" v-if="this.goodsOrderInfo.paystatus!==0">查看收据</p>
                        </div>
                    </div>
                </div>
                <div class="add-order" @click="jump">继续点餐</div>
            </div>
        </div>
        <mt-popup v-model="receipt" popup-transition="popup-fade" class="mintui-popup">
            <p class="receipt-title">选择收据</p>
            <div class="receipt-box">
                <div class="receipt-item" @click="chooseReceipt('NO')">
                    <div class="no-receipt-icon icon"></div>
                    <p class="receipt-desc">无收据</p>
                </div>
                <div class="receipt-item" @click="chooseReceipt('PAPER')">
                    <div class="paper-receipt-icon icon"></div>
                    <p class="receipt-desc">纸质收据</p>
                </div>
                <div class="receipt-item" @click="chooseReceipt('EMAIL')">
                    <div class="email-receipt-icon icon"></div>
                    <p class="receipt-desc">邮件</p>
                </div>
                <div class="receipt-item" @click="chooseReceipt('TEXT')">
                    <div class="text-receipt-icon icon"></div>
                    <p class="receipt-desc">发送文本</p>
                </div>
            </div>
        </mt-popup>
        <mt-popup v-model="messageBoxPhone" popup-transition="popup-fade" class="mintui-popup">
            <div class="mint-msgbox" style="">
                <div class="mint-msgbox-header">
                    <div class="mint-msgbox-title">提示</div>
                </div>
                <div class="mint-msgbox-content">
                    <div class="mint-msgbox-message">请输入您的电话</div>
                    <div class="mint-msgbox-input">
                        <div class="drop-down-icon"></div>
                        <select class="select-wrapper" v-model="countryCode">
                            <option value="1">1+</option>
                            <option value="86">86+</option>
                        </select>
                        <input type="number" class="mui-input-clear phone-input" v-model="phone"
                               placeholder="请填写您的手机号" oninput="if(value.length>11)value=value.slice(0,11)">
                        <div class="mint-msgbox-errormsg" style="visibility: hidden;"></div>
                    </div>
                </div>
                <div class="mint-msgbox-btns">
                    <button class="mint-msgbox-btn mint-msgbox-cancel " @click="phoneConfirm('cancel')">取消</button>
                    <button class="mint-msgbox-btn mint-msgbox-confirm " @click="phoneConfirm('confirm')">确定</button>
                </div>
            </div>
        </mt-popup>
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
                //用于判断数据是否获取到
                isGetData: false,
                //商品数据
                goodsList: [],
                //订单数据
                goodsOrderInfo: {},
                //合计金额
                totalAmount: 0,
                //收据弹窗
                receipt: false,
                //电话弹窗
                messageBoxPhone: false,
                //国家码
                countryCode: "",
                //一分钟不可重复发送电话
                taskEndTime:60,
                //无法点击电话弹框确认
                phoneDisable:true,
                phone:""
            };
        },
        methods: {
            jump() {
                this.$router.replace("/home");
            },
            init() {
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
                let task = setInterval(() => {
                    this.axios.get(this.common.baseURL + "mobi/goodsorder/one?num=" + this.$store.getters.getOrderNum).then(result => {
                        if (result.data.result_code == "ok" && result.data.result_msg == "SUCCESS") {
                            // result.data.goodsOrder.paystatus=1
                            if (result.data.goodsOrder.paystatus == 1 || result.data.goodsOrder.paystatus == 2 || result.data.goodsOrder.paystatus == 4) {
                                clearInterval(task);
                                this.goodsList = [];
                                this.goodsOrderInfo = result.data.goodsOrder;
                                console.log(this.goodsOrderInfo)
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
                                this.isGetData = true;
                            } else if (result.data.goodsOrder.paystatus == 3) {
                                MessageBox.alert("当前订单已被取消").then(action => {
                                    if (this.common.is_weixin()) {
                                        this.common.closeWx();
                                    } else if (this.common.is_alipay()) {
                                        this.common.closeAli();
                                    } else {
                                        history.back();
                                    }
                                });
                            }
                        } else {
                            MessageBox.alert("订单查询失败").then(action => {
                                if (this.common.is_weixin()) {
                                    this.common.closeWx();
                                } else if (this.common.is_alipay()) {
                                    this.common.closeAli();
                                } else {
                                    history.back();
                                }
                            });
                        }
                    });
                }, 3000)

            },
            //选择票据
            chooseReceipt(value) {
                if (value == "NO") {//无收据
                    console.log(value)
                    this.receipt=false
                } else if (value == "PAPER") {//纸质收据
                    console.log(value)
                    MessageBox.alert("请找门店服务员索要收据").then(result=>{
                        this.receipt=false
                    })
                } else if (value == "EMAIL") {
                    MessageBox.prompt('请输入您的邮箱').then(({value, action}) => {//邮箱收据
                        if (action == "confirm") {
                            Indicator.open('请稍等...');
                            this.receipt=false
                            var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                                if (reg.test(value)) {
                                    let url=this.common.baseURL+"/mobi/goodsorder/send/receipt?goods_order_id="+this.goodsOrderInfo.id+"&send_type=0"
                                    console.log(url)
                                    this.axios.post(url,{//receipt
                                        email:value
                                    }).then(result=>{
                                        Indicator.close();
                                        console.log(result)
                                        if(result.data.result_code=="ok"&&result.data.result_msg=="SUCCESS"){
                                            MessageBox.alert('发送成功!').then(result=>{
                                                Indicator.close();
                                            })
                                        }else{
                                            MessageBox.alert('发送失败,请稍后再试!').then(result=>{
                                                Indicator.close();
                                            })
                                        }
                                    })
                                } else {
                                    Indicator.close();
                                    MessageBox.alert('请输入合法的邮箱').then(result=>{
                                        Indicator.close();
                                    })
                                }
                        }
                    });
                } else if (value == "TEXT") {
                    this.messageBoxPhone = true
                }
            },
            //输入电话 Message按钮的按钮事件
            phoneConfirm(value) {
                if (value == "cancel") {
                    this.messageBoxPhone = false
                }
                if (value == "confirm") {
                    if(this.taskEndTime!=60){
                        MessageBox.alert('请于'+this.taskEndTime+"后重试")
                        return
                    }
                    if(this.phoneDisable==true){
                        this.phoneDisable=false
                        let TaskTime = setInterval(()=>{
                            this.taskEndTime--
                            if(this.taskEndTime<=0){
                                this.phoneDisable=true
                                this.taskEndTime=60
                                clearInterval(TaskTime)
                            }
                        },1000)
                    }
                    this.phoneDisable=true
                    let countrycode=$('.select-wrapper').val()
                    this.receipt=false
                    this.messageBoxPhone=false

                    let value = $('.mint-msgbox-input>input').val()
                    if (this.phone === "" || this.phone == null) {
                        MessageBox.alert("请输入手机号码");
                        return false;
                    }
                    if (this.countryCode === "") {
                        MessageBox.alert("请选择国家码")
                        return false;
                    }
                    if (this.phone === "") {
                        MessageBox.alert("请输入手机号")
                        return false;
                    }
                    if (!(/^1[34578]\d{9}$/.test(this.phone)) && this.countryCode === "86") {
                        MessageBox.alert("请输入正确手机号码");
                        return false;
                    }
                    if (this.countryCode === "1" && this.phone.length <= 5) {
                        MessageBox.alert("请输入正确手机号码");
                        return false;
                    }
                    console.log(countrycode,this.phone)
                    //this.$store.getters.getGoodsOrderId
                    Indicator.open({
                        text: '请稍后...',
                        spinnerType: 'fading-circle'
                    });
                    //route/
                    let url=this.common.baseURL+"mobi/goodsorder/send/receipt?goods_order_id="+this.goodsOrderInfo.id+"&send_type=1&countrycode="+countrycode
                    this.axios.post(url,{
                        mobile:this.phone
                    }).then(result=>{//待完成...
                        console.log(result)
                        Indicator.close();
                        if(result.data.result_code=="error"&&result.data.result_msg=="ORDER_NOT_EXIST"){
                            MessageBox.alert("订单不存在,请确认订单已经支付完成!")
                            return
                        }else if(result.data.result_code=="ok"&&result.data.result_msg=="SUCCESS"){
                            MessageBox.alert("发送成功!")
                        }
                    })
                }
            },
            //显示收据弹框
            showReceipt(){
                this.receipt=true
            }
        },
        created() {
            this.init()
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
        padding: 44px 5% 1.5rem 5%;
        font-size: 14px;
    }

    .mui-content .info {
        background: #ffffff;
        border-radius: 5px;
        padding: 5%;
        margin-top: 1.5rem;
    }

    .mui-content .info .total-amount {
        font-size: 24px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(237, 91, 91, 1);
        text-align: center;
    }

    .mui-content .info .desk-no {
        text-align: center;
        padding: 1rem;
        font-size: 16px;
    }

    .mui-content .info .goods-header {
        display: flex;
        align-items: center;
        width: 100%;
        border-bottom: 1px dashed #ece4e4;
        padding: 10px 0px;
        margin-bottom: 10px;

    }

    .mui-content .info .goods-header .name {
        overflow: hidden;
        -webkit-box-flex: 6;
        flex: 6;
        color: rgba(153, 153, 153, 1) !important;
    }

    .mui-content .info .goods-header .count {
        overflow: hidden;
        -webkit-box-flex: 1.5;
        flex: 1.5;
        text-align: center;
        color: rgba(153, 153, 153, 1) !important;
    }

    .mui-content .info .goods-header .price {
        overflow: hidden;
        -webkit-box-flex: 2.5;
        flex: 3;
        text-align: right;
        color: rgba(153, 153, 153, 1) !important;
    }

    .mui-content .info .goods-item {
        display: flex;
        align-items: center;
        width: 100%;
        padding-bottom: 1rem;
    }

    .mui-content .info .goods-item .group-name {
        overflow: hidden;
        -webkit-box-flex: 6;
        flex: 6;
    }

    .mui-content .info .goods-item .group-name .name {
        color: rgba(51, 51, 51, 1);;
        margin: 0;
    }

    .mui-content .info .goods-item .group-name .spec-list {
        margin: 0;
    }

    .mui-content .info .goods-item .group-name .spec-list span {
        font-size: 12px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
    }

    .mui-content .info .goods-item .group-count {
        -webkit-box-flex: 1;
        flex: 1;
        text-align: right;
    }

    .mui-content .info .goods-item .group-amount {
        -webkit-box-flex: 3;
        flex: 3;
        text-align: right;
        color: #ED5B5B;
    }

    .mui-content .info .cost-info {
        border-top: 1px dashed #ece4e4;
        border-bottom: 1px dashed #ece4e4;
    }

    .mui-content .info .cost-info .item {
        display: flex;
        justify-content: space-between;
        -webkit-align-items: center;
        align-items: center;
        padding: 10px 0px;
    }

    .mui-content .info .cost-info .item p {
        color: #000;
        font-size: 14px;
        margin: 0;
    }

    .mui-content .info .total {
        text-align: right;
        font-size: 14px;
        font-weight: 600;
        padding-top: 1rem;
    }

    .mui-content .info .total .price {
        color: rgba(237, 91, 91, 1);
        font-size: 18px;
    }

    .mui-content .order-info {
        background: #ffffff;
        border-radius: 5px;
        margin-top: 1.5rem;
        padding: 1rem 5%;
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
        color: rgba(51, 51, 51, 1);
    }

    .mui-content .order-info .info-cell .info-item:last-child {
        padding: 0;
    }

    .add-order {
        background: #ed5b5b;
        width: 100%;
        height: 50px;
        line-height: 50px;
        border-radius: 5px;
        text-align: center;
        color: #fff;
        font-size: 16px;
        margin-top: 1.5rem;
    }

    .phone-input {
        border-radius: 0;
    }

    .mint-msgbox-input {
        display: flex;
        position: relative;
    }

    .select-wrapper {
        width: 30%;
        margin-bottom: 0;
        direction: rtl;
        border: 1px solid #c8c7cc !important;
        border-right: 0px !important;
        padding-right: 10px;
        height: 40px;
        float: left;
        border-radius: 0;
        margin-top: 0;
    }

    .icon {
        width: 35px;
        height: 35px;
        background-size: 100%;
        background-repeat: no-repeat;
    }

    .drop-down-icon {
        background-image: url("../../assets/img/dropDown.png");
        width: 15px;
        height: 15px;
        background-size: 100%;
        background-repeat: no-repeat;
        position: absolute;
        left: 4%;
        top: 40%;
    }

    @media screen and (max-width: 320px) {
        .drop-down-icon {
            left: 2% !important;
        }
    }

    .no-receipt-icon {
        background-image: url("../../assets/img/ban.png");
    }

    .paper-receipt-icon {
        background-image: url("../../assets/img/paperReceipt.png");
    }

    .email-receipt-icon {
        background-image: url("../../assets/img/email.png");
    }

    .text-receipt-icon {
        background-image: url("../../assets/img/mobile.png");
    }

    .mintui-popup > p {
        text-align: center;
        margin: 0;
        line-height: 35px;
        font-size: 1rem;
        color: black;
        padding: .8rem;
    }

    .mintui-popup {
        width: 90%;
        background-color: #ffffff;
        border-radius: 5px;
    }

    .receipt-box {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;
    }

    .receipt-item {
        width: 45%;
        height: 80px;
        border: 1px solid white;
        background: #ffffff;
        border-radius: 5px;
        margin-bottom: 1rem;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0 5px 1px #ccc;
    }

    .receipt-item > p {
        margin: 0;
        position: relative;
        top: .5rem;
        color: #403f3f;
    }

    .cancel-order-box {
        padding-top: .8rem;
        border-top: 1px solid #e2dddd;
        display: flex;
        flex-flow: row-reverse nowrap;
        justify-content: space-between;
    }

    .cancel-order {
        display: inline-block;
        padding: .3rem;
        box-shadow: 0 0 4px 1px #cccccc;
        border-radius: 5px;
    }
    .item-btn{
        padding: 5px;
        box-shadow: 0 0 1px 1px #ccc;
        border-radius: 3px;
    }
</style>
