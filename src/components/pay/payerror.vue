<template>
    <div>
        <div class="icon-box">
            <!-- <div class="icon-order"></div> -->
            <div class="warning-box">
                <!-- <div class="happy-radius"></div>
                <div class="happy-solid"></div>
                <div class="happy-love"></div> -->
                <div class="icon-warning"></div>
            </div>
        </div>
        <h3 class="payerror-font">付款失败</h3>
        <p class="error-prompt">请重新支付,以便向商家确认付款信息，付款失败将退款</p>
        <div class="go-pay" @click="jump">去支付</div>
    </div>
</template>

<style scoped>
    .header-name {
        position: relative;
        right: .5rem;
    }

    .bg-white-box {
        padding-bottom: 45%;
        background: #ffffff;
    }

    .header {
        display: flex;
        background: #ffffff;
        font-size: 18px;
        justify-content: space-between;
        height: 45px;
        line-height: 45px;
        padding-right: 1.2rem;
        color: black;
    }

    .header-icon {
        font-size: 30px;
        position: relative;
        top: .1rem;
        left: 0.3rem;
    }

    .happy-love {
        width: 7px;
        height: 7px;
        background: url(../../../static/img/love.png) no-repeat;
        position: absolute;
        left: -1.3rem;
        top: -1rem;
    }

    .happy-solid {
        width: 5px;
        height: 5px;
        /* border: 2px solid #f6a525; */
        background: #f6a525;
        position: absolute;
        top: -0.5rem;
        left: -0.2rem;
        border-radius: 50%;
    }

    .happy-radius {
        width: 8px;
        height: 8px;
        border: 2px solid #f6a525;
        border-radius: 50%;
        position: absolute;
        left: -1.3rem;
        top: 0.3rem;
    }

    .go-pay {
        width: 108px;
        height: 38px;
        /* background: #68d654; */
        background: red;
        border-radius: 20px;
        margin: auto;
        text-align: center;
        line-height: 38px;
        margin-top: 2rem;
        color: #ffffff;
        font-size: 15px;
        margin-bottom: 2rem;
    }

    .error-prompt {
        font-size: 14px;
        width: 50%;
        text-align: center;
        margin: auto;
        color: #cacad2;
    }

    .payerror-font {
        padding: 1.5rem 0;
        text-align: center;
    }

    .warning-box {
        width: 60px;
        height: 60px;
        background: #ffffff;
        border-radius: 50%;
        display: flex;
        margin: auto;
        position: relative;
    }

    .icon-box {
        width: 100%;
        margin: 38% auto;
        margin-bottom: 0;
    }

    .icon-warning {
        width: 50px;
        height: 50px;
        background: url(../../../static/img/payerror-warning.png) no-repeat;
        margin: auto;
        background-color: #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 15px 1px #fff;
    }

    .icon-order {
        width: 50px;
        height: 50px;
        background: url(../../../static/img/payerror-order.png) no-repeat;
        margin: auto;
        position: relative;
        left: 2rem;
        top: 15px;
        z-index: -1;
    }
</style>

<script>
    export default {
        data() {
            return {}
        },
        mounted: function () {
            // 监听resize方法
            window.addEventListener("resize", this.renderResize, false)
        },
        methods: {
            jump() {
                this.$router.push('/pay')
            },
            renderResize() {
                // 判断横竖屏
                // let width = document.documentElement.clientWidth
                // let height = document.documentElement.clientHeight
                // if (width > height) {
                //     alert('横屏')
                // } else {
                //     alert('竖屏')
                // }
                // 做页面适配
                // 注意：renderResize方法执行时虚拟dom尚未渲染挂载，如果要操作vue实例，最好在this.$nextTick()里进行。
            }
        },
        beforeCreate() {
            document.querySelector("body").setAttribute("style", "background-color:#fff");
        },

        beforeDestroy() {
            document.querySelector("body").removeAttribute("style");
            // 移除监听
            window.removeEventListener("resize", this.renderResize, false)
        }
    };
</script>
