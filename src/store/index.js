import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        isOrder: sessionStorage.getItem('isOrder'),
        isTax: sessionStorage.getItem('isTax'),
        isTip: sessionStorage.getItem('isTip'),
        storeId: sessionStorage.getItem('storeId'),
        tableName: sessionStorage.getItem('tableName'),
        taxRate: sessionStorage.getItem('taxRate'),
        tipVal: sessionStorage.getItem('tipVal'),
        tipType: sessionStorage.getItem('tipType'),
        userId: sessionStorage.getItem('userId'),
        qrCode: sessionStorage.getItem('qrCode'),
        orderNum: sessionStorage.getItem('orderNum'),
        discount: sessionStorage.getItem('discount'),
        timeZone: sessionStorage.getItem('timeZone'),
        storeName: sessionStorage.getItem("storeName"),
        isNoTip: sessionStorage.getItem('isNoTip'),
        isCustomTip: sessionStorage.getItem('isCustomTip'),
        mandatoryTipRate: sessionStorage.getItem('mandatoryTipRate'),
        isMandatoryTip: sessionStorage.getItem('isMandatoryTip'),
        mandatoryTipPersonNum: sessionStorage.getItem('mandatoryTipPersonNum'),
        shopCartList: sessionStorage.getItem('shopCartList'),
        orderGoodsList: sessionStorage.getItem('orderGoodsList'),
        menuId: sessionStorage.getItem('menuId'),
        nowIntegralNumber: sessionStorage.getItem('nowIntegralNumber') || 0,
        openMembershipSystem: sessionStorage.getItem('openMembershipSystem') || 0,
        fromIntegralConvertRatio: sessionStorage.getItem('fromIntegralConvertRatio') || 0,
        toIntegralConvertRatio: sessionStorage.getItem('toIntegralConvertRatio') || 0,
        storeScanGoodsUser: sessionStorage.getItem('storeScanGoodsUser'),
        deductionIntegral: sessionStorage.getItem('deductionIntegral') || 0,
        isStoreUser:sessionStorage.getItem('isStoreUser')||"FALSE",
        isNullDiscount:sessionStorage.getItem('isNullDiscount'),
        isAfterDiscountTip:sessionStorage.getItem('isAfterDiscountTip'),
        isAfterDiscountTax:sessionStorage.getItem('isAfterDiscountTax'),
        personNum:sessionStorage.getItem('personNum'),
    },
    mutations: {
        isOrder(state, isOrder) {
            state.isOrder = isOrder;
            sessionStorage.setItem('isOrder', isOrder)
        },
        isTax(state, isTax) {
            state.isTax = isTax;
            sessionStorage.setItem('isTax', isTax)
        },
        isTip(state, isTip) {
            state.isTip = isTip;
            sessionStorage.setItem('isTip', isTip)
        },
        storeId(state, storeId) {
            state.storeId = storeId;
            sessionStorage.setItem('storeId', storeId)
        },
        tableName(state, tableName) {
            state.tableName = tableName;
            sessionStorage.setItem('tableName', tableName)
        },
        taxRate(state, taxRate) {
            state.taxRate = taxRate;
            sessionStorage.setItem('taxRate', taxRate)
        },
        tipVal(state, tipVal) {
            state.tipVal = tipVal;
            sessionStorage.setItem('tipVal', tipVal)
        },
        tipType(state, tipType) {
            state.tipType = tipType;
            sessionStorage.setItem('tipType', tipType)
        },
        userId(state, userId) {
            state.userId = userId;
            sessionStorage.setItem('userId', userId)
        },
        qrCode(state, qrCode) {
            state.qrCode = qrCode;
            sessionStorage.setItem('qrCode', qrCode)
        },
        orderNum(state, orderNum) {
            state.orderNum = orderNum;
            sessionStorage.setItem('orderNum', orderNum)
        },
        discount(state, discount) {
            state.discount = discount;
            sessionStorage.setItem('discount', discount)
        },
        timeZone(state, timeZone) {
            state.timeZone = timeZone;
            sessionStorage.setItem('timeZone', timeZone)
        },
        shopCartList(state, shopCartList) {
            state.shopCartList = shopCartList;
            sessionStorage.setItem('shopCartList', shopCartList)
        },
        orderGoodsList(state, orderGoodsList) {
            state.orderGoodsList = orderGoodsList;
            sessionStorage.setItem('orderGoodsList', orderGoodsList)
        },
        isNoTip(state, isNoTip) {
            state.isNoTip = isNoTip;
            sessionStorage.setItem('isNoTip', isNoTip)
        },
        isCustomTip(state, isCustomTip) {
            state.isCustomTip = isCustomTip;
            sessionStorage.setItem('isCustomTip', isCustomTip)
        },
        mandatoryTipRate(state, mandatoryTipRate) {
            state.mandatoryTipRate = mandatoryTipRate;
            sessionStorage.setItem('mandatoryTipRate', mandatoryTipRate)
        },
        isMandatoryTip(state, isMandatoryTip) {
            state.isMandatoryTip = isMandatoryTip;
            sessionStorage.setItem('isMandatoryTip', isMandatoryTip)
        },
        mandatoryTipPersonNum(state, mandatoryTipPersonNum) {
            state.mandatoryTipPersonNum = mandatoryTipPersonNum;
            sessionStorage.setItem('mandatoryTipPersonNum', mandatoryTipPersonNum)
        },
        menuId(state, menuId) {
            state.menuId = menuId;
            sessionStorage.setItem('menuId', menuId)
        },
        storeName(state, storeName) {
            state.storeName = storeName;
            sessionStorage.setItem('storeName', storeName)
        },
        nowIntegralNumber(state, nowIntegralNumber) {
            state.nowIntegralNumber = nowIntegralNumber;
            sessionStorage.setItem('nowIntegralNumber', nowIntegralNumber)
        },
        openMembershipSystem(state, openMembershipSystem) {
            state.openMembershipSystem = openMembershipSystem;
            sessionStorage.setItem('openMembershipSystem', openMembershipSystem)
        },
        fromIntegralConvertRatio(state, fromIntegralConvertRatio) {
            state.fromIntegralConvertRatio = fromIntegralConvertRatio;
            sessionStorage.setItem('fromIntegralConvertRatio', fromIntegralConvertRatio)
        },
        toIntegralConvertRatio(state, toIntegralConvertRatio) {
            state.toIntegralConvertRatio = toIntegralConvertRatio;
            sessionStorage.setItem('toIntegralConvertRatio', toIntegralConvertRatio)
        },
        storeScanGoodsUser(state,storeScanGoodsUser){
            state.storeScanGoodsUser = storeScanGoodsUser;
            sessionStorage.setItem('storeScanGoodsUser', storeScanGoodsUser)
        },
        deductionIntegral(state, deductionIntegral) {
            state.deductionIntegral = deductionIntegral;
            sessionStorage.setItem('deductionIntegral', deductionIntegral)
        },
        isStoreUser(state, isStoreUser) {
            state.isStoreUser = isStoreUser;
            sessionStorage.setItem('isStoreUser', isStoreUser)
        },
        isNullDiscount(state, isNullDiscount) {
            state.isNullDiscount = isNullDiscount;
            sessionStorage.setItem('isNullDiscount', isNullDiscount)
        },
        isAfterDiscountTip(state, isAfterDiscountTip) {
            state.isAfterDiscountTip = isAfterDiscountTip;
            sessionStorage.setItem('isAfterDiscountTip', isAfterDiscountTip)
        },
        isAfterDiscountTax(state, isAfterDiscountTax) {//isAfterDiscountTax
            state.isAfterDiscountTax = isAfterDiscountTax;
            sessionStorage.setItem('isAfterDiscountTax', isAfterDiscountTax)
        },
        personNum(state, personNum) {//isAfterDiscountTax
            state.personNum = personNum;
            sessionStorage.setItem('personNum', personNum)
        },
    },
    getters: {
        getIsOrder: function (state) {
            return state.isOrder;
        },
        getIsTax: function (state) {
            return state.isTax;
        },
        getIsTip: function (state) {
            return state.isTip;
        },
        getStoreId: function (state) {
            return state.storeId;
        },
        getTableName: function (state) {
            return state.tableName;
        },
        getTaxRate: function (state) {
            return state.taxRate;
        },
        getTipVal: function (state) {
            return state.tipVal;
        },
        getTipType: function (state) {
            return state.tipType;
        },
        getUserId: function (state) {
            return state.userId;
        },
        getQrCode: function (state) {
            return state.qrCode;
        },
        getOrderNum: function (state) {
            return state.orderNum;
        },
        getDiscount: function (state) {
            return state.discount;
        },
        getTimeZone: function (state) {
            return state.timeZone;
        },
        getShopCartList: function (state) {
            return JSON.parse(state.shopCartList);
        },
        getOrderGoodsList: function (state) {
            return JSON.parse(state.orderGoodsList);
        },
        getIsNoTip: function (state) {
            return state.isNoTip;
        },
        getIsCustomTip: function (state) {
            return state.isCustomTip;
        },
        getMandatoryTipRate: function (state) {
            return state.mandatoryTipRate;
        },
        getIsMandatoryTip: function (state) {
            return state.isMandatoryTip;
        },
        getMandatoryTipPersonNum: function (state) {
            return state.mandatoryTipPersonNum;
        },
        getMenuId: function (state) {
            return state.menuId;
        },
        getStoreName: function (state) {
            return state.storeName;
        },
        getNowIntegralNumber: function (state) {
            return state.nowIntegralNumber;
        },
        getOpenMembershipSystem: function (state) {
            return state.openMembershipSystem;
        },
        getFromIntegralConvertRatio: function (state) {
            return state.fromIntegralConvertRatio;
        },
        getToIntegralConvertRatio: function (state) {
            return state.toIntegralConvertRatio;
        },
        getStoreScanGoodsUser:function(state){
            return JSON.parse(state.storeScanGoodsUser) ;
        },
        getDeductionIntegral:function(state){
            return state.deductionIntegral ;
        },
        getIsStoreUser:function(state){
            return state.isStoreUser ;
        },
        getIsNullDiscount:function (state) {
            return state.isNullDiscount
        },
        getIsAfterDiscountTip:function (state) {
            return state.isAfterDiscountTip
        },
        getIsAfterDiscountTax:function (state) {
            return state.isAfterDiscountTax
        },
        getPersonNum:function (state) {
            return state.personNum
        }
    }
});
export default store;
