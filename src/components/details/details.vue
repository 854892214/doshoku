<template>
    <div>
        <div v-if="isShow">
            <header class="mui-bar mui-bar-nav">
                <a class="mui-icon mui-icon-back" style="color:red" @click="jump"></a>
                <h1 class="mui-title">账单详情</h1>
                <span class="float-right nav-bar-btn">桌号:{{this.$store.getters.getTableName}}</span>
            </header>
            <div class="mui-content">
                <div class="info">
                    <div class="title">
                        <div class="name">订单详情</div>
                        <div class="continue-btn" @click="jump">继续点餐<span class="mui-icon mui-icon-arrowright"></span>
                        </div>
                    </div>
                    <div class="goods-cell">
                        <div class="goods-item" v-for="(shopCart,i) of shopCartList" :key="i">
                            <div class="group-name">
                                <p class="name">{{shopCart.name}}</p>
                                <p class="spec-list">
                                    <span v-for="(itemSpec,i) of shopCart.specItemList" :key="i"> {{(i==0?'':'/')+itemSpec.name}}</span>
                                    <span v-for="(name,k) in shopCart.remarkList"
                                          :key="k + (shopCart.specItemList ? shopCart.specItemList.length : 0) ">{{(k + (shopCart.specItemList ? shopCart.specItemList.length : 0)===(shopCart.specItemList ? shopCart.specItemList.length : 0)? ( shopCart.specItemList && shopCart.specItemList.length > 0 ? '/' : '') :'/')+name}}</span>
                                </p>
                            </div>
                            <div class="group-count">x{{shopCart.count}}</div>
                            <div class="group-amount">${{shopCart.total_amount.toFixed(2)}}</div>
                        </div>

                    </div>
                    <div class="subtotal">
                        <div class="total">小计：<span class="price">${{total.toFixed(2)}}</span></div>
                    </div>
                </div>
                <div class="person" @click="showPerson" v-if="this.$store.getters.getIsOrder === 'FALSE'">
                    <a class="mint-cell">
                        <div class="mint-cell-wrapper">
                            <div class="mint-cell-title" style="padding-left: .8rem;">
                                <span class="mint-cell-text">选择人数</span>
                            </div>
                            <div class="mint-cell-value is-link">
                                <span style="color: #ed5b5b;padding-right: .8rem;font-size: .8rem;">{{personNum === '' || personNum === null ? '' : personNum + '人'}}</span>
                            </div>
                            <i class="mint-cell-allow-right"></i>
                        </div>
                    </a>
                </div>

                <div class="remark" v-if="this.$store.getters.getIsOrder === 'FALSE'">
                    <textarea placeholder="请填写备注" v-model="uRemark"></textarea>
                </div>
            </div>
            <div class="footer">
                <div class="text">共<span class="count">{{totalCount}}</span>份&nbsp;合计<span class="price">${{total.toFixed(2)}}</span>
                </div>
                <div class="btn" @click="addGoodsOrder">确认下单</div>
            </div>
            <mt-popup v-model="personPopupVisible" popup-transition="popup-fade" :closeOnClickModal="isModalClose"
                      class="personModal">
                <div class="person-content">
                    <div class="container-num" v-if="showMore" v-for="(item,i) in 12" :key="i">
                        <div class="num" @click="selectPerson" :data-num="i+1">{{item}}</div>
                    </div>
                    <div class="container-num" v-if="showMore==false"
                         v-for="(item,j) in [13,14,15,16,17,18,19,20,21,22,23,24]" :key="j+13">
                        <div class="num" @click="selectPerson" :data-num="j+13">{{item}}</div>
                    </div>
                    <div class="showMore" @click="showMoreNum">显示其他</div>
                </div>
            </mt-popup>
        </div>
        <home-header v-if="!isShow"></home-header>
    </div>

</template>

<script>
    import HomeHeader from "@/components/transition/trans";
    import {
        MessageBox,
        Indicator,
        Toast
    } from "mint-ui";

    export default {
        name: "home",
        components: {
            HomeHeader
        },
        data() {
            return {
                //商品渲染数组
                shopCartList: [{}],
                //是否允许关闭弹框
                isModalClose: false,
                //保存小计
                total: 0,
                //保存商品总数量
                totalCount: 0,
                //人数弹框
                personPopupVisible: this.$store.getters.getIsOrder === 'FALSE' ? true : false,
                //人数
                personNum: "",
                //控制下单按钮是否可再次点击
                isAddOrderBtnClick: true,
                //控制展示人数更多
                showMore: true,
                //备注
                uRemark: '',
                isShow: false
            };
        },
        methods: {
            //显示更多人数
            showMoreNum() {
                this.showMore = !this.showMore
            },
            jump() {
                this.$router.replace("/order");
            },
            //继续点餐
            selectPerson(e) {
                this.personNum = e.target.dataset.num;
                this.personPopupVisible = false;
            },
            //显示人数弹框
            showPerson() {
                this.personPopupVisible = true;
            },
            //点击下单按钮
            addGoodsOrder() {
                if (!this.isAddOrderBtnClick) {
                    return false;
                }
                if (this.$store.getters.getIsOrder === "FALSE" && (this.personNum == "" || this.personNum == null)) {
                    Toast({message: "请选择人数", position: "middle", duration: 3000});
                    return false;
                }
                if (this.$store.getters.getIsOrder === "FALSE" && !(this.uRemark === "" || this.uRemark == null) && this.isEmojiCharacter(this.uRemark)) {
                    Toast({message: "请正确填写您的备注,请不要包含非法字符.", position: "middle", duration: 3000});
                    return false;
                }
                this.isAddOrderBtnClick = false;
                let url;
                if(this.$store.getters.getIsStoreUser=="FALSE"){
                    url = this.common.baseURL + "mobi/goodsorder/add?store_id=" + this.$store.getters.getStoreId + "&store_menu_id=" + this.$store.getters.getMenuId;
                }else{
                    url = this.common.baseURL + "mobi/goodsorder/add?store_id=" + this.$store.getters.getStoreId + "&store_menu_id=" + this.$store.getters.getMenuId+"&store_user_id="+this.$store.getters.getStoreScanGoodsUser.id;
                }

                Indicator.open({
                    text: "正在下单中...",
                    spinnerType: "fading-circle"
                });
                let alipay_login_userid = "";
                let wx_openid = "";
                if (this.common.is_weixin()) {
                    wx_openid = this.$store.getters.getUserId;
                } else if (this.common.is_alipay()) {
                    alipay_login_userid = this.$store.getters.getUserId;
                }
                let goodsArray = new Array();
                for (let item of this.shopCartList) {
                    let remark = "";
                    for (let s of item.remarkList) {
                        remark += s + "/";
                    }
                    if (remark != "") {
                        remark = remark.substring(0, remark.length - 1)
                    }
                    goodsArray.push({
                        goods_id: item.id,
                        quantity: item.count,
                        specificationInfoList: item.specItemList,
                        remark: remark
                    });
                }
                this.axios.post(url, {
                    type: 0,
                    person_num: this.personNum,
                    remark: this.uRemark,
                    qr_code_num: this.$store.getters.getQrCode,
                    desk_no: this.$store.getters.getTableName,
                    alipay_login_userid: alipay_login_userid,
                    wx_openid: wx_openid,
                    goodsOrderInfoList: goodsArray
                }).then(result => {
                    if (result.data.result_code === "ok" && result.data.result_msg === "SUCCESS") {
                        this.$store.commit("shopCartList", JSON.stringify([]));
                        this.$store.commit("orderNum", result.data.goodsOrder.num);
                        this.$store.commit("isOrder", "TRUE");
                        this.$store.commit("personNum",this.personNum)
                        this.$router.push('afterDetails')
                        Indicator.close();
                    } else if (result.data.result_code === "error" && result.data.result_msg === "INSUFFICIENT_INVENTORY") {
                        Toast({message: "商品库存不足.", position: "middle", duration: 3000});
                        Indicator.close();
                        this.isAddOrderBtnClick = true;
                    } else {
                        Toast({message: "发送失败.", position: "middle", duration: 3000});
                        Indicator.close();
                        this.isAddOrderBtnClick = true;
                    }
                });
            },
            isEmojiCharacter(substring) {
                for (var i = 0; i < substring.length; i++) {
                    var hs = substring.charCodeAt(i);
                    if (0xd800 <= hs && hs <= 0xdbff) {
                        if (substring.length > 1) {
                            var ls = substring.charCodeAt(i + 1);
                            var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                            if (0x1d000 <= uc && uc <= 0x1f77f) {
                                return true;
                            }
                        }
                    } else if (substring.length > 1) {
                        var ls = substring.charCodeAt(i + 1);
                        if (ls == 0x20e3) {
                            return true;
                        }
                    } else {
                        if (0x2100 <= hs && hs <= 0x27ff) {
                            return true;
                        } else if (0x2B05 <= hs && hs <= 0x2b07) {
                            return true;
                        } else if (0x2934 <= hs && hs <= 0x2935) {
                            return true;
                        } else if (0x3297 <= hs && hs <= 0x3299) {
                            return true;
                        } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                            || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                            || hs == 0x2b50) {
                            return true;
                        }
                    }
                }
            },
        },
        created() {
            console.log(this.$store.getters.getStoreScanGoodsUser,typeof(this.$store.getters.getStoreScanGoodsUser))
            //进入details页面,购物车没有菜品
            if (this.$store.getters.getShopCartList == null || this.$store.getters.getShopCartList == undefined || this.$store.getters.getShopCartList.length == 0) {
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
            this.shopCartList = this.$store.getters.getShopCartList;
            //计算总价以及商品总数
            for (let item of this.shopCartList) {
                this.total = this.common.round(this.total + item.total_amount, 2);
                this.totalCount = this.totalCount + item.count;
            }

            window.setTimeout((result) => {
                this.isShow = true;
            }, 1000);

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

    .mui-content .info {
        background: #ffffff;
        border-radius: 5px;
        margin-top: 1.5rem;
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
    }

    .mui-content .info .title .name {
        font-weight: bold;
    }

    .mui-content .info .title .continue-btn {
        color: #ed5b5b;
    }

    .mui-content .info .title .continue-btn .mui-icon {
        font-size: 18px;
        color: #ed5b5b;
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
    }

    .mui-content .info .subtotal {
        text-align: right;
        width: 100%;
        position: relative;
    }

    .mui-content .info .subtotal .total .price {
        color: rgba(237, 91, 91, 1);
        font-size: 18px;
        font-weight: 600;
    }

    .mui-content .person {
        margin-top: 1.5rem;
        border-radius: 10px;
    }

    .mui-content .person .mint-cell {
        border-radius: 5px;
    }

    .footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        height: 50px;
        background: #fff;
        line-height: 50px;
        text-align: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }

    .footer .text {
        width: 60%;
        font-size: 12px;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        text-align: left;
        padding-left: 16px;

    }

    .footer .text .count {
        font-size: 16px;
        font-weight: 500;
        color: rgba(237, 91, 91, 1);
        padding: 0px 5px;
    }

    .footer .text .price {
        font-size: 16px;
        font-weight: 500;
        color: rgba(237, 91, 91, 1);
        padding: 0px 5px;
    }

    .footer .btn {
        width: 40%;
        color: #fff;
        height: 38px;
        line-height: 38px;
        text-align: center;
        display: inline-block;
        border: 0;
        background: #ed5b5b;
        border-radius: 24px;
        -webkit-box-shadow: 0px 0px 10px 0px rgba(237, 91, 91, 1);
        box-shadow: 0px 0px 10px 0px rgba(237, 91, 91, 1);
        margin: 6px 16px 6px 0;
    }

    .personModal {
        width: 95%;
        background: transparent;
        height: 70%;
    }

    .personModal .person-content {
        display: flex;
        height: 100%;
        flex-flow: row wrap;
        justify-content: space-around;
    }

    .personModal .person-content .container-num {
        width: 33.3333333%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 1rem 0;
    }

    .personModal .person-content .container-num .num {
        color: white;
        border: 1px solid #fff;
        border-radius: 100%;
        width: 3rem;
        height: 3rem;
        text-align: center;
        line-height: 3rem;
    }

    .personModal .showMore {
        text-align: center;
        width: 30%;
        height: 40px;
        line-height: 40px;
        color: white;
        padding-top: 1.6rem;
        font-weight: inherit;
    }

    .remark {
        margin-top: 1rem;
    }

    .remark textarea {
        font-size: 14px;
        border: 0;
        height: 5rem;
    }
</style>
