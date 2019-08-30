<template>
    <div class="cart-app">
        <div>
            <img src="../../assets/img/404_img1.png" alt>
        </div>
        <div>
            <img src="../../assets/img/404_img2.png" alt>
        </div>
        <h3>页面不存在......</h3>
        <h3 v-if="count>=1">{{count}}秒后自动关闭</h3>
    </div>
</template>
<style>
    .cart-app {
        text-align: center;
    }
</style>
<script>
    export default {
        data() {
            return {
                count: 5,
                myTimer: null
            };
        },
        methods: {},
        created() {
            this.myTimer = setInterval(() => {
                if (this.count <= 1) {
                    if (this.common.is_weixin()) {
                        this.common.closeWx();
                    } else if (this.common.is_alipay()) {
                        this.common.closeAli();
                    } else {
                        history.back();
                    }
                    return;
                }
                this.count--;
            }, 1000);
        },
        //页面离开后执行一些清理操作
        destroyed: function () {
            clearInterval(this.myTimer);
        }
    };
</script>

