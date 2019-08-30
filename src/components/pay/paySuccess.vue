<template>
    <div class="pay-success-bg">
        <div class="pay-success-logo"></div>
        <p class="pay-success-text">支付成功</p>
        <div class="complete-btn-box">
            <div class="complete-btn">
                <span class="complete-btn-text" @click="jump">完成</span>
            </div>
        </div>
        <div class="service-logo"></div>
    </div>
</template>

<script>
    export default {
        data() {
            return {};
        },
        created() {

        },
        methods: {
            jump() {
                if (this.common.is_weixin()) {
                    this.common.closeWx();
                } else if (this.common.is_alipay()) {
                    this.common.closeAli();
                } else {
                    history.back();
                }
            }
        },
        mounted() {
            // 850876320
        },
        beforeCreate() {
            document.querySelector('body').setAttribute('style', 'background-color:#fff')
        },

        beforeDestroy() {
            document.querySelector('body').removeAttribute('style')
        }
    };
</script>

<style scoped>
    .pay-success-bg {
        background: #ffffff;
        padding-top: 0.1rem;
    }

    .service-logo {
        width: 199px;
        height: 24px;
        background: url("../../../static/img/pay/img@2x.png") no-repeat;
        background-size: 100%;
        margin: auto;
        /* position: absolute;
        bottom: 3rem;
        left: 25%; */
        margin-top: 9rem;
    }

    .complete-btn-box {
        margin: auto;
        width: 105px;
        height: 36px;
        margin-top: 85px;
    }

    .complete-btn-text {
        width: 32px;
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(237, 91, 91, 1);
        line-height: 22px;
    }

    .complete-btn {
        margin-left: 6px;
        margin-right: 7px;
        border-radius: 24px;
        border: 1px solid rgba(236, 91, 91, 1);
        text-align: center;
        color: rgba(236, 91, 91, 1);
        line-height: 36px;
    }

    p {
        margin: 0;
        margin: auto;
    }

    .pay-success-text {
        width: 72px;
        font-size: 18px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
        line-height: 25px;
        padding-top: 15px;
    }

    .pay-success-money {
        width: 118px;
        height: 50px;
        font-size: 36px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 50px;
        padding-top: 5px;
    }

    body {
        background-color: #ffffff;
    }

    .pay-success-logo {
        width: 120px;
        height: 112px;
        background: url("../../../static/img/pay/img_sucess@2x.png") no-repeat;
        background-size: 100%;
        margin: 0 auto;
        margin-top: 59px;
    }
</style>
