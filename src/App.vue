<template>
    <div>
        <!-- 占位符用来显示其它的组件-->
        <transition>
            <router-view :key="key"></router-view>
        </transition>
    </div>
</template>

<style>
    @import './assets/css/media.css';

    .mui-bar-nav {
        background: #ffffff;
    }

    .mui-bar .mui-icon:active {
        opacity: 1;
    }

    .mui-bar-nav .nav-bar-btn {
        border-radius: 12px;
        border: 1px solid rgba(237, 91, 91, 1);
        font-size: 12px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(237, 91, 91, 1);
        padding: 0px 7px;
    }

    .float-right {
        float: right;
        margin: 0.7rem;
    }

    .fold-left-enter-active {
        animation-name: fold-left-in;
        animation-duration: 0.3s;
    }

    .fold-left-leave-active {
        animation-name: fold-left-out;
        animation-duration: 0.3s;
    }

    .fold-right-enter-active {
        animation-name: fold-right-in;
        animation-duration: 0.3s;
    }

    .fold-right-leave-active {
        animation-name: fold-right-out;
        animation-duration: 0.3s;
    }

    @keyframes fold-left-in {
        0% {
            transform: translate3d(100%, 0, 0);
        }
        100% {
            transform: translate3d(0, 0, 0);
        }
    }

    @keyframes fold-left-out {
        0% {
            transform: translate3d(0, 0, 0);
        }
        100% {
            transform: translate3d(-100%, 0, 0);
        }
    }

    .display-none {
        display: none !important;
    }


</style>

<script>
    export default {
        data() {
            return {
                val: "首页",
                transitionName: ""
            };
        },
        methods: {},
        created() {

        },
        mounted: function () {

        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            $route: {
                handler: function (to, from) {

                }
            }
        },
        computed: {
            key() {
                return this.$route.name !== undefined
                    ? this.$route.name + new Date()
                    : this.$route + new Date();
            }
        }
    };
</script>
