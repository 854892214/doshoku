<template>
    <div id="tip-content">

        <div class="fee-info">
            <div class="fee-itme">
                <div class="fee-title">
                    <p v-if="this.$store.getters.getIsTax === 'TRUE'">税前金额:</p>
                    <p v-if="this.$store.getters.getIsTax === 'TRUE'">税费({{this.$store.getters.getTaxRate * 100}}%):</p>
                </div>
                <div class="fee-number">
                    <p v-if="this.$store.getters.getIsTax === 'TRUE'">${{parseFloat(price).toFixed(2)}}</p>
                    <p v-if="this.$store.getters.getIsTax === 'TRUE'">${{taxAmount.toFixed(2)}}</p>
                </div>
            </div>
            <div class="amount">${{totalAmount.toFixed(2)}}</div>
        </div>
        <div class="title">添加小费</div>
        <div class="tip-cell">
            <div class="tip-item" style="display: flex;justify-content: space-between;" v-for="tip of tipList"
                 @click="selectTip" :data-price="tip.tipAmount.toFixed(2)">
                <p>小费：{{tip.tipVal * 100}}%(${{tip.tipAmount.toFixed(2)}})</p>
                <p>支付${{tip.payAmount.toFixed(2)}}</p>
            </div>

            <div class="tip-item" v-if="this.$store.getters.getIsNoTip === 'TRUE'" @click="selectTip" :data-price="0">
                无小费
            </div>
            <div class="" style="background: rgba(243,243,243,1);width: 100%;"
                 v-if="this.$store.getters.getIsCustomTip === 'TRUE'">
                <div class="input-warp" @click="showKeyBord"><span>$</span><span id="Js_tip_input" class="tip-input-val"
                                                                                 style="padding-left: 10px;">{{tipInputAmount}}</span>
                </div>
                <div @click="selectTip" :data-price="tipInputAmount" class="addInputTip">{{tipInputAmount ==null ||
                    tipInputAmount == '' ? '添加' : '支付$'+parseFloat(tipInputAmountAndTotalAmount).toFixed(2)}}
                </div>
            </div>
        </div>
        <div class="modal-tips-keyboard" :class="keyBordStatus ? 'active' : ''">
            <table>
                <tbody>
                <tr>
                    <td @click="keyBordNum('1')">1</td>
                    <td @click="keyBordNum('2')">2</td>
                    <td @click="keyBordNum('3')">3</td>
                    <td @click="keyBordNum('D')" data-code="D" rowspan="2">
                          <span class="icon icon-del">
                              <svg data-v-7ef413f4 version="1.1" viewBox="0 0 48.4 36" class="svg-icon svg-fill">
                                  <path pid="0"
                                        d="M29.4 19.7l6.2 6.3 1.7-1.7-6.2-6.3 6.3-6.3-1.8-1.7-6.3 6.3-6.2-6.3-1.7 1.7 6.2 6.3-6.3 6.3 1.8 1.7 6.3-6.3zM39.9 3.2a5.3 5.3 0 0 1 5.4 5.3v19a5.3 5.3 0 0 1-5.4 5.3h-20a5.4 5.4 0 0 1-3.9-1.6L3.5 18.8a1 1 0 0 1 0-1.5L16 4.8a5.4 5.4 0 0 1 3.9-1.6h20zm0-3.2H20.7a8.6 8.6 0 0 0-6.2 2.6L1.3 15a4.2 4.2 0 0 0 0 6l13.3 12.4a8.6 8.6 0 0 0 6.1 2.6h19.2a8.5 8.5 0 0 0 8.5-8.5v-19A8.5 8.5 0 0 0 39.9 0z"></path>
                              </svg>
                          </span>
                    </td>
                </tr>
                <tr>
                    <td @click="keyBordNum('4')">4</td>
                    <td @click="keyBordNum('5')">5</td>
                    <td @click="keyBordNum('6')">6</td>
                </tr>
                <tr>
                    <td @click="keyBordNum('7')">7</td>
                    <td @click="keyBordNum('8')">8</td>
                    <td @click="keyBordNum('9')">9</td>
                    <!-- class="fobid"-->
                    <td @click="keyBordNum('K')" data-code="K" rowspan="2" id="JS_form_tip_finish">Ok</td>
                </tr>
                <tr>
                    <td @click="keyBordNum('.')">.</td>
                    <td @click="keyBordNum('0')">0</td>
                    <td data-code="F" @click="keyBordNum('F')">
                          <span class="icon icon-keyfold">
                              <svg data-v-7ef413f4 version="1.1" viewBox="0 0 48 48" class="svg-icon svg-fill">
                                  <path pid="0"
                                        d="M25.2 19.2H30v-4.8h-4.8v4.8zm1.2-12h-4.8V12h4.8V7.2zm-8.4 12h4.8v-4.8H18v4.8zm1.2-12h-4.8V12h4.8V7.2zM24 48l9.6-9.6H14.4L24 48zm9.6-40.8h-4.8V12h4.8V7.2zM13.2 26.4h21.6v-4.8H13.2v4.8zM12 7.2H7.2V12H12V7.2zm20.4 12h4.8v-4.8h-4.8v4.8zM36 12h4.8V7.2H36V12zm7.2-12H4.8A4.8 4.8 0 0 0 0 4.8v24a4.8 4.8 0 0 0 4.8 4.8h38.4a4.8 4.8 0 0 0 4.8-4.8v-24A4.8 4.8 0 0 0 43.2 0zm2.4 28.8a2.4 2.4 0 0 1-2.4 2.4H4.8a2.4 2.4 0 0 1-2.4-2.4v-24a2.4 2.4 0 0 1 2.4-2.4h38.4a2.4 2.4 0 0 1 2.4 2.4v24zm-30-14.4h-4.8v4.8h4.8v-4.8z"></path>
                              </svg>
                          </span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import {
        Indicator,
        MessageBox
    } from "mint-ui";

    export default {
        name: "hello",
        data() {
            return {
                tipList: [],
                //保存选中小费
                tipAmount: 0,
                totalAmount: 0,
                taxAmount: 0,
                tipInputAmount: '',
                keyBordStatus: false,
                tipInputAmountAndTotalAmount: 0,
                paymentBtnDisabled: true,
            };
        },
        methods: {
            selectTip(e, isTipInput) {
                if (!this.paymentBtnDisabled) {
                    return false;
                }

                let paytype = this.common.is_weixin() ? 'wechatpay' : this.common.is_alipay() ? 'alipay' : '';
                if (paytype === '') {
                    MessageBox.alert("请使用微信或支付宝客户端打开").then(action => {
                    });
                    return false;
                }
                //加载动画
                Indicator.open({text: "正在加载中...", spinnerType: "fading-circle"});
                this.paymentBtnDisabled = false;
                let url = this.common.baseURL + "mobi/order/h5pay/add/1.1";
                let tip = e.target.dataset.price;
                this.axios.post(url, {
                    type: 5,
                    terminal_id: this.$store.getters.getQrCode,
                    tip: tip,
                    price: this.price,
                    body: this.note
                }).then(result => {
                    if (result.data.result_code == "ok" && result.data.result_msg == "SUCCESS") {
                        let payUrl = this.common.baseURL + "mobi/pay/pay?transaction_id=" + result.data.id + "&pay_type=" + paytype + "&wx_openid=" + this.$store.getters.getUserId + "&alipay_user_id=" + this.$store.getters.getUserId
                        this.axios.get(payUrl, {}).then(payResult => {
                            if (payResult.data.result_code == "ok" && payResult.data.result_msg == "SUCCESS") {
                                if (this.common.is_weixin()) {
                                    this.wxpay(payResult.data.appId, payResult.data.timeStamp, payResult.data.nonceStr, payResult.data.wechatPackage, payResult.data.signType, payResult.data.paySign);
                                } else if (this.common.is_alipay()) {
                                    this.alipay(payResult.data.trade_no, result.data.merchantOrder.id);
                                }
                            } else {
                                Indicator.close();
                                this.isPayBtnDisabled = true;
                                MessageBox.alert("支付失败").then(action => {
                                });
                            }
                        });
                    } else {
                        Indicator.close();
                        this.paymentBtnDisabled = true;
                        MessageBox.alert("支付失败").then(action => {
                        });
                    }
                });
            }, //微信支付
            wxpay(appId, timeStamp, nonceStr, wechatPackage, signType, paySign) {
                let that = this;

                function onBridgeReady() {
                    WeixinJSBridge.invoke(
                        "getBrandWCPayRequest", {
                            appId: appId, //公众号名称，由商户传入
                            timeStamp: timeStamp, //时间戳，自1970年以来的秒数
                            nonceStr: nonceStr, //随机串
                            package: wechatPackage,
                            signType: signType, //微信签名方式：
                            paySign: paySign //微信签名
                        },
                        function (res) {
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                Indicator.close();
                                that.$router.replace("/success");
                            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                                //取消支付
                                Indicator.close();
                                that.isPayBtnDisabled = true;
                            } else {
                                //错误提示
                                MessageBox.alert("支付失败").then(action => {
                                });
                                Indicator.close();
                                that.isPayBtnDisabled = true;
                            }
                        }
                    );
                }

                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener("WeixinJSBridgeReady", onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
                        document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }
            },
            //支付宝支付
            alipay(tradeNo, transactionId) {
                let that = this;

                function ready(callback) {
                    if (window.AlipayJSBridge) {
                        callback && callback();
                    } else {
                        document.addEventListener("AlipayJSBridgeReady", callback, false);
                    }
                }

                ready(function () {
                    AlipayJSBridge.call(
                        "tradePay", {
                            tradeNO: tradeNo
                        },
                        function (alipayResult) {
                            Indicator.close();
                            Indicator.open({text: "正在跳转...", spinnerType: "fading-circle"});
                            //查询订单
                            that.axios.get(that.common.baseURL + "mobi/pay/resp/alipay/query?transaction_id=" + transactionId, {}).then(queryResult => {
                                if (queryResult.data.result_code == "ok" && queryResult.data.result_msg == "SUCCESS") {
                                    //支付成功
                                    if (queryResult.data.tradeState == "SUCCESS") { //跳转到支付成功页面
                                        Indicator.close();
                                        that.$router.replace("/success");
                                    } else if (queryResult.data.tradeState == "USERPAYING") { //未支付
                                        Indicator.close();
                                        that.isPayBtnDisabled = true;
                                    } else if (queryResult.data.tradeState == "CLOSED") { //交易关闭
                                        MessageBox.alert("当前订单已被关闭，请重新下单.").then(action => {
                                            that.common.closeAli();
                                        });
                                        Indicator.close();
                                        that.isPayBtnDisabled = true;
                                    } else if (queryResult.data.tradeState == "UNKNOWN") {
                                        //结果未知
                                        MessageBox.alert("支付结果未知，请查看支付宝账单.").then(action => {
                                            that.common.closeAli();
                                        });
                                        Indicator.close();
                                        that.isPayBtnDisabled = true;
                                    }
                                } else {
                                    //支付结果未知
                                    MessageBox.alert("支付结果未知，请查看支付宝账单.").then(action => {
                                        that.common.closeAli();
                                    });
                                    Indicator.close();
                                    that.isPayBtnDisabled = true;
                                }
                            });
                        }
                    );
                });
            },
            showKeyBord(e) {
                let screenHeight = $(window).height();
                let inputHeight = $(".tip-input-val").offset().top;
                let keyBordHeight = screenHeight * 0.4; //键盘高度
                if (inputHeight > screenHeight - keyBordHeight) {
                    console.log(inputHeight - (screenHeight - keyBordHeight));
                    $("#tip-content").css("margin-top", -(inputHeight - (screenHeight - keyBordHeight) + 60) + "px")
                }
                this.keyBordStatus = true;
            }, //键盘输入事件
            keyBordNum(code) {
                let amountVal = this.tipInputAmount.toString().trim();
                let _result = 0;
                if (code === "K" || code === "F") {
                    $("#tip-content").css("margin-top", "0px")
                    _result = amountVal;
                    this.keyBordStatus = false;
                } else if (code === "D") {
                    if (amountVal.length == 1 || amountVal == "") {
                        _result = "";
                    } else {
                        _result = amountVal.substring(0, amountVal.length - 1);
                    }
                } else {
                    if (code === "." && amountVal.indexOf(".") >= 0) {
                        return false;
                    }
                    if (amountVal.split(".").length < 2 && (this.common.clearNoNum(amountVal) === "0.00" || parseFloat(this.common.clearNoNum(amountVal)) == "0")) {
                        if (code === ".") {
                            _result = "0" + code;
                        } else {
                            _result = code;
                        }
                    } else {
                        let _amountValArray = amountVal.split(".");
                        if (_amountValArray[0].length < 4) {
                            _result = this.common.clearNoNum(amountVal) + code;
                            _result = this.common.clearNoNum(_result);

                            if (_result.indexOf(".") < 0) {
                                _result = parseFloat(_result);
                            }
                        } else if (_amountValArray[0].length == 4) {
                            let temp = this.common.clearNoNum(amountVal) + code;
                            if (parseInt(temp) > parseInt(amountVal) || (_amountValArray.length == 2 && _amountValArray[1].length > 1)) {
                                _result = amountVal;
                            } else {
                                _result = temp;
                            }
                        } else {
                            _result = amountVal;
                        }
                    }
                }
                this.tipInputAmount = _result;
                this.tipInputAmountAndTotalAmount = this.totalAmount + parseFloat(this.tipInputAmount);
            },
            calculateCost() {
                if (this.$store.getters.getIsTax === "TRUE") {
                    this.taxAmount = this.common.round(this.price * this.$store.getters.getTaxRate, 2);
                }
                this.totalAmount = this.price + this.taxAmount;
                let tipList = this.$store.getters.getTipVal.split(",");
                for (let item of tipList) {
                    let tip = 0;
                    if (this.$store.getters.getIsTax === 'TRUE') {
                        if (this.$store.getters.getTipType === 'PRE_TAX') {
                            tip = this.common.round(this.price * item, 2)
                        } else if (this.$store.getters.getTipType === 'AFTER_TAX') {
                            let totalAmount = this.price + this.taxAmount;
                            tip = this.common.round(totalAmount * item, 2);
                        }
                    } else {
                        tip = this.common.round(this.price * item, 2)
                    }
                    let payAmount = this.totalAmount + tip;
                    this.tipList.push({"tipVal": item, "tipAmount": tip, "payAmount": payAmount});
                }
            }
        },
        props: ["price", "note"],
        created() {

        },
        computed: {},
        watch: {},
        mounted: function () {

        }
    };
</script>

<style>
    .mint-indicator-wrapper, .mint-indicator-mask {
        z-index: 99999 !important;
    }

    @media screen and (min-height: 667px) {
        #tip-content .tip-cell .tip-item {
            padding: 15px !important;
        }
    }

    @media screen and (min-height: 736px) {
        #tip-content .tip-cell .tip-item {
            padding: 20px !important;
        }
    }

    #tip-content p {
        margin: 0;
    }

    #tip-content {
        margin-bottom: 20px;
        overflow-y: hidden
    }

    #tip-content .title {
        text-align: center;
        padding: 20px 20px 0px 20px;
        font-size: 14px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }

    #tip-content .tip-cell {
        position: relative;
        width: 100%;
        padding: 10px;
    }

    #tip-content .tip-cell .tip-item {
        padding: 10px;
        margin-bottom: 10px;
        /*border-radius: 24px;*/
        border: 1px solid rgba(204, 204, 204, 1);
        font-size: 14px;
        color: rgb(62, 61, 61);
        text-align: center;
        background: #ed5b5b;
        color: #fff;
    }

    #tip-content .tip-cell .tip-item p {
        color: #ffffff;
    }

    #tip-content .tip-cell .tip-item.active {
        background: rgba(237, 91, 91, 0.2) !important;
        border: 1px solid rgba(237, 91, 91, 1) !important;
    }

    #tip-content .saveTipBtn {
        padding: 15px;
        border-radius: 24px;
        background: rgba(237, 91, 91, 1);
        -webkit-box-shadow: 0px 0px 10px 0px rgba(237, 91, 91, 1);
        box-shadow: 0px 0px 10px 0px rgba(237, 91, 91, 1);
        text-align: center;
        margin: 0px 10px 10px 10px;
        color: #fff;
    }

    #tip-content .addInputTip {
        width: 50%;
        float: left;
        margin-left: 5%;
        padding: 13px;
        background: rgba(237, 91, 91, 1);
        text-align: center;
        color: #fff;
    }

    #tip-content .input-warp {
        width: 45%;
        overflow: hidden;
        padding: 12px;
        float: left;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 0px;
    }

    #tip-content .fee-info .fee-itme {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding-top: 1rem;
    }

    #tip-content .fee-info .fee-title {
        width: 50%;
        text-align: right;
    }

    #tip-content .fee-info .fee-number {
        width: 50%;
        text-align: left;
    }

    #tip-content .fee-info p {
        color: #000;
        font-size: 14px;
        margin: 0;
    }

    #tip-content .fee-info .amount {
        width: 100%;
        font-size: 2rem;
        text-align: center;
        font-weight: 500;
        padding-top: 1.5rem;

    }

    #tip-content .modal-tips-keyboard {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        font-size: 24px;
        line-height: 24px;
        background: #f6f6f6;
        color: #4a4a4a;
        width: 100%;
        height: 40%;
        user-select: none;
        transition-property: transform visibility;
        transition-duration: 0.6s;
        font-weight: 300;
        border-top: 1px solid #e5e5e5;
        visibility: hidden;
        transform: translate3d(0, 100%, 0);
        z-index: 98;
    }

    #tip-content .modal-tips-keyboard table {
        width: 100%;
        height: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }

    #tip-content .modal-tips-keyboard td:first-child {
        border-left: none;
    }

    #tip-content .modal-tips-keyboard td:nth-of-type(-n + 3) {
        font-weight: 600;
    }

    #tip-content .modal-tips-keyboard td {
        text-align: center;
        width: 33.33%;
        border: 1px solid #ddd;
    }

    #tip-content .modal-tips-keyboard .icon {
        font-size: 12px;
    }

    #tip-content .modal-tips-keyboard .icon svg {
        width: 18px;
        height: 18px;
    }

    #tip-content .modal-tips-keyboard td[data-code="K"] {
        font-size: 20px;
        background: #ed5b5b;
        color: #ffffff;
    }

    #tip-content .modal-tips-keyboard.active {
        visibility: visible;
        transform: translateZ(0);
    }
</style>
