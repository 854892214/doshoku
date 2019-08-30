<template>
    <div>
        <div v-if="isShow">
            <HomeDetails :isLastOrder="isLastOrder" :lastOrderNum="lastOrderNum" :isVip="isVip"></HomeDetails>
        </div>
        <home-header v-if="!isShow"></home-header>
    </div>
</template>

<script>
    //引入过渡组件，正常情况该组建应设为全局组件
    import HomeHeader from "@/components/transition/trans"
    import HomeDetails from "@/components/Home/Home-Details";
    import {
        MessageBox
    } from "mint-ui";

    export default {
        components: {
            HomeHeader,
            HomeDetails
        },
        data() {
            return {
                isShow: false,
                isLastOrder: false,
                lastOrderNum: '',
                isVip:false
            };
        },
        methods: {
            init() {
                let code = "";
                let paytype = "";
                if(process.env.NODE_ENV==="development"){
                    console.log("开发环境")
                    paytype = "wechat";
                    this.$store.commit("userId", "o7Ybov3ygktfekSFSgJoxMvKPUts");//o7Ybov-A66P0Fd336NFhquksfFPs //o7Ybov22dRFcmPvWJaFYt6WdSz7I
                }else {
                    console.log("生产环境")
                    // 不是微信也不是支付宝打开
                    if (!this.common.is_weixin() && !this.common.is_alipay()) {
                        return MessageBox.alert("请使用微信或支付宝客户端").then(action => {
                            if (this.common.is_weixin()) {
                                this.common.closeWx();
                            }else if(this.common.is_alipay()){
                                this.common.closeAli();
                            }else{
                                history.back();
                            }
                        });
                    }
                    //是微信打开
                    if (this.common.is_weixin()) {
                        code = this.common.spliceRouter("code");
                        paytype = "wechat";
                    }
                    //支付宝打开
                    if (this.common.is_alipay()) {
                        code = this.common.spliceRouter("auth_code");
                        paytype = "alipay";
                    }
                }
                let qrcodenum = "";
                if (this.common.spliceRouter("state")) {
                    var s = this.common.spliceRouter("state").split(",");
                    qrcodenum = s[1];
                    this.$store.commit("qrCode", qrcodenum);
                }
                if (qrcodenum == "" || qrcodenum == null) {
                    qrcodenum = this.$store.getters.getQrCode;
                }
                if (qrcodenum == "" || qrcodenum == null) {
                    MessageBox.alert("非法访问").then(action => {
                        if (this.common.is_weixin()) {
                            this.common.closeWx();
                        } else if (this.common.is_alipay()) {
                            this.common.closeAli();
                        } else {
                            history.back();
                        }
                    });
                    return false;
                }
                // 请求地址
                let url = this.common.baseURL + "mobi/store/goodsh5Info?qrcode=" + qrcodenum + "&code=" + code
                    + "&paytype=" + paytype + "&state=" + this.$store.getters.getUserId;
                //menuType 0是堂食  1为自取
                this.axios.get(url).then(result => {
                    //先判断相应结果是否成功
                    let data = result.data;
                    console.log(result)
                    if (data.result_code == "ok" && data.result_msg == "SUCCESS") {
                        //如果用户id为空
                        if (data.userid == "" || data.userid == null) {
                            MessageBox.alert("授权失败").then(action => {
                                if (this.common.is_weixin()) {
                                    this.common.closeWx();
                                } else if (this.common.is_alipay()) {
                                    this.common.closeAli();
                                } else {
                                    history.back();
                                }
                            });
                            return false;
                        }
                        document.title = data.stroeName;

                        let nowTzTime = this.moment().tz(data.timezone).format("YYYY-MM-DD HH:mm:ss"); //获取指定时区的当前时间
                        if (data.business_time_slot) {
                            let time = data.business_time_slot.split(",");
                            // let time = "07:00,22:00".split(",");
                            time[0] = this.moment().tz(data.timezone).format("YYYY-MM-DD ") + time[0]
                            time[1] = this.moment().tz(data.timezone).format("YYYY-MM-DD ") + time[1]
                            console.log(time[0]>time[1])
                            //跨天
                            if (time[0] > time[1]) {
                                time[1]=this.moment(time[1]).add(1,'days').format('YYYY-MM-DD HH:mm')
                                if (nowTzTime > time[0] && nowTzTime < time[1]) {//跨天正在营业
                                    //数据存储到会话
                                    console.log('跨天,正在营业')
                                } else {
                                    MessageBox.alert("抱歉,本店打烊了!").then(action => {
                                        // history.back();
                                        if (this.common.is_weixin()) {
                                            this.common.closeWx();
                                        } else if (this.common.is_alipay()) {
                                            this.common.closeAli();
                                        } else {
                                            history.back();
                                        }
                                    })
                                    return;
                                }
                            }else {
                                if (nowTzTime > time[0] && nowTzTime < time[1]) {//同天正在营业
                                    //数据存储到会话
                                    console.log('同天,正在营业')
                                } else {
                                    MessageBox.alert("抱歉,本店打烊了!").then(action => {
                                        if (this.common.is_weixin()) {
                                            this.common.closeWx();
                                        } else if (this.common.is_alipay()) {
                                            this.common.closeAli();
                                        } else {
                                            history.back();
                                        }
                                    })
                                    return;
                                }
                            }
                        }
                        if (data.lastOrder === 'TRUE') {
                            this.isLastOrder = true;
                            this.lastOrderNum = data.lastOrderNum;
                        }


                        //数据存储到会话
                        this.$store.commit("isOrder", data.isOrder); //是否存在订单
                        this.$store.commit("isTax", data.isTax); //是否有税费
                        this.$store.commit("isTip", data.isTip); //是否有小费
                        this.$store.commit("storeId", data.store_id); //店铺ID
                        this.$store.commit("tableName", data.tableName); //桌号
                        this.$store.commit("storeName", data.stroeName); //桌号
                        this.$store.commit("taxRate", data.taxRate); //税率
                        this.$store.commit("tipType", data.tipType); //小费类型
                        // this.$store.commit("tipType", "PRE_TAX"); //小费类型
                        // this.$store.commit("tipType", "AFTER_TAX"); //小费类型
                        this.$store.commit("tipVal", data.tipVal); //小费取值范围
                        this.$store.commit("userId", data.userid); //用户ID
                        this.$store.commit("orderNum", data.orderNum); //订单号，改订单号作用于堂食
                        this.$store.commit("timeZone", data.timezone); //时区
                        this.$store.commit("discount", data.discount); //折扣

                        this.$store.commit("isNoTip", data.is_no_tip); //是否无小费
                        // this.$store.commit("isNoTip", "TRUE"); //是否无小费
                        this.$store.commit("isCustomTip", data.is_custom_tip); //是否自定义小费
                        // this.$store.commit("isCustomTip", "TRUE"); //是否自定义小费
                        this.$store.commit("mandatoryTipRate", data.mandatory_tip_rate); //强制小费费率
                        this.$store.commit("isMandatoryTip", data.is_mandatory_tip); //是否强制小费
                        this.$store.commit("mandatoryTipPersonNum", data.mandatory_tip_person_num); //强制收小费就餐人数
                        this.$store.commit("menuId", data.menuId); //
                        this.$store.commit("isAfterDiscountTip", data.is_after_discount_tax);//折前小费
                        this.$store.commit("isAfterDiscountTax", data.is_after_discount_tip);//折前小费
                        // this.$store.commit("isAfterDiscountTip", "FALSE");//折前小费
                        // this.$store.commit("isAfterDiscountTax", "FALSE");//折前税
                        if(data.isStoreUser=="TRUE"){
                            this.$store.commit('isStoreUser',data.isStoreUser)//是会员
                            this.$store.commit("storeScanGoodsUser", data.isStoreUser=="TRUE" ? JSON.stringify(data.storeScanGoodsUser) : {}); //店铺用户信息
                            if(data.storeScanGoodsUser.hasOwnProperty("real_integral_number")){
                                this.$store.commit("nowIntegralNumber", data.storeScanGoodsUser.real_integral_number);//当前用户积分数
                            }
                        }else if(data.isStoreUser=="FALSE"){
                            this.$store.commit('isStoreUser',data.isStoreUser)//不是会员
                        }
                        if(data.open_membership_system=="TRUE"){
                            this.$store.commit("openMembershipSystem", data.open_membership_system)//是否开启会员系统
                            if(data.hasOwnProperty("from_integral_convert_ratio")){
                                this.$store.commit("fromIntegralConvertRatio",data.from_integral_convert_ratio)//积分兑换折扣金额的比例
                            }
                            if(data.hasOwnProperty("to_integral_convert_ratio")){
                                this.$store.commit("toIntegralConvertRatio",data.to_integral_convert_ratio)//积分兑换折扣金额的比例
                            }
                        }else {
                            this.$store.commit("openMembershipSystem", data.open_membership_system)//是否开启会员系统
                        }
                        if (data.isOrder == "TRUE" && data.orderStatus == 0) { //堂食订单 且用户未支付,跳转到加单页面
                            this.$router.replace("/afterDetails");
                        } else if (data.isOrder == "TRUE" && data.orderStatus == 1) {
                            this.$router.replace("/paySuccess");
                        } else {
                            document.body.className += " bg";
                            this.isShow = true;
                        }
                    } else {
                        MessageBox.alert("系统错误").then(action => {
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


            }
        },
        created() {
            this.init();

        },
        mounted: function () {

        },
        watch: {}
    };
</script>

<style scoped>
</style>
