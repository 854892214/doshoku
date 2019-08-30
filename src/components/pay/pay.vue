<template>
    <div>
        <div v-if="isShowPage">
            <header class="mui-bar mui-bar-nav">
                <a class="mui-icon mui-icon-back" style="color:red" @click="jump"></a>
                <h1 class="mui-title">支付</h1>
                <span class="float-right nav-bar-btn">桌号:{{this.$store.getters.getTableName}}</span>
            </header>
            <div class="bg-white mui-content">
                <div class="header">
                    <div class="header-logo">
                        <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTUzODI5Mjg4ODUyIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIxNDEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMTAxNC4wNzM3OTIgMzQ1LjcwMTQ4NmMtMC4wNzE2MzEtMC41NTE1NjItMC4xODExMjUtMS4wNjkzNTUtMC4yOTE2NDItMS41MDkzNzctMC40NDYxNjItMi4xNDU4NzMtMS4wMzc2MzItNC4yMTM5NzUtMS44ODI4ODMtNi4yMDIyNTlsLTg2LjUzNDg2NS0yMTUuNDE3MjExQzkxMC40MTM4OTcgNzguMDU2Nzc0IDg2OS4wMjUyNTUgNTAuNDAwOSA4MTYuOTc1ODA4IDUwLjQwMDlMMjA5LjU2ODg3OCA1MC40MDA5Yy01MS4wMiAwLTkwLjY2Njk3NiAyNy4xMzYwMzQtMTA1LjAzMTEyNSA3MC4wMzIwMDZMMTEuNTA1OTE3IDM0MC4yMzkwNzhjLTAuNDM4OTk4IDEuMjk2NTI5LTAuOTI0MDQ1IDMuMjExMTM1LTEuMzI5Mjc1IDUuMTcwNzY2LTYuNzU0ODQ0IDIwLjc0NjUxLTEwLjE1MDE3NCA0Mi4wNDU2MDUtMTAuMTUwMTc0IDYzLjQyMzQ5NSAwLjA3MjY1NSA3NS4yMDE3NDkgNDEuMzQ3NzEgMTQzLjg2NTU5NSAxMDcuNjE1OTk2IDE3OS4xMjM2MSAyNy4yODEzNDMgMTQuNjE4OTUyIDU5LjQzNTY3MSAyMi4wMDIxMDcgOTUuNTM3OTEzIDIyLjAwMjEwN2wwLjExMjU2NCAwYzYwLjU4NDg0My0wLjE0NTMwOSAxMTYuNjk2ODE2LTI2Ljc2MjUyNyAxNTQuOTQ1OTU1LTcyLjMyMzE4OSAzOC4wNTc3ODEgNDUuMTQ4MjY5IDkzLjczMDc1NSA3MS42MTgxMzEgMTU0LjIwMjAxMSA3MS45OTE2MzggNTkuOTkzMzcyLTAuNDQ2MTYyIDExNS40ODAxMDQtMjcuMDIyNDQ3IDE1My4zOTE1NTMtNzIuMTczNzg2IDM4LjI0NzA5MiA0NS41NTY1NjkgOTQuNDMyNzQzIDcyLjEwMTEzMSAxNTUuMzA5MjI4IDcyLjEwMTEzMSAzNi44NDkyNTYtMC4yMjAwMTEgNjkuNTU0MTIyLTcuOTM3Nzg2IDk3LjA5NTM4NS0yMy4wNzQ1MzEgNjUuMjcwNTYzLTM1LjYyNDM1OSAxMDUuNzY2ODgyLTEwNC4wMzM0MDEgMTA1LjczMzExMy0xNzguNDIyNjQ1QzEwMjQuMDA2MDAyIDM4Ni42NDQ5OTEgMTAyMC41MDIyMDEgMzY1LjIzMzMzMiAxMDE0LjA3Mzc5MiAzNDUuNzAxNDg2TDEwMTQuMDczNzkyIDM0NS43MDE0ODZ6TTc5OS4wMzUyMDQgMzgxLjY5OTM1MiAyMDguMzEyMjU4IDM4MS42OTkzNTJjLTIwLjM3NTA1IDAtMzYuOTE0NzQ4LTE2LjUzOTY5OC0zNi45MTQ3NDgtMzYuOTE5ODY0IDAtMjAuMzc0MDI2IDE2LjUzOTY5OC0zNi45MTM3MjQgMzYuOTE0NzQ4LTM2LjkxMzcyNGw1OTAuNzIyOTQ2IDBjMjAuNDEyOTEyIDAgMzYuOTExNjc4IDE2LjUzOTY5OCAzNi45MTE2NzggMzYuOTEzNzI0QzgzNS45NDY4ODIgMzY1LjE1OTY1NCA4MTkuNDQ4MTE2IDM4MS42OTkzNTIgNzk5LjAzNTIwNCAzODEuNjk5MzUyTDc5OS4wMzUyMDQgMzgxLjY5OTM1MnpNNzk5LjAzNTIwNCAzODEuNjk5MzUyIiBwLWlkPSIyMTQyIiBmaWxsPSIjRUQ1QjVCIj48L3BhdGg+PHBhdGggZD0iTTk0Ny40MzgxMzkgNjc3LjA3NTY2M2MwLTIwLjQxNTk4Mi0xNi40OTY3MTktMzYuOTEzNzI0LTM2LjkxODg0MS0zNi45MTM3MjQtMy44MDE1ODMgMC03LjIzMzc1MiAxLjA2OTM1NS0xMC42Njc5NjcgMi4xNzQ1MjZsMCAwYy0yNy4zNTYwNDUgMTAuODIwNDQtNjIuMzU1MTYzIDE2LjY1MDIxNS04OC43NDcyNTMgMTUuMjEyNDctNTguMTgzMTQ0LTMuMTAyNjY0LTEwMi41MjMwMDEtMTQuNjk1Ny0xNDUuMjMzNzU2LTUxLjA1ODg4Ni00Mi4xMjMzNzYgMzUuOTIzMTY0LTk1Ljg3NTYwNCA1Ni4zNzA4NjktMTUzLjA5ODg4NyA1Ni44OTA3MDgtNTguMDMzNzQxLTAuMzcxNDYtMTEyLjA4MjcyOC0xNC45MTc3NTgtMTU0LjQyNjExNS01MC45MDg0Ni00Mi42MDMzMDcgMzYuMzI0My05Ni45Nzk3NTIgNTQuMDA0OTg1LTE1NC45MDYwNDYgNTQuMDA0OTg1bC0wLjIyMTAzNCAwYy0zNS4zNjQ0MzkgMC01NS4yOTk0NjctNi43MTQ5MzUtODcuNDk0NzI3LTE4LjYwNTc1My0wLjg4NDEzNy0wLjQzODk5OC0xLjgwNjEzNS0wLjY2NTE0OS0yLjczMTIwNC0wLjk5MjYwNy0xLjU0OTI4Ni0wLjU5MDQ0OC0yLjczMjIyOC0wLjk5NjctNC4zMjAzOTktMS41ODgxNzEgMCAwLTUuMzEzMDA2LTAuOTIxOTk5LTguMjMwNDUyLTAuOTIxOTk5bC0wLjA3MzY3OCAwYy0yMC4zODAxNjYgMC0zNi44Nzk5NTUgMTYuNTcxNDIxLTM2Ljg0NjE4NiAzNi45OTA0NzJsMC4yNTg4OTYgMTk3LjgzODg1N2MwIDUyLjA1NTU4NiA0Mi40MTgwODkgOTQuMzk4OTczIDk0LjU4MTEyMiA5NC4zOTg5NzNsNjk0LjcxNTQxNS0wLjQ0NjE2MmM1Mi4wODgzMzItMC4xNDUzMDkgOTQuNDcyNjUyLTQyLjYwMzMwNyA5NC40NzI2NTItOTQuNjUyNzUzTDk0Ny40MzgxMzkgNjc3LjA3NTY2MyA5NDcuNDM4MTM5IDY3Ny4wNzU2NjN6TTk0Ny40MzgxMzkgNjc3LjA3NTY2MyIgcC1pZD0iMjE0MyIgZmlsbD0iI0VENUI1QiI+PC9wYXRoPjwvc3ZnPg=="/>
                    </div>
                    <p class="header-name">{{this.$store.getters.getStoreName}}</p>
                </div>
                <div class="input-area">
                    <div>
                        <p class="bill-after">输入金额</p>
                    </div>
                    <p id="moneys">
                        $&nbsp;
                        <span id="price">{{price}}</span>
                        <span id="cursor" style="display: block;"></span>
                    </p>
                    <div style="display: flex;justify-content: space-between;padding-top: .8rem;">
                        <p class="insert-note" @click="showRemark = true"
                           v-html="note === '' || note == null ? '添加备注' : '<span style=\'color: #000;padding-right: 5px;\'>'+note+'</span>'+'修改'"></p>
                    </div>
                </div>
            </div>
            <div class="keyboard-prompt">HantePay 提供技术支持</div>
            <!-- 支付金额输入键盘-->
            <div class="modal-keyboard active">
                <table>
                    <tbody>
                    <tr data-v-67af65af>
                        <td @click="keyBordNum('1')">1</td>
                        <td @click="keyBordNum('2')">2</td>
                        <td @click="keyBordNum('3')">3</td>
                        <td @click="keyBordNum('D')" data-code="D" rowspan="2">
                          <span class="icon icon-del">
                            <svg data-v-7ef413f4 version="1.1" viewBox="0 0 48.4 36" class="svg-icon svg-fill">
                              <path pid="0"
                                    d="M29.4 19.7l6.2 6.3 1.7-1.7-6.2-6.3 6.3-6.3-1.8-1.7-6.3 6.3-6.2-6.3-1.7 1.7 6.2 6.3-6.3 6.3 1.8 1.7 6.3-6.3zM39.9 3.2a5.3 5.3 0 0 1 5.4 5.3v19a5.3 5.3 0 0 1-5.4 5.3h-20a5.4 5.4 0 0 1-3.9-1.6L3.5 18.8a1 1 0 0 1 0-1.5L16 4.8a5.4 5.4 0 0 1 3.9-1.6h20zm0-3.2H20.7a8.6 8.6 0 0 0-6.2 2.6L1.3 15a4.2 4.2 0 0 0 0 6l13.3 12.4a8.6 8.6 0 0 0 6.1 2.6h19.2a8.5 8.5 0 0 0 8.5-8.5v-19A8.5 8.5 0 0 0 39.9 0z"/>
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
                        <td @click="keyBordNum('K')" data-code="K" rowspan="2" id="JS_form_tip_finish">去支付</td>
                    </tr>
                    <tr>
                        <td @click="keyBordNum('0')" colspan="2">0</td>
                        <td @click="keyBordNum('.')">.</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <home-header v-if="isShowPage==false"></home-header>
        <mt-popup v-model="showTip" popup-transition="popup-fade" style="height: 100%;width: 100%;">
            <tip :price="parseFloat(price)" :note="note" ref="tip"></tip>
        </mt-popup>
        <mt-popup v-model="showRemark" class="note-box" popup-transition="popup-fade">
            <div style="overflow: hidden;padding: 1rem 1rem 0rem 1rem;">
                <p style="color:green">添加备注</p>
                <textarea maxlength="20" cols="30" rows="2" class="addText" v-model="note"></textarea>
                <p class="note-prompt">最多输入20个合法字符</p>
            </div>
            <div class="note-btn">
                <div class="cancel-not-btn" @click="showRemark = false;note = ''">取消</div>
                <div class="confim-note-btn" @click="addNote">确定</div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
    import HomeHeader from "@/components/transition/trans"
    import tip from './payTip'

    export default {
        components: {
            tip, HomeHeader
        },
        data() {
            return {
                //进度
                isShowPage: false,
                //优惠金额
                discount: 0,
                //备注content
                note: "",
                //显示键盘顶部的提示
                showKeyPrompt: false,
                //显示小费页面
                showTip: false,
                //键盘输入金额
                price: '',
                keyBordBtnDisable: false,

                showRemark: false
            };
        },
        methods: {
            jump() {
                this.$router.replace("home");
            },
            //键盘输入事件
            keyBordNum(code) {
                let amountVal = this.price.toString().trim();
                let _result = 0;
                if (code === "K") {
                    _result = amountVal;
                    if (this.keyBordBtnDisable) {
                        this.showTip = true;
                        this.$refs.tip.calculateCost();
                    }
                } else if (code === "D") {
                    if (amountVal.length == 1 || amountVal == "") {
                        _result = "";
                    } else {
                        _result = amountVal.substring(0, amountVal.length - 1);
                    }
                } else {
                    if (code === "." && amountVal.indexOf(".") >= 0) {
                        return false;
                    }
                    if (amountVal.split(".").length < 2 && (this.common.clearNoNum(amountVal) === "0.00" || parseFloat(this.common.clearNoNum(amountVal)) == "0")) {
                        if (code === ".") {
                            _result = "0" + code;
                        } else {
                            _result = code;
                        }
                    } else {
                        let _amountValArray = amountVal.split(".");
                        if (_amountValArray[0].length < 4) {
                            _result = this.common.clearNoNum(amountVal) + code;
                            _result = this.common.clearNoNum(_result);

                            if (_result.indexOf(".") < 0) {
                                _result = parseFloat(_result);
                            }
                        } else if (_amountValArray[0].length == 4) {
                            let temp = this.common.clearNoNum(amountVal) + code;
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
                this.price = _result;
                if (parseFloat(this.price) > 0) {
                    this.keyBordBtnDisable = true;
                } else {
                    this.keyBordBtnDisable = false;
                }
            },
            addNote() {
                this.showRemark = false;
            }
        },
        created() {
            setTimeout(() => {
                this.isShowPage = true;
            }, 1500)
        },
        watch: {},
        beforeCreate() {
            document.querySelector('body').setAttribute('style', 'background-color:#fff')
        },
        beforeDestroy() {
            document.querySelector('body').removeAttribute('style');
        },
        mounted() {

        }
    };
</script>
<style scoped>
    p {
        color: black;
        margin-bottom: 0;
    }

    .bg-white {
        background: #ffffff;
    }

    .header-logo {
        text-align: center;
        margin-top: 2rem;
    }

    .header-logo > img {
        width: 65px;
        height: 65px;
    }

    .header-name {
        font-size: 18px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        text-align: center;
        margin: 0;
        padding-top: 12px;
    }

    .input-area {
        padding: 1rem;
    }

    .bill-after {
        font-size: 14px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }

    #moneys {
        border-bottom: 1px solid #eee;
        line-height: 3.5rem;
        font-size: 24px;
        text-align: left;
        background-color: #fff;
        position: relative;
    }

    #price {
        float: right;
    }

    #cursor {
        width: 1px;
        height: 45px;
        border-right: 1px solid #000;
        -webkit-animation: shining 1s linear infinite;
        -o-animation: shining 1s linear infinite;
        animation: shining 1s linear infinite;
        position: absolute;
        top: 12px;
        right: 0;
        display: none;
    }

    @keyframes shining {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 0;
        }
        50.1% {
            opacity: 1;
        }
        100% {
            opacity: 1;
        }
    }

    .insert-note {
        color: green;
    }

    .keyboard-prompt {
        background: transparent;
        position: fixed;
        bottom: 40%;
        width: 100%;
        text-align: center;
        font-size: 12px;
        color: #b4b1b1;
        padding-bottom: 5px;
    }

    .note-prompt {
        text-align: right;
        color: #afadad;
        font-size: 14px;
        position: relative;
        bottom: 0.5rem;
    }


    .addText {
        width: 100%;
        height: 100px;
        color: #000;
        font-size: 14px;
        padding: 10px;
        margin-top: 1rem;
    }

    .note-box {
        width: 90%;
        background: #ffffff;
        border-radius: 5px;
    }

    .note-btn {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .cancel-not-btn {
        width: 50%;
        height: 40px;
        background: #989898cc;
        text-align: center;
        line-height: 40px;
        color: #fff;
    }

    .confim-note-btn {
        width: 50%;
        height: 40px;
        background: #f74c4ccc;
        text-align: center;
        line-height: 40px;
        color: #fff;
    }


    .modal-keyboard {
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
        z-index: 98;
    }

    .modal-keyboard table {
        width: 100%;
        height: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }

    .modal-keyboard td:first-child {
        border-left: none;
    }

    .modal-keyboard td:nth-of-type(-n + 3) {
        font-weight: 600;
    }

    .modal-keyboard td {
        text-align: center;
        width: 33.33%;
        border: 1px solid #ddd;
    }

    .modal-keyboard .icon {
        font-size: 12px;
    }

    .modal-keyboard .icon svg {
        width: 18px;
        height: 18px;
    }

    .modal-keyboard td[data-code="K"] {
        font-size: 20px;
        background: #ed5b5b;
        color: #ffffff;
    }

    .modal-keyboard.active {
        visibility: visible;
        transform: translateZ(0);
    }

</style>
