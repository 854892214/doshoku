<template>
    <div id="tip-content">
        <div class="title">添加小费</div>
        <div class="tip-cell">
            <div class="tip-item"
                 v-if="this.$store.getters.getIsNoTip === 'TRUE' && this.$store.getters.getIsMandatoryTip === 'FALSE'"
                 @click="selectTip($event,true)" :data-price="0">
                无小费
            </div>
            <div class="tip-item" v-for="tip of tipList" @click="selectTip" :data-price="tip.tipAmount.toFixed(2)">
                小费：{{tip.tipVal * 100}}%(${{tip.tipAmount.toFixed(2)}})
            </div>
            <div class="" style="background: rgba(243,243,243,1);width: 100%;"
                 v-if="((this.$store.getters.getIsCustomTip === 'TRUE' && this.$store.getters.getIsMandatoryTip === 'TRUE' && this.personNum < this.$store.getters.getMandatoryTipPersonNum) || (this.$store.getters.getIsCustomTip === 'TRUE' && this.$store.getters.getIsMandatoryTip === 'FALSE'))">
                <div class="input-warp" @click="showKeyBord"><span>$</span><span id="Js_tip_input" class="tip-input-val"
                                                                                 style="padding-left: 10px;">{{tipInputVal}}</span>
                </div>
                <div @click="selectTip($event,true)" :data-price="0" class="addInputTip">添加</div>
            </div>
        </div>
        <!--<div class="saveTipBtn" @click="saveTip">确认</div>-->
    </div>
</template>

<script>
    export default {
        name: "hello",
        data() {
            return {
                tipList: [],
                //保存选中小费
                tipAmount: 0,
                //是否小费是输录框
                isTipInput: false,
                //是否显示输了小费按钮
                isInputShow: false,
                isTipNotShow: false
            };
        },
        methods: {
            selectTip(e, isTipInput) {
                this.$emit("clickSaveTip", parseFloat(e.target.dataset.price), isTipInput);
                // this.selectTipStyle(e);
                // this.isTipInput = false;
                // this.tipAmount = parseFloat(e.target.dataset.price);
            },
            showKeyBord(e) {
                this.selectTipStyle(e);
                this.isTipInput = true;
                this.$emit("showTipKeyBord", true);
            },
            //控制选中样式
            selectTipStyle(e) {
                let tipContent = document.getElementById("tip-content");
                let active = tipContent.querySelector(".active");
                if (active) {
                    active.classList.remove("active");
                }
                e.target.className += " active";
            },
            //确认小费
            saveTip(e) {
                // this.$emit("clickSaveTip", this.tipAmount,this.isTipInput);
            }
        },
        props: ["afterDiscountTotal", "tipInputVal", "personNum","total","tax"],
        created() {
            let tipList = this.$store.getters.getTipVal.split(",");
            for (let item of tipList) {
                if (this.$store.getters.getIsMandatoryTip === 'TRUE' && this.personNum > this.$store.getters.getMandatoryTipPersonNum && item <= this.$store.getters.getMandatoryTipRate) {
                    continue;
                }
                let tip = 0;
                if (this.$store.getters.getIsTax === 'TRUE') {
                    if(this.$store.getters.getIsAfterDiscountTip=="TRUE"){
                        if (this.$store.getters.getTipType === 'PRE_TAX') {
                            tip = this.common.round(this.total * item, 2)
                        } else if (this.$store.getters.getTipType === 'AFTER_TAX') {
                            let tax = this.tax
                            let totalAmount = this.total + tax;
                            tip = this.common.round(totalAmount * item, 2);
                        }
                    }else {
                        if (this.$store.getters.getTipType === 'PRE_TAX') {
                            tip = this.common.round(this.afterDiscountTotal * item, 2)
                        } else if (this.$store.getters.getTipType === 'AFTER_TAX') {
                            let tax = this.tax
                            let totalAmount = this.afterDiscountTotal + tax;
                            tip = this.common.round(totalAmount * item, 2);
                        }
                    }
                } else {
                    tip = this.common.round(this.afterDiscountTotal * item, 2)
                }
                this.tipList.push({"tipVal": item, "tipAmount": tip});
            }


            if (this.$store.getters.getIsCustomTip === 'TRUE') {
                // console.log(this.$store.getters.getIsMandatoryTip === 'TRUE' && this.personNum >= this.$store.getters.getMandatoryTipPersonNum);
                if (this.$store.getters.getIsMandatoryTip === 'TRUE' && this.personNum >= this.$store.getters.getMandatoryTipPersonNum) {
                    this.isTipInput = false;
                } else {
                    this.isTipInput = true;
                }
            }
            // console.log((this.$store.getters.getIsCustomTip === 'TRUE' && this.$store.getters.getIsMandatoryTip === 'TRUE' && this.personNum >= this.$store.getters.getMandatoryTipPersonNum) || (this.$store.getters.getIsCustomTip === 'TRUE' && this.$store.getters.getIsMandatoryTip === 'FALSE'));
// console.log(this.$store.getters.getIsCustomTip === 'FALSE' &&  this.$store.getters.getIsCustomTip === 'FALSE' && this.$store.getters.getIsMandatoryTip === 'TRUE' && this.$store.getters.getMandatoryTipPersonNum < this.personNum);
            // console.log(this.$store.getters.getMandatoryTipPersonNum < this.personNum);
        },
        computed: {},
        watch: {},
        mounted: function () {

        }
    };
</script>

<style>
    #tip-content {
        margin-bottom: 20px;
        overflow-y: hidden
    }

    #tip-content .title {
        text-align: center;
        padding: 20px 20px 10px 20px;
        font-size: 16px;
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
        padding: 15px;
        margin-bottom: 10px;
        /*border-radius: 24px;*/
        border: 1px solid rgba(204, 204, 204, 1);
        padding-left: 1.3rem;
        font-size: 14px;
        color: rgb(62, 61, 61);
        text-align: center;
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
        width: 35%;
        float: left;
        margin-left: 5%;
        padding: 13px;
        background: rgba(237, 91, 91, 1);
        text-align: center;
        color: #fff;
    }

    #tip-content .input-warp {
        width: 60%;
        overflow: hidden;
        padding: 12px;
        float: left;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 0px;
    }
</style>
