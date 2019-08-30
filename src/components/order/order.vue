<template>
    <div>
        <home-header v-show="!isGetData"></home-header>
        <div v-if="isGetData">
            <header class="mui-bar mui-bar-nav">
                <a class="mui-icon mui-icon-back" style="color:red" @click="jump"></a>
                <h1 class="mui-title">点餐</h1>
                <span class="float-right nav-bar-btn">桌号:{{this.$store.getters.getTableName}}</span>
            </header>
            <div class="mui-content mui-row mui-fullscreen">
                <div id="menuControlContent">
                    <button class="left menu-item" :class="i === 0 ? 'active' : '' " @click="scrollTag('item_'+i,i)"
                            :data-index="i" v-for="(item,i) in list" v-text="item.name" :key="i"/>
                </div>
                <div id="goodsControlContents">
                    <div class="goods-control-content" :id="'item_'+i" v-for="(item,i) in list" :key="i">
                        <div class="goods-title">///&nbsp;{{item.name}}&nbsp;///</div>
                        <div class="goods-item" v-for="(goods ,j) in item.goodsList" :key="j"
                             @click="showDetails($event,item,goods,item.id,j,i)">
                            <div class="goods-img"
                                 v-lazy:background-image="goods.photo === '' || goods.photo == null ? common.goodsImg : goods.photo + '?x-oss-process=image/resize,w_180'"></div>
                            <div class="goods-item-content" :data-meun_index="i" :data-goods_index="j">
                                <div class="name" :data-meun_index="i" :data-goods_index="j">{{goods.name}}</div>
                                <div class="goods-desc" v-if="goods.inventory_status == 1">剩余{{goods.quantity}}份</div>
                                <div class="price" :data-meun_index="i" :data-goods_index="j" :style="goods.discount!=1?'bottom:1.3rem':''">
                                    $
                                    <span>{{(goods.amount*goods.discount).toFixed(2)}}</span>
                                    <span v-if="goods.discount!=1">${{goods.amount.toFixed(2)}}</span>
                                </div>
                                <div class="discount-box" v-if="goods.discount!=1">
                                    <div class="discount-icon"></div>
                                    <div>{{(goods.discount*10).toFixed(2)}}折</div>
                                </div>
                                <div class="spec-btn" v-if="goods.hasOwnProperty('specificationInfoList')"
                                     :data-meun_index="i" :data-goods_index="j" @click="selectSpecClick">选规格
                                </div>
                                <div class="cart-btn" v-if="goods.hasOwnProperty('specificationInfoList') === false">
                                    <span class="icon-remove_circle_outline" :data-goods_id="goods.id"
                                          v-show="goods.num>0" @click="removeCount"></span>
                                    <span class="cart-count" v-show="goods.num>0">{{goods.num}}</span>
                                    <span class="icon-add_circle" :data-goods_id="goods.id"
                                          @click="(goods.inventory_status == 1 && goods.num >= goods.quantity) ? '' : (addCount($event) || flyBall($event))"></span>
                                </div>
                            </div>
                            <div class="goods-ysx" v-if="goods.inventory_status == 1 && goods.quantity == 0">
                                <img src="../../assets/img/ysx.png"/>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 底部悬浮div -->
                <div class="shopcart" :class="shopCartCount > 0 ? 'active' : ''"
                     :style="specPopupVisible || remarkPopupVisible || isShowDetails ? 'z-index:'+shopCartZIndex+';' : ''">
                    <div class="content-left" @click="toggleList">
                        <div id="shopcart-logo" class="shopcart-logo">
                            <div class="logo">
                                <i class="icon-shopping_cart"></i>
                            </div>
                            <div class="num" v-if="shopCartCount > 0">{{shopCartCount}}</div>
                        </div>
                        <div class="content">
                            <span class="subtotal-count" v-if="shopCartCount > 0">共{{shopCartCount}}份,合计:</span>
                            <span class="subtotal" v-if="shopCartCount > 0">${{shopCartPrice.toFixed(2)}}</span>
                            <span class="desc" v-if="shopCartCount === 0">未购选菜品</span>
                        </div>
                    </div>
                    <div class="content-right" :class="shopCartPrice > 0 ? 'active' : ''">
                        <div class="pay-btn" @click="clickPayment">{{this.$store.getters.getIsOrder === 'TRUE' ? '加单' :
                            '去下单'}}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <mt-popup v-model="remarkPopupVisible" :closeOnClickModal="remarkModal" popup-transition="popup-fade"
                  class="remark-modal">
            <div class="remark-hreader">
                <div class="title">忌口备注<span>(可多选)</span></div>
                <div class="close" @click="remarkPopupVisible = false"><span
                        class="mui-icon mui-icon-closeempty"></span></div>
            </div>
            <div class="remark-content">
                <div class="item-list">
                    <div class="item" @click="selectRemark" :data-index="i" v-for="(remarkInfo,i) of remarkList"
                         :key="i" :class="remarkInfo.active ? 'active' : ''">{{remarkInfo.name}}
                    </div>
                </div>
            </div>
            <div class="remark-footer">
                <div class="remark-btn" @click="addRemark">确定</div>
            </div>
        </mt-popup>
        <!--购物车弹窗-->
        <mt-popup v-model="shopCartPopupVisible" position="bottom" style="width:100%;margin-bottom:2.8rem;">
            <div class="shopcart-list-header">
                <div class="content">
                    <div class="title">购物车</div>
                    <div class="empty">
                        <span class="mui-icon-trash mui-icon"></span>
                        <span data-v-06568e26="" class="clear font-red" @click="emptyShopCart">清空</span>
                    </div>
                </div>
            </div>
            <div class="shopcart-list-content">
                <ul>
                    <li class="food" v-for="(item,i) of shopCartList" :key="i">
                        <div class="food-name-warp">
                            <div style="width: 100%;overflow: hidden;">
                                <p class="shop-title">{{item.name}}</p>
                                <p class="remark" @click="showRemark" :data-index=i><span :data-index=i>备注</span></p>
                            </div>
                            <p class="shop-lable">
                                <span class="lable-names" v-for="(itemSpec,j) in item.specItemList" :key="j">{{(j===0?'':'/')+itemSpec.name}}</span>
                                <span class="lable-names" v-for="(name,k) in item.remarkList"
                                      :key="k + (item.specItemList ? item.specItemList.length : 0) ">{{(k + (item.specItemList ? item.specItemList.length : 0)===(item.specItemList ? item.specItemList.length : 0)? ( item.specItemList && item.specItemList.length > 0 ? '/' : '') :'/')+name}}</span>
                            </p>
                        </div>
                        <div class="list-food-float-right">
                            <span class="font-red">${{(item.total_amount).toFixed(2)}}</span>
                            <div class="cart-btn">
                                <span class="icon-remove_circle_outline" :data-index=i
                                      @click="shopCartRemoveGoods"></span>
                                <span class="cart-count">{{item.count}}</span>
                                <span class="icon-add_circle" :data-index=i @click="shopCartAddGoods"></span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </mt-popup>
        <!-- 选规格弹窗 -->
        <mt-popup v-model="specPopupVisible" :closeOnClickModal="specModal" popup-transition="popup-fade"
                  class="spec-pop">
            <div class="spec-header">
                <div class="goods-name">{{goodsItem.name}}</div>
                <div class="spec-close mui-icon mui-icon-closeempty" @click="closeSpecModal"></div>
            </div>

            <!-- <div style="text-align:center">
              <div class="goods-icon" :style="'background-image:url('+prodectImgUrl+ '?x-oss-process=image/resize,w_340)'"></div>
            </div>
            <div class="product-desc linear" v-if="detailsMessge.goods.hasOwnProperty('description')">
              <div class="desc-text">{{detailsMessge.goods.description}}</div>
              <div style="text-align:center;" @click="MinStyle">
                <img src="../../assets/img/ShowMore.png">
              </div>
            </div> -->
            <div class="spec-list">
                <div class="spec-list-item" v-for="(specificationInfo,i) of goodsItem.specificationInfoList" :key="i">
                    <div class="spec-list-item-title">{{specificationInfo.name}}</div>
                    <div class="spec-cell">
                        <div class="spec-item" v-for="(list,j) of specificationInfo.lists" :key="j"
                             :class="j===0 ? 'spec-item-active' : ''" @click="selectSpec(i,list,$event)">
                            {{list.name}}&nbsp;{{list.amount === '' || list.amount ===null || list.amount == 0? '' :
                            '$'+parseFloat(list.amount).toFixed(2)}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="spec-footer">
                <div class="left">
                    <span class="spec-price"><span class="seat">$</span>{{specTotalAmount.toFixed(2)}}</span>
                    <span class="spec-text">({{specStr}})</span>
                </div>
                <div class="right">
                    <span class="spec-add-cart-btn"
                          @click="(goodsItem.inventory_status == 1 && goodsItem.num >= goodsItem.quantity) ? '' : (specAddCart($event,0) || flyBall($event))"
                          v-if="isSpecCartAdd === false"><span class="seat">+</span>加入购物车</span>
                    <div class="cart-btn" v-if="isSpecCartAdd">
                        <span class="icon-remove_circle_outline" @click="specRemoveCart"></span>
                        <span class="cart-count">{{specCount}}</span>
                        <span class="icon-add_circle"
                              @click="(goodsItem.inventory_status == 1 && goodsItem.num >= goodsItem.quantity) ? '' : (specAddCart($event,1) || flyBall($event))"></span>
                    </div>
                </div>
            </div>
        </mt-popup>
        <!-- 商品详情弹窗 -->
        <mt-popup v-model="isShowDetails" popup-transition="popup-fade" class="product-details">
            <div class="product-header" :style="'opacity:'+detailsMessgeHeaderOpacity">
                <p class="title">商品信息</p>
                <p class="product-close" @click="HideDetails"><i class="mui-icon mui-icon-closeempty"></i></p>
            </div>
            <div ref="wrapper" style="overflow: hidden;height: 100%;">
                <div>
                    <div class="product-media" :style="detailsMessgeStyle">
                        <div class="slide-bottom" @click="HideDetails">
                            <i class="mui-icon mui-icon-closeempty" :style="'color:#'+detailsMessgeClose+';'"></i>
                        </div>
                        <div class="icon-watermark">
                            图片仅供参考&nbsp;一切已实物为准
                        </div>
                    </div>
                    <div class="product-content">
                        <div class="product-name">{{detailsMessge.goods.name}}</div>
                        <div class="product-spec" v-if="detailsMessge.goods.hasOwnProperty('specificationInfoList')">
                            <div class="product-spec-list"
                                 v-for="(specificationInfo,i) of detailsMessge.goods.specificationInfoList" :key="i">
                                <div class="product-spec-title">{{specificationInfo.name}}</div>
                                <div class="product-spec-item">
                                    <div class="product-spec-item-text" @click="productSelectSpec(i,list,$event)"
                                         v-for="(list,j) of specificationInfo.lists" :key="j"
                                         :class="j===0 ? 'active' : ''">{{list.name}}&nbsp;{{list.amount === '' ||
                                        list.amount ===null || list.amount == 0? '' :
                                        '$'+parseFloat(list.amount).toFixed(2)}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="product-price">
                            <div class="price" v-if="detailsMessge.goods.discount==1">${{productTotalAmount.toFixed(2)}}</div>
                            <div v-if="detailsMessge.goods.discount!==1" style="font-size: 18px;color: red;">$
                                <span>{{(detailsMessge.goods.amount*detailsMessge.goods.discount).toFixed(2)}}</span>
                                <span style="text-decoration:line-through;color: #cccccc;font-size:14px; ">${{detailsMessge.goods.amount}}</span>
                            </div>
                            <!--<div class="price">${{productTotalAmount.toFixed(2)}}</div>-->
                            <div class="product-add-cart"
                                 v-if="detailsMessge.goods.hasOwnProperty('specificationInfoList')==false">
                                <div @click="(detailsMessge.goods.inventory_status == 1 && detailsMessge.goods.num >= detailsMessge.goods.quantity) ? '' : (addProductCount($event) || flyBall($event))"
                                     :data-goods_id="detailsMessge.goods.id"><span style="font-size:1.1rem">+</span>
                                    加入购物车
                                </div>
                            </div>
                            <div class="product-add-cart"
                                 v-if="detailsMessge.goods.hasOwnProperty('specificationInfoList')">
                                <div @click="(detailsMessge.goods.inventory_status == 1 && detailsMessge.goods.num >= detailsMessge.goods.quantity) ? '' : (addProductCount($event) || flyBall($event))"
                                     :data-goods_id="detailsMessge.goods.id"><span style="font-size:1.1rem">+</span>
                                    加入购物车
                                </div>
                            </div>
                            <!--<div class="cart-btn" v-if="detailsMessge.goods.hasOwnProperty('specificationInfoList') && productSpecCount>0">-->
                            <!--<span class="icon-remove_circle_outline" :data-goods_id="detailsMessge.goods.id" @click="removeProductCount"></span>-->
                            <!--<span class="cart-count">{{productSpecCount}}</span>-->
                            <!--<span class="icon-add_circle" :data-goods_id="detailsMessge.goods.id" @click="(detailsMessge.goods.inventory_status == 1 && detailsMessge.goods.num >= detailsMessge.goods.quantity) ? '' : (addProductCount($event) || flyBall($event))"></span>-->
                            <!--</div>-->
                            <!--<div class="cart-btn" v-if="detailsMessge.goods.hasOwnProperty('specificationInfoList')==false && detailsMessge.goods.num>0">-->
                            <!--<span class="icon-remove_circle_outline" :data-goods_id="detailsMessge.goods.id" v-show="detailsMessge.goods.num>0" @click="removeProductCount"></span>-->
                            <!--<span class="cart-count" v-show="detailsMessge.goods.num>0">{{detailsMessge.goods.num}}</span>-->
                            <!--<span class="icon-add_circle" :data-goods_id="detailsMessge.goods.id" @click="(detailsMessge.goods.inventory_status == 1 && detailsMessge.goods.num >= detailsMessge.goods.quantity) ? '' : (addProductCount($event) || flyBall($event))"></span>-->
                            <!--</div>-->
                        </div>

                    </div>
                    <div class="product-desc">
                        <div class="product-desc-title">商品详情</div>
                        <div class="product-desc-text"
                             v-text="detailsMessge.goods.hasOwnProperty('description')?detailsMessge.goods.description:'此人很懒,什么也没留下'">
                        </div>
                    </div>
                </div>

            </div>
        </mt-popup>
    </div>
</template>

<script>
    //引入过渡组件，正常情况该组建应设为全局组件
    import HomeHeader from "@/components/transition/trans";
    import taffy from "@/assets/js/taffy.js";
    import $ from 'jquery'
    import {MessageBox, Lazyload} from 'mint-ui';
    import BScroll from 'better-scroll'

    require("../../assets/js/fly.js");
    require('../../../commonFunction/common');
    export default {
        components: {
            HomeHeader,
        },
        data() {
            return {
                isGetData: false,
                //是否显示购物车
                shopCartPopupVisible: false,
                //是否显示规格
                specPopupVisible: false,
                //是否允许关闭规格
                specModal: false,
                //商品数据
                list: [{}],
                //数据库
                db: null,
                //购物车数量
                shopCartCount: 0,
                //购物车总价
                shopCartPrice: 0,
                //购物车商品列表
                shopCartList: [],
                //当前选中商品信息
                goodsItem: {},
                //是否显示规格里面加减按钮
                isSpecCartAdd: false,
                //规格商品总价
                specTotalAmount: 0,
                //选中规格字符串
                specStr: '',
                //当前选中规格数量
                specCount: 0,
                //控制左侧菜单类的样式
                isScrool: false,
                //控制点击图片显示的弹窗内容
                detailsMessge: {item: "", goods: ""},
                //商品详情也图片样式控制
                detailsMessgeStyle: "",
                //控制点击图片显示的弹窗显示
                isShowDetails: false,
                //控制商品详情的显示
                isProductSpec: true,
                //备注弹框
                remarkPopupVisible: false,
                //备注列表
                remarkList: [{name: "微辣", active: false}, {name: "不要葱", active: false}, {
                    name: "不要蒜",
                    active: false
                }, {name: "不要辣", active: false}],
                //当前选中购物车数据
                shopCartInfo: {},
                //备注弹框是否能关闭
                remarkModal: false,
                //购物车弹框z-index
                shopCartZIndex: 1999,
                //商品详情关闭
                detailsMessgeClose: '',
                //详情页面滚动初始化
                detailsMessgeScroll: '',
                //详情页头部显示
                detailsMessgeHeaderOpacity: 0,
                //详情页面总金额
                productTotalAmount: 0,
                //商品详情也当前选中规格数量
                productSpecCount: 0,
            };
        },
        methods: {
            //隐藏商品详情
            HideDetails() {
                this.isShowDetails = false;
            },
            //显示备注
            showRemark(e) {
                this.remarkPopupVisible = true;
                let that = this;
                $(".mint-popup").each(function () {
                    if ($(this).css("z-index") != "auto") {
                        let zIndex = parseInt($(this).css("z-index"));
                        if (zIndex > that.shopCartZIndex) {
                            that.shopCartZIndex = zIndex + 1;
                        }
                    }
                });
                let index = e.target.dataset.index;
                let shopCart = this.shopCartList[index];
                this.shopCartInfo = shopCart;
                for (let remarkInfo of this.remarkList) {
                    remarkInfo.active = false;
                    for (let name of shopCart.remarkList) {
                        if (remarkInfo.name === name) {
                            remarkInfo.active = true;
                        }
                    }
                }

            },
            //选择备注
            selectRemark(e) {
                let index = e.target.dataset.index;
                let remarkInfo = this.remarkList[index];
                this.$set(remarkInfo, 'active', remarkInfo.active ? false : true);
            },
            //添加备注
            addRemark() {
                let selectRemarkList = new Array();
                for (let remarkInfo of this.remarkList) {
                    if (remarkInfo.active) {
                        selectRemarkList.push(remarkInfo.name);
                    }
                }
                let where = "";
                if (this.shopCartInfo.specItem == "") {
                    where = {"id": this.shopCartInfo.id};
                } else {
                    where = {"id": this.shopCartInfo.id, "specItem": this.shopCartInfo.specItem};
                }
                this.db(where).update({"remarkList": selectRemarkList});
                this.updateShopCart();
                this.remarkPopupVisible = false;
            },
            //显示商品详情
            showDetails(e, item, goods, id, j, i) {
                this.productTotalAmount = 0;
                if (goods.inventory_status == 1 && goods.quantity == 0) {
                    return false;
                }
                let that = this;
                $(".mint-popup").each(function () {
                    if ($(this).css("z-index") != "auto") {
                        let zIndex = parseInt($(this).css("z-index"));
                        if (zIndex > that.shopCartZIndex) {
                            that.shopCartZIndex = zIndex - 1;
                        }
                    }
                });
                if (e.target.offsetParent == null) {
                    return
                }
                if (e.target.className == "spec-btn") {
                    return
                }
                if (e.target.offsetParent.className === "cart-btn") {
                    return;
                }
                let height = window.screen.height * 0.4;
                this.detailsMessgeHeaderOpacity = 0;
                if (this.detailsMessgeScroll) {
                    if (!(this.detailsMessge.goods.id == goods.id)) {
                        this.detailsMessgeScroll.refresh();
                    } else {
                        this.detailsMessgeScroll.scrollTo(0, 0, 0);
                    }
                } else {
                    this.detailsMessgeScroll = new BScroll(this.$refs.wrapper, {
                        scrollY: true,
                        click: true,
                        bounce: false,
                        probeType: 2
                    });
                }
                this.detailsMessgeScroll.on("scroll", (result) => {
                    let y = Math.abs(result.y);
                    if (y < 40) {
                        this.detailsMessgeHeaderOpacity = 0;
                    }
                    if (y > 40) {
                        this.detailsMessgeHeaderOpacity = ((y - 40) / 50).toFixed(2);
                    }
                    if (y > height - 40) {
                        $(".product-header").addClass("active");
                    } else {
                        $(".product-header").removeClass("active");
                    }
                });
                this.detailsMessge = {};
                this.detailsMessge = {item, goods, id, j, i};
                if (this.detailsMessge.goods.specificationInfoList && this.detailsMessge.goods.specificationInfoList.length > 0) {
                    this.productSpecCount = 0;
                    let specWhere = new Array();
                    for (let specItem of this.detailsMessge.goods.specificationInfoList) {
                        let i = 0;
                        for (let specificationInfo of specItem.lists) {
                            if (i == 0) {
                                if (specificationInfo.amount != "") {
                                    this.productTotalAmount = this.productTotalAmount + parseFloat(specificationInfo.amount);
                                }
                                specificationInfo.active = true;
                                specWhere.push(specificationInfo);
                            } else {
                                specificationInfo.active = false;
                            }
                            i++
                        }
                    }
                    let where = {"id": this.detailsMessge.goods.id, "specItem": JSON.stringify(specWhere)};
                    if (this.db(where).first()) {
                        this.productSpecCount = this.db(where).first().count;
                    }
                }
                this.productTotalAmount = this.productTotalAmount + this.detailsMessge.goods.amount;
                $(".product-media").css({"background-repeat": "", "background-size": ""});
                this.detailsMessgeStyle += 'height:' + height + 'px;';
                if (this.detailsMessge.goods.photo === '' || this.detailsMessge.goods.photo == null) {
                    this.detailsMessgeStyle += 'background-image:url(\'' + this.common.goodsImg + '\');';
                    this.detailsMessgeClose = '000';

                } else {
                    let width = $(window).width() * 0.9;
                    // $.get(this.detailsMessge.goods.photo+"?x-oss-process=image/info",(result) => {
                    //     console.log(result.ImageWidth.value);
                    //     console.log((result.ImageHeight.value/parseInt(height)));
                    //     console.log(parseInt(result.ImageWidth.value/(result.ImageHeight.value/parseInt(height))));
                    //     let img_x  = parseInt(parseInt(result.ImageWidth.value/(result.ImageHeight.value/parseInt(height))) - width - 50);
                    //     if(img_x < 0){
                    //       img_x = 10;
                    //     }
                    this.detailsMessgeStyle += 'background-image:url(\'' + this.detailsMessge.goods.photo + '?x-oss-process=image/resize,h_' + parseInt(height) + '\');';
                    this.detailsMessgeStyle += 'background-repeat: no-repeat;background-size: cover;'
                    //     $.get(this.detailsMessge.goods.photo+"?x-oss-process=image/average-hue",(resultAverage) => {
                    //       this.detailsMessgeClose = this.ColorReverse(resultAverage.RGB);
                    //     });
                    // });
                }
                this.isShowDetails = true;
            },
            //获取rgb反向颜色
            ColorReverse(OldColorValue) {
                let str = "000000" + (0xFFFFFF - OldColorValue).toString(16);
                return str.substring(str.length - 6, str.length);
            },
            addProductCount(e) {
                console.log(this.detailsMessge)
                if (this.detailsMessge.goods.specificationInfoList && this.detailsMessge.goods.specificationInfoList.length > 0) {
                    let specItem = new Array();
                    for (let specificationInfo of this.detailsMessge.goods.specificationInfoList) {
                        for (let list of specificationInfo.lists) {
                            if (list.active) {
                                specItem.push(list);
                            }
                        }
                    }
                    let where = {"id": this.detailsMessge.goods.id, "specItem": JSON.stringify(specItem)};
                    if (this.db(where).first()) {
                        this.db(where).update({"count": this.db(where).first().count + 1});
                        this.productSpecCount = this.db(where).first().count;
                        // this.specCount = this.db(where).first().count;
                    } else {
                        this.db.insert({
                            "id": this.detailsMessge.goods.id,
                            "name": this.detailsMessge.goods.name,
                            "count": 1,
                            "amount": this.detailsMessge.goods.amount,
                            "specItem": JSON.stringify(specItem),
                            "remarkList": [],
                            "inventory_status": this.detailsMessge.goods.inventory_status,
                            "goods_quantity": this.detailsMessge.goods.quantity,
                            "discount":this.detailsMessge.goods.discount
                        });
                        this.productSpecCount = 1;
                    }
                } else {
                    let where = {"id": this.detailsMessge.goods.id};
                    if (this.db(where).first()) {
                        this.db(where).update({"count": this.db(where).first().count + 1});
                    } else {
                        this.db.insert({
                            "id": this.detailsMessge.goods.id,
                            "name": this.detailsMessge.goods.name,
                            "count": 1,
                            "amount": this.detailsMessge.goods.amount,
                            "specItem": "",
                            "remarkList": [],
                            "inventory_status": this.detailsMessge.goods.inventory_status,
                            "goods_quantity": this.detailsMessge.goods.quantity,
                            "discount":this.detailsMessge.goods.discount
                        });
                    }
                }
                this.refreshGoods(this.detailsMessge.goods.id);
                this.updateShopCart();
                this.isShowDetails = false;
            },
            //移除商品详情商品
            removeProductCount(e) {
                if (this.detailsMessge.goods.specificationInfoList && this.detailsMessge.goods.specificationInfoList.length > 0) {
                    let specItem = new Array();
                    for (let specificationInfo of this.detailsMessge.goods.specificationInfoList) {
                        for (let list of specificationInfo.lists) {
                            if (list.active) {
                                specItem.push(list);
                            }
                        }
                    }
                    let where = {"id": this.detailsMessge.goods.id, "specItem": JSON.stringify(specItem)};
                    let count = this.db(where).first().count - 1;
                    if (count <= 0) {
                        this.db(where).remove();
                        this.productSpecCount = 0;
                    } else {
                        this.productSpecCount = count;
                        this.db(where).update({"count": count});
                    }
                } else {
                    let where = {"id": this.detailsMessge.goods.id};
                    let count = this.db(where).first().count - 1;
                    if (count <= 0) {
                        this.db(where).remove();
                    } else {
                        this.db(where).update({"count": count});
                    }
                }
                this.refreshGoods(this.detailsMessge.goods.id);
                this.updateShopCart();
            },
            //商品详情规格选择事件
            productSelectSpec(specIndex, item, e) {
                this.productTotalAmount = 0;
                this.productSpecCount = 0;
                let lists = this.detailsMessge.goods.specificationInfoList[specIndex].lists;
                for (let i = 0; i < lists.length; i++) {
                    this.detailsMessge.goods.specificationInfoList[specIndex].lists[i].active = false;
                }
                item.active = true;
                $(e.currentTarget).parent().find(".product-spec-item-text").removeClass("active");
                $(e.currentTarget).addClass("active");
                let specItem = new Array();
                let specificationInfoList = this.detailsMessge.goods.specificationInfoList;
                let specItemList = new Array();
                for (let specificationInfo of specificationInfoList) {
                    for (let list of specificationInfo.lists) {
                        if (list.active) {
                            if (list.amount != "") {
                                this.productTotalAmount = this.productTotalAmount + parseFloat(list.amount);
                            }
                            specItemList.push(list);
                        }
                    }
                }
                this.productTotalAmount = this.productTotalAmount + this.detailsMessge.goods.amount;
                let where = {"id": this.detailsMessge.goods.id, "specItem": JSON.stringify(specItemList)};
                if (this.db(where).first()) {
                    this.productSpecCount = this.db(where).first().count;
                }
            },
            flyBall(event) {
                let offset = $("#shopcart-logo").offset();
                let flyer = $('<div style="z-index: 10000;border-radius: 50%;background:red;width:15px;height:15px;"></div>');
                //飞入商品图片
                flyer.fly({
                    start: {
                        left: event.pageX - 20, //开始位置（必填）#fly元素会被设置成position: fixed
                        top: event.pageY - 20 //开始位置（必填）
                    },
                    end: {
                        left: offset.left + 20, //结束位置（必填）
                        top: offset.top + 20, //结束位置（必填）
                        width: 20, //结束时宽度
                        height: 20 //结束时高度
                    },
                    onEnd: function () { //结束回调
                        $(flyer).remove()
                    }
                });
            },
            //点击左侧菜单类，右侧菜单滚动
            scrollTag(idName, index) {
                this.isScrool = true
                //要滚动目的的目标id
                let offsetTop = document.getElementById(idName).offsetTop
                //要减去的元素高度
                let offsetHeight = document.getElementsByClassName("goods-title")[0].offsetHeight
                //滚动区域id
                $('#goodsControlContents').animate({
                    scrollTop: offsetTop - offsetHeight
                }, 200, () => {
                    this.isScrool = false
                });
                //修改左侧菜单样式
                let eleList = document.getElementById('menuControlContent').querySelectorAll('.left');
                for (let i = 0; i < eleList.length; i++) {
                    eleList[i].classList.remove('active')
                }
                eleList[index].classList.add("active")
                // $('#goodsControlContents').animate({
                //   scrollTop: offsetTop - offsetHeight
                // }, 200, 'swing', () => {
                //   this.isScrool = false
                // });
            },
            jump() {
                if (this.$store.getters.getIsOrder === "TRUE") {
                    this.$router.replace("/afterDetails");
                } else {
                    this.$router.replace("/Home");
                }
            },
            //页面初始化 获取数据  组件创建后触发一次
            LoadMore() {
                if (this.$store.getters.getQrCode === '' || this.$store.getters.getQrCode == null) {
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
                //商家的编号
                let qr_num = "";
                let url = this.common.baseURL + "/mobi/store/goods/list?qr_num=" + this.$store.getters.getQrCode;
                this.axios.post(url, {}, {headers: {'Content-type': 'application/json'}}).then(result => {
                    this.list = result.data.categoryList;
                    // console.log(this.list)
                    this.db = taffy();
                    if (this.$store.getters.getShopCartList != null && this.$store.getters.getShopCartList.length > 0) {
                        for (let shopCart of  this.$store.getters.getShopCartList) {
                            this.db.insert(shopCart);
                            this.shopCartCount += shopCart.count;
                        }
                        this.updateShopCart();
                    }
                    //给每个菜系的菜品都强行赋值一个num属性,用于点菜
                    for (let item of this.list) {
                        for (let row of item.goodsList) {
                            if (row.specificationInfoList && row.specificationInfoList.length > 0) {
                                row.num = 0;
                                this.db().each((result) => {
                                    if (result.id == row.id) {
                                        row.num += result.count;
                                    }
                                });
                            } else {
                                let where = {"id": row.id};
                                if (this.db(where).first()) {
                                    row.num = this.db(where).first().count;
                                } else {
                                    row.num = 0;
                                }
                            }
                        }
                    }
                    //数据获取到后,关闭过渡组件
                    this.isGetData = true;
                });
            },
            //添加一个商品
            addCount(e) {
                let goodsId = parseInt(e.target.dataset.goods_id); //商品ID
                // if(!(this.checkQuantity(goodsId,"ADD"))){
                //   return false;
                // }
                let flag = false;
                for (let item of this.list) {
                    for (let goods of item.goodsList) {
                        if (goodsId == goods.id) {
                            //查询条件
                            let where = {"id": goodsId};
                            if (this.db(where).first()) {
                                this.db(where).update({"count": this.db(where).first().count + 1});
                            } else {
                                this.db.insert({
                                    "id": goods.id,
                                    "name": goods.name,
                                    "count": 1,
                                    "amount": goods.amount,
                                    "specItem": "",
                                    "remarkList": [],
                                    "inventory_status": goods.inventory_status,
                                    "goods_quantity": goods.quantity,
                                    "discount": goods.discount
                                });
                            }
                            flag = true;
                            break;
                        }
                    }
                    if (flag) {
                        break;
                    }
                }
                this.refreshGoods(goodsId);
                this.updateShopCart();
            },
            //刷新商品
            refreshGoods(goodsId) {
                for (let item of this.list) {
                    for (let goods of item.goodsList) {
                        if (goodsId == goods.id) {
                            if (goods.specificationInfoList && goods.specificationInfoList.length > 0) {
                                goods.num = 0;
                                this.db().each((result) => {
                                    if (result.id == goodsId) {
                                        goods.num += result.count;
                                    }
                                });
                            } else {
                                let where = {"id": goodsId};
                                if (this.db(where).first()) {
                                    goods.num = this.db(where).first().count;
                                } else {
                                    goods.num = 0;
                                }
                            }
                        }
                    }
                }
            },
            //移除一个商品
            removeCount(e) {
                let goodsId = parseInt(e.target.dataset.goods_id); //商品ID
                let flag = false;
                for (let item of this.list) {
                    for (let goods of item.goodsList) {
                        if (goodsId == goods.id) {
                            //查询条件
                            let where = {"id": goodsId};
                            let count = this.db(where).first().count - 1;
                            if (count <= 0) {
                                this.db(where).remove();
                            } else {
                                this.db(where).update({"count": count});
                            }
                            flag = true;
                            break;
                        }
                    }
                    if (flag) {
                        break;
                    }
                }
                this.refreshGoods(goodsId);
                this.updateShopCart();
            },
            //购物车移除商品
            shopCartRemoveGoods(e) {
                let index = e.target.dataset.index;
                let shopCart = this.shopCartList[index];
                let flag = false;
                for (let item of this.list) {
                    for (let goods of item.goodsList) {
                        if (goods.id == shopCart.id) {
                            let where = "";
                            if (shopCart.specItem == "") {
                                where = {"id": shopCart.id};
                            } else {
                                where = {"id": shopCart.id, "specItem": shopCart.specItem};
                            }
                            let count = this.db(where).first().count - 1;
                            if (count <= 0) {
                                this.db(where).remove();
                            } else {
                                this.db(where).update({"count": count});
                            }
                            flag = true;
                            break;
                        }
                    }
                    if (flag) {
                        break;
                    }
                }
                this.refreshGoods(shopCart.id);
                this.updateShopCart();
            },
            //购物车添加商品
            shopCartAddGoods(e) {
                let index = e.target.dataset.index;
                let shopCart = this.shopCartList[index];
                let flag = false;
                for (let item of this.list) {
                    for (let goods of item.goodsList) {
                        if (goods.id == shopCart.id) {
                            if (goods.inventory_status == 1 && goods.num >= goods.quantity) {
                                flag = true;
                                break;
                            }
                            let where = "";
                            if (shopCart.specItem == "") {
                                where = {"id": shopCart.id};
                            } else {
                                where = {"id": shopCart.id, "specItem": shopCart.specItem};
                            }
                            this.db(where).update({"count": this.db(where).first().count + 1});
                            flag = true;
                            break;
                        }
                    }
                    if (flag) {
                        break;
                    }
                }
                this.refreshGoods(shopCart.id);
                this.updateShopCart();
            },
            //清空购物车
            emptyShopCart() {
                let result = confirm("您确定清空购物车?")
                if (result) {
                    this.db().remove();
                    this.shopCartCount = 0;
                    this.updateShopCart();
                    for (let i = 0; i < this.list.length; i++) {
                        let list = this.list[i];
                        for (let j = 0; j < list.goodsList.length; j++) {
                            let gooditem = list.goodsList[j];
                            gooditem.num = 0
                        }
                    }
                }
            },
            //显示或隐藏购物车内容
            toggleList() {
                if (this.shopCartCount > 0) {
                    if (!this.shopCartPopupVisible) {
                        this.specPopupVisible = false;
                    }
                    this.shopCartPopupVisible = !this.shopCartPopupVisible;
                }
            },
            //点击选择规格按钮事件
            selectSpecClick(e) {
                let that = this;
                $(".mint-popup").each(function () {
                    if ($(this).css("z-index") != "auto") {
                        let zIndex = parseInt($(this).css("z-index"));
                        if (zIndex > that.shopCartZIndex) {
                            that.shopCartZIndex = zIndex + 1;
                        }
                    }
                });
                // this.isShowDetails=false
                this.specPopupVisible = true;
                this.goodsItem = {};
                this.specTotalAmount = 0;
                this.specStr = '';
                this.specCount = 0;
                let menuIndex = e.target.dataset.meun_index; //当前分类数据下标
                let goodsIndex = e.target.dataset.goods_index;  //当前分类下商品数组下标
                let item = this.list[menuIndex].goodsList[goodsIndex];
                let specWhere = new Array();
                // console.log(item)
                for (let specItem of item.specificationInfoList) {
                    let i = 0;
                    for (let specificationInfo of specItem.lists) {
                        if (i == 0) {
                            if (specificationInfo.amount != "") {
                                this.specTotalAmount = this.specTotalAmount + parseFloat(specificationInfo.amount);
                            }
                            this.specStr += specificationInfo.name + ",";
                            specificationInfo.active = true;
                            specWhere.push(specificationInfo);
                        } else {
                            specificationInfo.active = false;
                        }
                        i++
                    }
                }
                this.specTotalAmount = this.specTotalAmount + item.amount;
                this.specStr = this.specStr.substring(0, this.specStr.length - 1);
                //查询当前选中规格是否已添加
                //   let where = {"id" : item.id,"specItem":JSON.stringify(specWhere)};
                //   if(this.db(where).first()){
                //     this.specCount = this.db(where).first().count;
                //     this.isSpecCartAdd = true;
                //   }else{
                //     this.isSpecCartAdd = false;
                //   }
                this.goodsItem = item;

            },
            //关闭规格弹框
            closeSpecModal() {
                this.specPopupVisible = false;
                this.specCount = 0;
                this.specStr = '';
                this.goodsItem = '';
                this.isSpecCartAdd = false;
                this.specTotalAmount = 0;

            },
            //获取当前选中规格
            selectedSpecItem() {
                let specItem = new Array();
                let specificationInfoList = this.goodsItem.specificationInfoList;
                for (let specificationInfo of specificationInfoList) {
                    for (let list of specificationInfo.lists) {
                        if (list.active) {
                            specItem.push(list);
                        }
                    }
                }
                return specItem;
            },
            //规格选中事件
            selectSpec(specIndex, item, e) {
                this.specTotalAmount = 0;
                this.specStr = '';
                this.specCount = 0;
                $(e.currentTarget).parent().find(".spec-item").removeClass("spec-item-active");
                $(e.currentTarget).addClass("spec-item-active");
                let lists = this.goodsItem.specificationInfoList[specIndex].lists;
                for (let i = 0; i < lists.length; i++) {
                    this.goodsItem.specificationInfoList[specIndex].lists[i].active = false;
                }
                item.active = true;
                let specItemList = this.selectedSpecItem();
                for (let specItem of specItemList) {
                    if (specItem.amount != "") {
                        this.specTotalAmount = this.specTotalAmount + parseFloat(specItem.amount);
                    }
                    this.specStr += specItem.name + ",";
                }
                this.specTotalAmount = this.specTotalAmount + this.goodsItem.amount;
                this.specStr = this.specStr.substring(0, this.specStr.length - 1);
                //查询当前选中规格是否已添加
                // let where = {"id" : this.goodsItem.id,"specItem":JSON.stringify(specItemList)};
                // if(this.db(where).first()){
                //   this.specCount = this.db(where).first().count;
                //   this.isSpecCartAdd = true;
                // }else{
                //   this.isSpecCartAdd = false;
                // }
            },
            //规格加入购物车
            specAddCart() {
                let selectSpecItemList = this.selectedSpecItem();
                if (selectSpecItemList.length === 0) {
                    return false;
                }
                let where = {"id": this.goodsItem.id, "specItem": JSON.stringify(selectSpecItemList)};
                console.log(this.goodsItem)
                if (this.db(where).first()) {
                    this.db(where).update({"count": this.db(where).first().count + 1});
                    this.specCount = this.db(where).first().count;
                } else {
                    this.db.insert({
                        "id": this.goodsItem.id,
                        "name": this.goodsItem.name,
                        "count": 1,
                        "amount": this.goodsItem.amount,
                        "specItem": JSON.stringify(selectSpecItemList),
                        "remarkList": [],
                        "inventory_status": this.goodsItem.inventory_status,
                        "goods_quantity": this.goodsItem.quantity,
                        "discount":this.goodsItem.discount
                    });
                    this.specCount = 1;
                }
                // this.isSpecCartAdd = true;
                this.updateShopCart();
                this.refreshGoods(this.goodsItem.id);
                this.closeSpecModal();

            },
            //规格商品从购物车移除一个
            specRemoveCart() {
                let selectSpecItemList = this.selectedSpecItem();
                if (selectSpecItemList.length === 0) {
                    return false;
                }
                let where = {"id": this.goodsItem.id, "specItem": JSON.stringify(selectSpecItemList)};
                let count = this.db(where).first().count - 1;
                if (count <= 0) {
                    this.db(where).remove();
                    this.specCount = 0;
                    this.isSpecCartAdd = false;
                } else {
                    this.specCount = count;
                    this.db(where).update({"count": count});
                }
                this.refreshGoods(this.goodsItem.id);
                this.updateShopCart();
            },
            //更新购物车
            updateShopCart() {
                let totalAmount = 0; //总金额
                let totalCount = 0;
                this.shopCartList = [];
                this.db().each((result) => {
                    let goodsTotalAmount = this.common.round((result.amount * result.discount * result.count), 2);
                    if (result.specItem != "") {
                        var specItems = JSON.parse(result.specItem);
                        for (let item of specItems) {
                            if (item.amount != "") {
                                goodsTotalAmount = goodsTotalAmount + this.common.round((parseFloat(item.amount) * result.count), 2);
                            }
                        }
                        result.specItemList = specItems;
                    }
                    totalCount = totalCount + result.count;
                    result.total_amount = goodsTotalAmount;
                    totalAmount = totalAmount + goodsTotalAmount;
                    this.shopCartList.push(result);
                });
                this.shopCartCount = totalCount;
                this.shopCartPrice = totalAmount;
                this.$store.commit("shopCartList", JSON.stringify(this.shopCartList));
                if (this.shopCartList.length === 0) {
                    this.shopCartPopupVisible = false;
                }
            },
            //去下单
            clickPayment() {
                if (this.shopCartPrice > 0) {
                    this.$router.replace("/details");
                }
            },
            //初始化菜单两栏的数据
            init() {
                //配合watch实现 在获取到初始化数据后,在指令执行完毕后,确保是最新的dom,再执行原生dom操作
                this.$nextTick(function () {
                    /*DOM更新了*/
                    //默认选中第一个
                    let _this = this

                    if (this.isScrool == false) {
                        var controls = document.getElementById("menuControlContent");
                        var contents = document.getElementById("goodsControlContents");
                        // controls.querySelector(".menu-item").classList.add("active");
                        (function () {
                            var controlsElem = document.getElementById("menuControlContent");
                            var contentsElem = document.getElementById(
                                "goodsControlContents"
                            );

                            var controlListElem = controlsElem.querySelectorAll(
                                ".menu-item"
                            );
                            var contentListElem = contentsElem.querySelectorAll(
                                ".goods-control-content"
                            );
                            var controlWrapperElem = controlsElem.parentNode;
                            var controlWrapperHeight = controlWrapperElem.offsetHeight;
                            var controlMaxScroll =
                                controlWrapperElem.scrollHeight - controlWrapperHeight; //左侧类别最大可滚动高度
                            var maxScroll = contentsElem.scrollHeight - contentsElem.offsetHeight; //右侧内容最大可滚动高度
                            var controlHeight = controlListElem[0].offsetHeight; //左侧类别每一项的高度
                            var controlTops = []; //存储control的scrollTop值
                            var contentTops = [0]; //存储content的scrollTop值
                            var length = contentListElem.length;
                            for (var i = 0; i < controlListElem.length; i++) {
                                controlTops.push(controlListElem[i].offsetTop + controlHeight);
                            }
                            for (var i = 1; i < length; i++) {
                                var offsetTop = contentListElem[i].offsetTop;
                                if (offsetTop + 100 >= maxScroll) {
                                    var height = Math.max(offsetTop + 100 - maxScroll, 100);
                                    var totalHeight = 0;
                                    var heights = [];
                                    for (var j = i; j < length; j++) {
                                        var offsetHeight = contentListElem[j].offsetHeight;
                                        totalHeight += offsetHeight;
                                        heights.push(totalHeight);
                                    }
                                    for (var m = 0, len = heights.length; m < len; m++) {
                                        contentTops.push(
                                            parseInt(
                                                maxScroll - (height - (heights[m] / totalHeight) * height)
                                            )
                                        );
                                    }
                                    break;
                                } else {
                                    contentTops.push(parseInt(offsetTop));
                                }
                            }
                            contentsElem.addEventListener("scroll", function () {
                                var scrollTop = contentsElem.scrollTop + 53;
                                for (var i = 0; i < length; i++) {
                                    var offsetTop = contentTops[i];
                                    var offset = Math.abs(offsetTop - scrollTop);
                                    if (scrollTop < offsetTop) {
                                        if (scrollTop >= maxScroll) {
                                            onScroll(length - 1);
                                        } else {
                                            onScroll(i - 1);
                                        }
                                        break;
                                    } else if (offset < 20) {
                                        onScroll(i);
                                        break;
                                    } else if (scrollTop >= maxScroll) {
                                        onScroll(length - 1);
                                        break;
                                    }
                                }
                            });
                            var lastIndex = 0;
                            //监听content滚动
                            var onScroll = (index) => {
                                if (_this.isScrool) {
                                    return
                                }
                                if (lastIndex !== index) {
                                    lastIndex = index;
                                    var lastActiveElem = controlsElem.querySelector(".active");
                                    lastActiveElem && lastActiveElem.classList.remove("active");
                                    var currentElem = controlsElem.querySelector(
                                        ".menu-item:nth-child(" + (index + 1) + ")"
                                    );
                                    currentElem.classList.add("active");
                                    //简单处理左侧分类滚动，要么滚动到底，要么滚动到顶
                                    var controlScrollTop = controlWrapperElem.scrollTop;
                                    if (
                                        controlScrollTop + controlWrapperHeight <
                                        controlTops[index]
                                    ) {
                                        controlWrapperElem.scrollTop = controlMaxScroll;
                                    } else if (
                                        controlScrollTop >
                                        controlTops[index] - controlHeight
                                    ) {
                                        controlWrapperElem.scrollTop = 0;
                                    }
                                }
                            };
                        })();
                    }
                });
            }
        },
        created() {
            this.LoadMore();

            // let str = Base64.encode("Hell图片服务器");
            //   let str = Base64.encode("图片仅限参考 请以实物为准");
            //str.replace("+","-").replace("/","_")
            // console.log(str.replace(new RegExp("/","gm"),"_").replace(new RegExp("[+]","gm"),"-") );
        },
        mounted: function () {
            // let box = document.getElementById("viewBox");
            // console.log(this.$refs.viewBox);
            // 监听这个dom的scroll事件
            // box.addEventListener('scroll', (e) => {
            // console(e);
            // console.log(" scroll " + document.getElementById("viewBox").scrollTop)
            //以下是我自己的需求，向下滚动的时候显示“我是有底线的（类似支付宝）”
            // this.isScroll=this.$refs.viewBox.scrollTop>0
            // }, false)
            // window.addEventListener('onscroll', this.handleScroll)
            //给页面绑定滑轮滚动事件
        },
        watch: {
            list: {
                //watch配合以下代码,可实现在数据改变后,指令执行后,执行dom操作
                /* this.$nextTick(function(){}) */
                handler: function (newVal, oldVal) {
                    this.init();
                }
            }
        },
        computed: {}
    };
</script>

<style scoped>
    @import "../../assets/css/order";

    div[lazy=loading] {
        background-image: url("data:image/png;base64,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") !important;
    }
</style>
