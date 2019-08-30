<template>
    <div>
        <div v-if="isShow">
            <header class="mui-bar mui-bar-nav">
                <a class="mui-icon mui-icon-back" style="color:red" @click="jump"></a>
                <h1 class="mui-title">结账</h1>
                <span class="float-right nav-bar-btn">桌号:{{this.$store.getters.getTableName}}</span>
            </header>
            <div class="mui-content">
                <div class="info">
                    <!--<div class="total-amount">${{totalAmount.toFixed(2)}}</div>-->
                    <div class="total-amount" v-if="isDeduction">
                        ${{((totalAmount.toFixed(2)-(totalAmount-0.01))).toFixed(2)}}
                    </div>
                    <!--<div class="total-amount" v-if="!isDeduction">-->
                    <!--${{(totalAmount-(transfromPrice(integral))).toFixed(2)}}-->
                    <!--</div>-->
                    <div class="total-amount" v-if="!isDeduction">
                        ${{afterDeductionAmount.toFixed(2)}}
                    </div>
                    <div class="desk-no">桌号:{{this.$store.getters.getTableName}}</div>
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
                                <span v-if="!(goods.remark === '' || goods.remark ==null)">{{goods.specificationInfoList && goods.specificationInfoList.length > 0 ? '/'+goods.remark : goods.remark}}</span>
                            </p>
                        </div>
                        <div class="group-count">x{{goods.quantity}}</div>
                        <div class="group-amount">${{goods.amount.toFixed(2)}}</div>
                    </div>
                    <div class="cost-info">
                        <div class="item">
                            <p>小计</p>
                            <p class="subtotal">${{total.toFixed(2)}}</p>
                        </div>
                        <div class="item" v-if="discountAmount > 0">
                            <p>折扣金额({{this.$store.getters.getDiscount * 10}}折)</p>
                            <p>-${{discountAmount.toFixed(2)}}</p>
                        </div>
                        <div class="item" v-if="this.$store.getters.getIsTax === 'TRUE'">
                            <p>税费</p>
                            <p class="">${{tax.toFixed(2)}}</p>
                        </div>
                        <div class="item" v-if="this.$store.getters.getIsTip === 'TRUE'">
                            <p>小费</p>
                            <p class="">${{tipAmount.toFixed(2)}}</p>
                        </div>
                    </div>
                    <!-- style="color: #ED5B5B;text-align: right;text-decoration: underline;"-->
                    <div class="total">
                        <p class="price total-width"
                           style="font-size: 16px;font-weight: normal;">${{totalAmount.toFixed(2)}}</p>
                        <span>小计：</span>
                    </div>
                    <div class="total" v-if="integral>0">
                        <p class="price total-width"
                           style="font-size: 16px;font-weight: normal;">-${{transfromPrice(integral)+".00"}}</p>
                        <span>积分抵扣金额：</span>
                    </div>
                    <!--<div class="total" v-if="!isDeduction">-->
                    <!--<p class="price total-width">-->
                    <!--${{(totalAmount.toFixed(2)-transfromPrice(integral)).toFixed(2)}}</p>-->
                    <!--<span>实收：</span>-->
                    <!--</div>-->
                    <div class="total" v-if="!isDeduction">
                        <p class="price total-width">
                            ${{afterDeductionAmount.toFixed(2)}}</p>
                        <span>实收：</span>
                    </div>
                    <div class="total" v-if="isDeduction">
                        <span class="price">${{((totalAmount.toFixed(2)-(totalAmount-0.01))).toFixed(2)}}</span>
                        <span>合计：</span>
                    </div>
                    <p class="register-prompt" v-if="this.$store.getters.getIsStoreUser=='FALSE'" @click="jumpRegister">
                        (注册会员使用积分抵扣?)
                    </p>
                </div>
                <!--会员积分抵扣-->
                <!--<div class="info"-->
                <!--v-if="this.$store.getters.getOpenMembershipSystem=='TRUE'&&this.$store.getters.getIsStoreUser=='TRUE'">-->
                <!--<p style="color: #ED5B5B;font-size: 14px;">会员积分抵扣</p>-->
                <!--<div class="cost-info" @click="prompt">-->
                <!--<div class="item" v-if="this.$store.getters.getIsTip === 'TRUE'">-->
                <!--<div class="item-box">-->
                <!--&lt;!&ndash;<span>积分抵扣?</span>&ndash;&gt;-->
                <!--<div class="integral-item" style="color: black;padding: 0 10px;">-->
                <!--<div>-->
                <!--<span>(当前积分</span>-->
                <!--<span :style="integral>0?'text-decoration:line-through':''">{{nowAsBeforeIntegra}}</span>)-->
                <!--</div>-->
                <!--<div v-if="integral>0">-->
                <!--<span style="float: left;">剩余积分:</span>-->
                <!--<span>{{nowAsBeforeIntegra-integral}}</span>-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->
                <!--<p>-->
                <!--<img src="../../../static/img/integral.png" alt="">-->
                <!--<span class="integral-text" v-text="integralHTML"></span>-->
                <!--<i class="mui-icon mui-icon-forward" style="font-size:16px"></i>-->
                <!--</p>-->
                <!--</div>-->
                <!--</div>-->
                <!--</div>-->
                <!--改版会员积分抵扣-->
                <div class="info"
                     v-if="this.$store.getters.getOpenMembershipSystem=='TRUE'&&this.$store.getters.getIsStoreUser=='TRUE'">
                    <!--<p style="color: #ED5B5B;font-size: 14px;">会员积分抵扣</p>-->
                    <div class="cost-info" @click="integralAlert">
                        <div class="item" v-if="this.$store.getters.getIsTip === 'TRUE'">
                            <div class="item-box">
                                <!--<span>积分抵扣?</span>-->
                                <div class="integral-item" style="color: black;">
                                    <!--<div>-->
                                    <!--<span>(当前积分</span>-->
                                    <!--<span :style="integral>0?'text-decoration:line-through':''">{{nowAsBeforeIntegra}}</span>)-->
                                    <!--</div>-->
                                    <p style="color: #ED5B5B;font-size: 14px;">会员积分抵扣</p>
                                </div>
                            </div>
                            <p>
                                <img src="../../../static/img/integral.png" alt="">
                                <span class="integral-text" v-text="integralHTML"></span>
                                <i class="mui-icon mui-icon-forward" style="font-size:16px"></i>
                            </p>
                        </div>
                    </div>
                    <!--two-->
                    <div class="cost-border">
                        <div class="item" style="flex-flow: column;align-items:flex-start;">
                            <div class="integral-item" style="color: black;">
                                <div>
                                    <span>(当前积分</span>
                                    <span :style="integral>0?'text-decoration:line-through':''">{{this.$store.getters.getNowIntegralNumber}}</span>)
                                </div>
                                <div v-if="integral>0">
                                    <span style="float: left;">剩余积分:</span>
                                    <span>{{this.$store.getters.getNowIntegralNumber-integral}}</span>
                                </div>
                            </div>
                            <div class="consumption-info">
                                您当前消费<span>{{((totalAmount.toFixed(2)-transfromPrice(integral))).toFixed(2)}}</span>,可获得
                                <span>{{transfromIntegral((totalAmount.toFixed(2)-transfromPrice(integral)))}}</span>积分
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pay-btn" @click="payment" :class="isPayBtnDisabled?'':'pay-btn-active'">确认付款</div>
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
            <mt-popup v-model="tipPopupVisible" popup-transition="popup-fade"
                      style="width:95%;background: rgba(255, 255, 255, 1);border-radius: 6px;"
                      v-if="this.$store.getters.getIsTip == 'TRUE'" closeOnClickModal>
                <tip msg-father="" :afterDiscountTotal="afterDiscountTotal"
                     :personNum="this.$store.getters.getOrderGoodsList.personNum" :tipInputVal="tipInputVal"
                     :total="total" :tax="tax"
                     @showTipKeyBord="showTipKeyBord" @clickSaveTip="clickSaveTip"></tip>
            </mt-popup>
        </div>
        <home-header v-if="!isShow"></home-header>
        <mt-popup v-model="inputIntegralAlert" popup-transition="popup-fade" style="width: 100%; top: 50%;"
                  :closeOnClickModal="false">
            <div class="mint-msgbox">
                <div class="mint-msgbox-header">
                    <div class="mint-msgbox-title">提示</div>
                </div>
                <div class="mint-msgbox-content">
                    <div class="mint-msgbox-message">
                        <span>请输入需抵扣的积分</span>
                        <br>
                        <!--<div style="font-size: 12px;line-height: 17px;">-->
                        <!--<span>当前积分兑换比例{{integralPortion}}</span>-->
                        <!--</div>-->
                        <span>您的积分为 <span style="font-weight: 600;">{{this.$store.getters.getNowIntegralNumber}}</span> </span>
                        最多可抵
                        <span style="font-weight: 600;">$
                            <span style="padding: 0 0px;">{{(+(transRemainder(this.$store.getters.getNowIntegralNumber))).toFixed(2)}}</span>
                        </span>
                    </div>
                    <p id="moneys" onclick="keyboard.keyBordStatus()" @click="toggleKeyborad()">
                        <span style="font-size: 1.1rem;">积分</span>
                        &nbsp;
                        <span id="price">
                        </span>
                        <span id="cursor" style="display: block;"></span>
                    </p>
                </div>
                <div class="mint-msgbox-btns">
                    <div class="mint-msgbox-btn mint-msgbox-cancel promiseBtn" style="color: black;"
                         @click="alertClose">取消
                    </div>
                    <div class="mint-msgbox-btn mint-msgbox-confirm promiseBtn" @click="alertClose();alertConfirm()">
                        确定
                    </div>
                </div>
            </div>
        </mt-popup>
        <div id="contentKey" openToggle></div>
    </div>
</template>

<script>
    require("../../assets/js/keyboard")
    import tip from "./tip.vue";
    import HomeHeader from "@/components/transition/trans";
    import {
        Indicator,
        Toast,
        MessageBox
    } from "mint-ui";

    export default {
        components: {
            tip,
            HomeHeader
        },
        data() {
            return {
                //商品数据列表
                goodsList: [],
                //小计
                total: 0,
                //优惠金额
                discountAmount: 0,
                //折后金额
                afterDiscountTotal: 0,
                //税费
                tax: 0,
                //总金额
                totalAmount: 0,
                //小费弹框
                tipPopupVisible: true,
                //小费
                tipAmount: 0,
                //小费键盘是否显示
                keyBordStatus: false,
                //小费输入框初始值
                tipInputVal: '',
                //支付按钮是否禁用
                isPayBtnDisabled: true,
                isShow: false,
                //显示的积分HTML模板
                integralHTML: "",
                //输入积分所抵扣的钱
                integralPrice: 0,
                //输入的积分
                integral: 0,
                //输入积分popup显示
                inputIntegralAlert: false,
                //订单未支付且扣了积分的当前积分数
                nowAsBeforeIntegra: +(this.$store.getters.getDeductionIntegral) + (+(this.$store.getters.getNowIntegralNumber)),
                //是否注册了会员
                isShowRegister: false,
                //积分兑换比例
                integralPortion: "",
                //抵扣金额是否等于合计金额
                isDeduction: false,
                //积分抵扣后的金额(显示)
                afterDeductionAmount: 0
            };
        },
        methods: {
            jump() {
                this.$router.replace("/afterDetails");
            },
            //小费确认点击事件
            clickSaveTip(tip, isTipInput) {
                if (isTipInput) {
                    if (this.tipInputVal === "" || this.tipInputVal === null) {
                        MessageBox.alert("请输入小费").then(action => {
                        });
                        return false;
                    }
                    console.log(this.tipInputVal, this.$store.getters.getPersonNum)

                    if (this.$store.getters.getIsMandatoryTip === 'TRUE') {
                        let comparTip = 0;
                        if (this.$store.getters.getIsTax === 'TRUE') {
                            if (this.$store.getters.getTipType === 'PRE_TAX') {
                                comparTip = this.common.round(this.afterDiscountTotal * this.$store.getters.getMandatoryTipRate, 2)
                            } else if (this.$store.getters.getTipType === 'AFTER_TAX') {
                                let compartax = this.common.round(this.afterDiscountTotal * this.$store.getters.getTaxRate, 2);
                                let comparTotalAmount = this.afterDiscountTotal + compartax;
                                comparTip = this.common.round(comparTotalAmount * this.$store.getters.getMandatoryTipRate, 2);
                            }
                        } else {
                            comparTip = this.common.round(this.afterDiscountTotal * this.$store.getters.getMandatoryTipRate, 2)
                        }
                        if (this.$store.getters.getPersonNum >= this.$store.getters.getMandatoryTipPersonNum) {
                            if (parseFloat(this.tipInputVal) < comparTip) {
                                MessageBox.alert("小费最少金额为:$" + comparTip.toFixed(2)).then(action => {
                                });
                                return false;
                            }
                        }
                        // if (parseFloat(this.tipInputVal) < comparTip) {
                        //     MessageBox.alert("小费最少金额为:$" + comparTip.toFixed(2)).then(action => {
                        //     });
                        //     return false;
                        // }
                    }
                    this.tipAmount = parseFloat(this.tipInputVal);
                    this.totalAmount = this.totalAmount + parseFloat(this.tipInputVal);
                    this.ifBeyond();
                    this.afterDeductionAmount = this.totalAmount - this.transfromPrice(this.integral)
                } else {
                    this.tipAmount = tip;
                    this.totalAmount = this.totalAmount + tip;
                    this.ifBeyond()
                    this.afterDeductionAmount = this.totalAmount - this.transfromPrice(this.integral)
                }
                this.keyBordStatus = false;
                this.tipPopupVisible = false;
            },
            //显示小费键盘
            showTipKeyBord(status) {
                this.keyBordStatus = status;
                let screenHeight = $(window).height();
                let keyBordHeight = screenHeight * 0.4; //键盘高度
                let inputHeight = $(".tip-input-val").position().top; //当前输入框距离父元素高度
                let tipModalHeight = $(".mint-popup").position().top; //当前弹框距离父元素高度
                let tipCellHeight = $(".tip-cell").position().top; //当前小费选择区域距离父元素高度
                if (inputHeight + tipModalHeight + tipCellHeight + 60 > screenHeight - keyBordHeight) {
                    $(".mint-popup").css("margin-top", -((inputHeight + tipModalHeight + tipCellHeight + 60) - (screenHeight - keyBordHeight)) + "px");
                }
            },
            //键盘事件
            keyBordNum(val) {
                let amountVal = this.tipInputVal.toString().trim();
                let _result = 0;
                let _code = val;
                if (_code === "K" || _code === "F") {
                    //ok按钮  //隐藏键盘按钮
                    _result = parseFloat(this.common.clearNoNum(amountVal)).toFixed(2);
                    _result == 0 ? (_result = "") : "";
                    // 限额检测
                    if (_result > 999.99) {
                        return false;
                    } else {
                        $(".mint-popup").css("margin-top", 0 + "px");
                        this.keyBordStatus = false;
                    }
                    this.tipInputVal = _result;
                } else {
                    //删除按钮
                    if (_code === "D") {
                        if (amountVal.length == 1 || amountVal == "") {
                            _result = "";
                        } else {
                            _result = amountVal.substring(0, amountVal.length - 1);
                        }
                    } else {
                        //数字按钮
                        if (_code === "." && amountVal.indexOf(".") >= 0) {
                            return false;
                        }
                        if (amountVal.split(".").length < 2 && (this.common.clearNoNum(amountVal) === "0.00" || parseFloat(this.common.clearNoNum(amountVal)) == "0")) {
                            if (_code === ".") {
                                _result = "0" + _code;
                            } else {
                                _result = _code;
                            }
                        } else {
                            let _amountValArray = amountVal.split(".");
                            if (_amountValArray[0].length < 3) {
                                _result = this.common.clearNoNum(amountVal) + _code;
                                _result = this.common.clearNoNum(_result);
                                if (_result.indexOf(".") < 0) {
                                    _result = parseFloat(_result);
                                }
                            } else if (_amountValArray[0].length == 3) {
                                let temp = this.common.clearNoNum(amountVal) + _code;
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
                    this.tipInputVal = _result;
                }
            },
            //支付
            payment() {
                if (!this.isPayBtnDisabled) {
                    return false;
                }
                let paytype;
                if (process.env.NODE_ENV === "development") {
                    paytype = "wechatpay"
                } else {
                    paytype = this.common.is_weixin() ? 'wechatpay' : this.common.is_alipay() ? 'alipay' : '';
                    if (paytype === '') {
                        MessageBox.alert("请使用微信或支付宝客户端打开").then(action => {
                        });
                        return false;
                    }
                }
                //加载动画
                Indicator.open({text: "正在加载中...", spinnerType: "fading-circle"});
                this.isPayBtnDisabled = false;
                let url, body;
                if (this.integral >= 0) {
                    console.log(this.integral, this.integralPrice)
                    url = this.common.baseURL + "mobi/goodsorder/pay/order/add?store_user_id=" + this.$store.getters.getStoreScanGoodsUser.id + "&store_id=" + this.$store.getters.getStoreId;
                    body = {
                        deduction_integral: this.integral,
                        integral_deduction_amount: this.integralPrice,
                        num: this.$store.getters.getOrderNum,
                        tip: this.tipAmount
                    }
                } else {
                    url = this.common.baseURL + "mobi/goodsorder/pay/order/add";
                    body = {
                        num: this.$store.getters.getOrderNum,
                        tip: this.tipAmount
                    }
                }
                console.log('body:' + body + "url" + url)
                this.axios.post(url, body).then(result => {
                    if (result.data.result_code == "ok" && result.data.result_msg == "SUCCESS") {
                        // this.$store.commit('nowIntegralNumber', this.$store.getters.getNowIntegralNumber - this.integral)
                        let payUrl = this.common.baseURL + "mobi/pay/pay?transaction_id=" + result.data.merchantOrder.id + "&pay_type=" + paytype + "&wx_openid=" + this.$store.getters.getUserId + "&alipay_user_id=" + this.$store.getters.getUserId
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
                    } else if (result.data.result_code == "error" && result.data.result_msg == "ORDER_PID") {
                        Indicator.close();
                        this.isPayBtnDisabled = true;
                        MessageBox.alert("订单已完成或已被取消.").then(action => {
                            if (this.common.is_weixin()) {
                                this.common.closeWx();
                            } else if (this.common.is_alipay()) {
                                this.common.closeAli();
                            } else {
                                history.back();
                            }
                        });
                    } else {
                        Indicator.close();
                        this.isPayBtnDisabled = true;
                        MessageBox.alert("系统错误").then(action => {
                        });
                    }
                });
            },
            //微信支付
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
                            Indicator.close();
                            that.isPayBtnDisabled = true;
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                Indicator.close();
                                that.$router.replace("/paySuccess");
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
                                    Indicator.close();
                                    that.isPayBtnDisabled = true;
                                    //支付成功
                                    if (queryResult.data.tradeState == "SUCCESS") { //跳转到支付成功页面
                                        Indicator.close();
                                        that.$router.replace("/paySuccess");
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
            //输入会员alert显示
            prompt() {
                this.inputIntegralAlert = true;
            },
            //传入积分转换成金额
            transfromPrice(value) {
                if (this.$store.getters.getOpenMembershipSystem == "TRUE") {
                    let integralArray = this.$store.getters.getFromIntegralConvertRatio.split('/')
                    let integral = (value / integralArray[0]).toFixed(0)
                    return integral
                } else {
                    return 0
                }
            },
            //传入消费金额转换积分
            transfromIntegral(value) {
                if (this.$store.getters.getOpenMembershipSystem == "TRUE") {
                    let priceArray = this.$store.getters.getToIntegralConvertRatio.split('/')
                    let price = (priceArray[1] * value).toFixed(0)
                    return price
                }
            },
            //传入金额转换成积分数
            transIntegral(value) {
                if (this.$store.getters.getOpenMembershipSystem == "TRUE") {
                    let integralArray = this.$store.getters.getFromIntegralConvertRatio.split('/')
                    let integral = (integralArray[0] * value).toFixed(0)
                    return integral
                }
            },
            //传入取余积分转换成金额
            transRemainder(values) {
                let str1 = +(this.$store.getters.getFromIntegralConvertRatio.split('/')[0]) / +(this.$store.getters.getFromIntegralConvertRatio.split('/')[1])//一块钱对应的积分数(根据门店配置)
                let unitRrice
                if (str1.toString().indexOf('.') >= 0) {
                    unitRrice = +(str1.toString().split('.')[0])
                } else {
                    unitRrice = +(str1);
                }
                let deductibleAmount = values / unitRrice
                if (deductibleAmount.toString().indexOf('.') >= 0) {//积分抵扣的金额=积分除以单价 需取余
                    deductibleAmount = +(deductibleAmount.toString().split('.')[0])
                }
                return deductibleAmount
            },
            //显示键盘修正alery的位置
            toggleKeyborad(value) {
                if (value == undefined) {
                    if ($("#contentKey").hasClass('active')) {
                        $('.mint-msgbox').css({
                            'top': "-20vw"
                        })
                    } else {
                        $('.mint-msgbox').css({
                            'top': ""
                        })
                    }
                } else {
                    $('.mint-msgbox').css({
                        'top': ""
                    })
                }
            },
            //MessageBox点击确认和取消时关闭alert
            alertClose() {
                this.inputIntegralAlert = false;
                this.toggleKeyborad("slide-bottom")
                $("#contentKey").removeClass("active")
            },
            //MessageBox点击确定时
            alertConfirm() {
                let value = document.getElementById('price').innerHTML
                let values = +(value)

                if (/^\d{1,}$/.test(values)) {
                    let inputIntegral = values//输入的积分
                    let nowIntegral = this.nowAsBeforeIntegra//当前积分
                    let getIntegral = +(this.transfromIntegral(this.totalAmount.toFixed(2)))//消费获得的积分
                    if (values < 0) {
                        MessageBox.alert('请输入正确的积分(正整数)')
                        return
                    }
                    if (inputIntegral > nowIntegral) {//输入抵扣金额多于当前积分
                        MessageBox.alert('不能超出您的积分数!').then(result => {
                            this.inputIntegralAlert = true;
                        })
                        return
                    } else if (inputIntegral == +(this.transIntegral(this.totalAmount))) {//输入积分等于合计金额折算的积分则总价为0.01
                        this.integralHTML = inputIntegral + "($" + this.totalAmount.toFixed(2) + ")"
                        this.integralPrice = +(this.transfromPrice(inputIntegral))//消耗积分所抵扣的钱
                        this.integral = inputIntegral
                        this.afterDeductionAmount = this.totalAmount - this.integralPrice
                    } else if (inputIntegral > +(this.transIntegral(this.totalAmount))) {//输入抵扣金额多于消费金额
                        let mostIntegral = 0//最多抵扣金额
                        if (this.totalAmount.toString().indexOf('.') >= 0) {
                            mostIntegral = +(this.totalAmount.toString().split('.')[0])
                        } else if (this.totalAmount.toString().indexOf('.') == -1) {
                            mostIntegral = this.totalAmount
                        }
                        let totalAmountIntegral = +(this.transIntegral(mostIntegral))
                        this.integralHTML = totalAmountIntegral + "($" + mostIntegral.toFixed(2) + ")"
                        this.integralPrice = +(this.transfromPrice(totalAmountIntegral))//消耗积分所抵扣的钱
                        this.integral = totalAmountIntegral
                        this.afterDeductionAmount = this.totalAmount - this.integralPrice
                    } else if (inputIntegral <= nowIntegral) {//输入的抵扣金额小于可以抵扣的金额
                        let amount = this.transRemainder(+(inputIntegral));//输入积分抵扣的金额
                        this.integralHTML = +(this.transIntegral(amount)) + "($" + (amount).toFixed(2) + ")"
                        this.integralPrice = amount//消耗积分所抵扣的钱
                        this.afterDeductionAmount = this.totalAmount - this.integralPrice
                        this.integral = this.transIntegral(amount)
                    }
                    return
                } else {
                    MessageBox.alert('只能输入整数')
                    return
                }
            },
            //跳转到注册页
            jumpRegister() {
                this.$router.replace("/register")
            },
            integralAlert() {
                this.inputIntegralAlert = true;
            },
            ifBeyond() {
                if (+(this.transfromIntegral(this.totalAmount) < this.integral)) {
                    let mostIntegral = 0//最多抵扣金额
                    if (this.totalAmount.toString().indexOf('.') >= 0) {
                        mostIntegral = +(this.totalAmount.toString().split('.')[0])
                    } else if (this.totalAmount.toString().indexOf('.') == -1) {
                        mostIntegral = this.totalAmount
                    }
                    let totalAmountIntegral = +(this.transIntegral(mostIntegral))
                    this.integralHTML = totalAmountIntegral + "($" + mostIntegral.toFixed(2) + ")"
                    this.integralPrice = +(this.transfromPrice(totalAmountIntegral))//消耗积分所抵扣的钱
                    this.integral = totalAmountIntegral
                    console.log(this.integralPrice, this.integral)
                }
            }
        },
        created() {
            if (this.$store.getters.getOpenMembershipSystem == "TRUE") {
                this.integralPortion = this.$store.getters.getFromIntegralConvertRatio.split('/')[0] + ":" + this.$store.getters.getFromIntegralConvertRatio.split('/')[1]
            } else {
                this.integralPortion = ""
            }
            if (this.$store.getters.getDeductionIntegral == "0" || this.$store.getters.getDeductionIntegral == 0) {
                this.$store.commit('deductionIntegral', 0)
            }
            //进入details页面,购物车没有菜品
            if (this.$store.getters.getOrderGoodsList == null || this.$store.getters.getOrderGoodsList == undefined || this.$store.getters.getOrderGoodsList.length == 0) {
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
            this.goodsList = this.$store.getters.getOrderGoodsList.goodsList;
            for (let goods of this.goodsList) {
                this.total += goods.amount;
            }
            this.discountAmount = this.total - this.common.round(this.total * this.$store.getters.getDiscount, 2);
            if (this.$store.getters.getIsAfterDiscountTip == "TRUE") {
                this.afterDiscountTotal = this.total;
            } else {
                this.afterDiscountTotal = this.total - this.discountAmount;
            }

            if (this.$store.getters.getIsTax === "TRUE") {
                if (this.$store.getters.getIsAfterDiscountTax == "TRUE") {
                    this.tax = this.total * this.$store.getters.getTaxRate;
                } else {
                    this.tax = (this.total - this.discountAmount) * this.$store.getters.getTaxRate
                }
                this.totalAmount = this.totalAmount + this.tax;
            }
            this.totalAmount = this.totalAmount + (this.total - this.discountAmount);
            this.afterDeductionAmount = this.totalAmount;
            window.setTimeout((result) => {
                this.isShow = true;
            }, 1000);
        },
        watch: {
            integral: {
                handler: function (newVal, oldVal) {
                    this.isDeduction = false
                    let totalIntegral = this.transIntegral(this.totalAmount)
                    console.log(this.totalAmount,newVal,totalIntegral==newVal)
                    if (totalIntegral == newVal) {
                        this.isDeduction = true
                    }
                }
            }
        },
        mounted() {
            if (this.$store.getters.getOpenMembershipSystem == "TRUE" && this.$store.getters.getIsStoreUser == "TRUE") {
                this.$store.getters.getDeductionIntegral > 0 ? this.integral = this.$store.getters.getDeductionIntegral : this.integral = 0
                this.$store.getters.getDeductionIntegral > 0 ? this.integralHTML = this.$store.getters.getDeductionIntegral + "($" + this.transfromPrice(this.$store.getters.getDeductionIntegral) + ".00" + ")" : ""
                window.keyboard.init(document.getElementById("contentKey"), document.getElementById('price'), {
                    length: +(this.nowAsBeforeIntegra.toString().length),//nowIntegral > 0 && nowIntegral < 10 ? 1 : nowIntegral >= 10 && nowIntegral < 100 ? 2 : nowIntegral >= 100 && nowIntegral < 1000 ? 3 : 4
                    point: false,
                    svgIcon: false,
                    amountTesting: {
                        isOpen: true,
                        amount: +(this.$store.getters.getNowIntegralNumber)
                    }
                })
                $("#contentKey").removeClass("active")
            }
        }
    };
</script>
<style scoped>
    .register-prompt {
        color: #ED5B5B;
        font-size: 12px;
        text-align: right;
        text-decoration: underline;
        margin-bottom: 0;
    }

    .total-width {
        width: 80px;
        margin: 0;
    }

    .promiseBtn {
        color: #26a2ff;
        width: 50%;
        font-size: 14px;
        text-align: center;
        line-height: 40px;
    }

    #moneys {
        margin: 0;
    }

    .integral-item div:nth-child(2) {
        position: relative;
        right: 2px;
        text-align: right;
    }

    .integral-item {
        display: flex;
        flex-flow: column;
    }

    .item-box {
        display: flex;
        color: #ED5B5B;
        font-size: 13px;
    }

    .integral-text {
        padding: 0 7px;
        letter-spacing: .5px;
    }

    .mui-content {
        position: relative;
        color: #333;
        background-image: linear-gradient(0deg, #efeff4, #efeff4 65%, hsla(0, 0%, 96%, .3) 75%, hsla(0, 0%, 96%, 0)), linear-gradient(270deg, #ed5b5b, #f16f6f);
        padding: 44px 5% 40px 5%;
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
        color: rgba(51, 51, 51, 1);
    }

    .mui-content .info .goods-header .count {
        overflow: hidden;
        -webkit-box-flex: 1.5;
        flex: 1.5;
        text-align: center;
        color: rgba(51, 51, 51, 1);
    }

    .mui-content .info .goods-header .price {
        overflow: hidden;
        -webkit-box-flex: 2.5;
        flex: 3;
        text-align: right;
        color: #ED5B5B;
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

    .mui-content .info .cost-info .item p.subtotal {

    }

    .mui-content .info .total {
        text-align: right;
        font-size: 14px;
        font-weight: 600;
        padding: 10px 0px;
        display: flex;
        flex-flow: row-reverse wrap;
    }

    .mui-content .info .total .price {
        color: rgba(237, 91, 91, 1);
        font-size: 18px;
    }

    .pay-btn {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        margin-top: 1.5rem;
        background: rgba(237, 91, 91, 1);
        box-shadow: 0px 0px 10px 0px rgba(237, 91, 91, 1);
        border-radius: 24px;
        font-size: 16px;
    }

    .pay-btn-active {
        background: #cccccc;
        box-shadow: 0px 0px 10px 0px #cccccc;
    }

    /*键盘样式*/
    .modal-tips-keyboard {
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
        z-index: 999999999;
    }

    .modal-tips-keyboard table {
        width: 100%;
        height: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }

    .modal-tips-keyboard td:first-child {
        border-left: none;
    }

    .modal-tips-keyboard td:nth-of-type(-n + 3) {
        font-weight: 600;
    }

    .modal-tips-keyboard td {
        text-align: center;
        width: 33.33%;
        border: 1px solid #ddd;
    }

    .modal-tips-keyboard .icon {
        font-size: 12px;
    }

    .modal-tips-keyboard .icon svg {
        width: 18px;
        height: 18px;
    }

    .modal-tips-keyboard td[data-code="K"] {
        font-size: 20px;
        background: #ed5b5b;
        color: #ddd;
    }

    .modal-tips-keyboard.active {
        visibility: visible;
        transform: translateZ(0);
    }

    .item p:nth-child(2) {
        display: flex;
        align-items: center;
    }

    .cost-border {
        border-bottom: 1px dashed #ece4e4;
    }

    .consumption-info {
        font-size: 12px;
    }

    .consumption-info span {
        font-size: 13px;
        font-weight: 600;
        color: red;
    }

    @media screen and (max-width: 320px) {
        .integral-item div:nth-child(1) {
            font-size: 12px !important;
        }
    }

    .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0px;
    }
</style>
