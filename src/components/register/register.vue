<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-icon mui-icon-back" style="color:red" @click="jump"></a>
            <h1 class="mui-title">登录</h1>
            <span class="float-right nav-bar-btn">堂食</span>
        </header>
        <div class="mui-content">
            <div class="mui-input-group">
                <div class="mui-input-row">
                    <select class="select-wrapper" v-model="countryCode" :disabled="disabledInput">
                        <option value="1">1+</option>
                        <option value="86">86+</option>
                    </select>
                    <input type="number" class="mui-input-clear phone-input" :disabled="disabledInput" @blur="blurInput"
                           v-model="phone" placeholder="请填写您的手机号">
                </div>
            </div>
            <div class="mui-input-group">
                <div class="mui-input-row">
                    <input type="text" class="mui-input-clear phone-input" :disabled="disabledInput" @blur="blurInput"
                           v-model="userName" placeholder="请填写您的姓(选填)">
                </div>
            </div>
            <div class="mui-input-group">
                <div class="mui-input-row">
                    <input type="text" class="mui-input-clear phone-input" :disabled="disabledInput" @blur="blurInput"
                           v-model="userLastName" placeholder="请填写您的名(选填)">
                </div>
            </div>
            <div class="mui-input-group">
                <div class="mui-input-row" @click="openTime">
                    <input type="text" class="mui-input-clear phone-input" :disabled="disabledInput" @blur="blurInput"
                           v-model="birthday" placeholder="请选择您的生日(选填)" disabled="disabled">
                </div>
            </div>
            <div class="mui-input-group">
                <div class="mui-input-row">
                    <input type="number" maxlength="6" @blur="blurInput" class="mui-input-clear code-input"
                           v-model="code" placeholder="请填写您的验证码">
                    <div class="code-btn" :class="isCodeBtnClick ? 'active' : ''" @click="getCode">{{this.isCodeBtnClick
                        == false?'剩余'+taskEndTime+'秒' : '获取验证码'}}
                    </div>
                </div>
            </div>
            <div class="loginBtn" :class="isLoginBtn ? 'active' : ''" @click="login">登录</div>
        </div>
        <!-- 日期选择器 -->
        <mt-datetime-picker type="date" ref="picker" year-format="{value} 年" month-format="{value} 月"
                            date-format="{value} 日" @confirm="handleConfirm"
                            :startDate="startDate"></mt-datetime-picker>
    </div>
</template>

<script>
    import {
        MessageBox
    } from "mint-ui"

    export default {
        name: "Login",
        data() {
            return {
                phone: "",
                countryCode: "1",
                isCodeBtnClick: true, //是否可点击 判断电话
                respCode: "", //验证码
                code: "", //输入的验证码
                isLoginBtn: true,
                taskEndTime: 360,
                disabledInput: false,
                birthday: "",   //客户生日
                userName: "",   //客户姓
                userLastName: "",//客户名
                startDate: new Date("1968-01-01"),
            }
        },
        methods: {
            jump() {
                // if (this.$route.query.type === "paySuccess") {
                //     this.$router.replace({
                //         path: this.$route.query.type,
                //         query: {
                //             orderNum: this.$route.query.orderNum
                //         }
                //     })
                // } else {
                //     this.$router.replace(this.$route.query.type)
                // }
                this.$router.replace("/home")
            },
            blurInput: function (e) {
                window.scrollTo(0, 0);
            },
            login() {
                if (!this.isLoginBtn) {
                    return false;
                }
                if (this.phone === "" || this.phone == null) {
                    MessageBox.alert("请输入手机号码");
                    return false;
                }
                if (!(/^1[34578]\d{9}$/.test(this.phone)) && this.countryCode === "86") {
                    MessageBox.alert("请输入正确手机号码");
                    return false;
                }
                if (this.countryCode === "1" && this.phone.length <= 5) {
                    MessageBox.alert("请输入正确手机号码");
                    return false;
                }
                if (this.code === "" || this.code == null) {
                    MessageBox.alert("请输入验证码");
                    return false;
                }
                if (this.respCode != this.code) {
                    MessageBox.alert("验证码有误");
                    return false;
                }
                let wxOpenId = "";
                let alipayUserId = "";
                if (this.common.is_weixin()) {
                    wxOpenId = this.$store.getters.getUserId;
                    wxAsali = 'wx_open_id';
                    userId = this.$store.getters.getUserId
                } else if (this.common.is_alipay()) {
                    alipayUserId = this.$store.getters.getUserId;
                    wxAsali = 'alipay_user_id'
                    userId = this.$store.getters.getUserId
                }
                this.isLoginBtn = false;
                let url = this.common.baseURL + "mobi/scangoodsuser/register?store_id="+this.$store.getters.getStoreId
                console.log(wxOpenId)
                this.axios.post(url, {
                    "phone": this.phone,
                    "country_code": this.countryCode,
                    "wx_open_id":wxOpenId !== "" ? wxOpenId : this.$store.getters.getUserId, //wxOpenId
                    "alipay_user_id": alipayUserId,
                    "first_name": this.userName,
                    "last_name": this.userLastName,
                    "birthday": this.birthday
                }, {
                    headers: {
                        "Content-type": "application/json"
                    }
                }).then(result => {
                    console.log(result)
                    if (result.data.result_code == "ok" && result.data.result_msg == "SUCCESS") {
                        this.$store.commit("isStoreUser", "TRUE"); //店铺用户是否存在
                        this.$store.commit("storeScanGoodsUser", result.data.storeScanGoodsUser ? JSON.stringify(result.data.storeScanGoodsUser) : {}); //店铺用户信息
                        this.$router.replace("/order");
                    } else if (result.data.result_msg == "USER_EXIST") {
                        MessageBox.alert("用户已存在")
                    } else if (result.data.result_msg == "ACCOUNT_ALREADY_BOUND_PHONE") {
                        MessageBox.alert('用户已经绑定了电话')
                    }else if(result.data.result_msg="PHONE_ALREADY_BOUND_ACCOUNT"){
                        console.log(wxOpenId==""?"565656":wxOpenId)
                        MessageBox.alert("该电话已被使用")
                        this.disabledInput = false;
                    }else {
                        MessageBox.alert("发送失败!");
                        this.isLoginBtn = true;
                    }
                })
            },
            //获取验证码按钮
            getCode() {
                if (!this.isCodeBtnClick) {
                    return false;
                }
                if (this.phone === "" || this.phone == null) {
                    MessageBox.alert("请输入手机号码");
                    return false;
                }
                if (!(/^1[34578]\d{9}$/.test(this.phone)) && this.countryCode === "86") {
                    MessageBox.alert("请输入正确手机号码");
                    return false;
                }
                if (this.countryCode === "1" && this.phone.length <= 5) {
                    MessageBox.alert("请输入正确手机号码");
                    return false;
                }
                this.isCodeBtnClick = false;
                this.disabledInput = true;
                let url = this.common.baseURL + "mobi/sms/webphone?phone=" + this.phone + "&countrycode=" + this.countryCode
                this.axios.get(url, {}, {
                    "Content-type": "application/json",
                }).then(result => {
                    if (result.data.result_code === "ok") {
                        this.respCode = result.data.randomCode;
                        let TaskTime = setInterval(() => {
                            this.taskEndTime--
                            if (this.taskEndTime <= 0) {
                                this.isCodeBtnClick = true;
                                this.disabledInput = false;
                                this.respCode = "";
                                clearInterval(TaskTime)
                            }
                        }, 1000);
                    } else {
                        this.isCodeBtnClick = true;
                        this.disabledInput = false;
                        MessageBox.alert("请输入正确手机号码");

                    }
                })

            },
            //打开时间选择器
            openTime() {
                this.$refs.picker.open();
            },
            //时间点击器的确认事件
            handleConfirm(value) {
                this.birthday = this.moment(value).format('YYYY-MM-DD')
            },
        },
        created() {
            if(process.env.NODE_ENV==="development"){

            }else {
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
            }
            if (this.$store.getters.getUserId === "" || this.$store.getters.getUserId == null) {
                return MessageBox.alert("访问错误").then(action => {
                    if (this.common.is_weixin()) {
                        this.common.closeWx();
                    } else if (this.common.is_alipay()) {
                        this.common.closeAli();
                    } else {
                        history.back();
                    }
                });
            }
        },
        mounted: function () {

        },
        watch: {}
    }
</script>

<style scoped>
    .login-header {
        text-align: center;
        padding: 1rem;
        font-size: 20px;
        color: #000;
    }

    .mui-input-group {
        margin-top: 1rem;
    }

    .mui-input-group .mui-input-row .select-wrapper {
        width: 30%;
        margin-bottom: 0;
        direction: rtl;
        border-right: 1px solid #c8c7cc !important;
        padding-right: 10px;
        height: 39px;
        float: left;
        border-radius: 0;
    }

    .mui-input-group .mui-input-row .phone-input {
        float: left;
        width: 70%;
    }

    .mui-input-group .mui-input-row .code-input {
        float: left;
        width: 70%;
    }

    .mui-input-group .mui-input-row .code-btn {
        height: 40px;
        line-height: 40px;
        width: 30%;
        float: left;
        font-size: 14px;
        background: #ccc;
        text-align: center;
    }

    .mui-input-group .mui-input-row .code-btn.active {
        background: rgba(237, 91, 91, 1);
        color: #ffffff;
    }

    .loginBtn {
        width: 100%;
        background: #ccc;
        height: 40px;
        line-height: 40px;
        text-align: center;
        margin-top: 1.5rem;
        color: #000;
    }

    .loginBtn.active {
        background: rgba(237, 91, 91, 1);
        color: #ffffff;
    }
</style>
