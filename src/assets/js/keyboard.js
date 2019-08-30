(() => {
    var keyboard = {}
    "use strict";
    var document = window.document
    var keyboardlength = 4          //输入最大位数,默认为
    var keyboardPointLength = 2       //小数点后几位数  默认两位
    var div                         //键盘容器
    var price                       //输入框容器
    var ok                          //当前ok按钮
    var disableOk = true            //OK按钮状态
    var inputNewVal                 //输入框最新值
    var amountTesting               //数额检测
    //初始化键盘时赋予ok按钮确认回调
    keyboard.confirm = function () {
        if (div.hasAttribute('confirm')) {
            let clickName = div.getAttribute('confirm')
            var clickList;
            if (clickName.substr(-2) == "()") {
                clickList = "keyBordNum('K');" + clickName
            } else {
                clickList = "keyBordNum('K');" + clickName + "();"
            }
            ok.setAttribute("onclick", clickList)
        }
    }
    //设置光标大小
    keyboard.setcursorSize = function () {
        if (div.hasAttribute('cursorSize')) {
            let cursorSize = div.getAttribute("cursorSize")
            let cursor = document.getElementById('cursor')
            cursor.style.height = cursorSize + "px"
        }
    }
    //设置OK按钮是否禁用
    keyboard.disableOk = function (val) {
        if (div.hasAttribute('disabled')) {
            if (val != undefined) {
                if (val) {
                    div.setAttribute('disabled', "TRUE")
                    disableOk = true
                    return
                } else if (val == false) {
                    div.setAttribute('disabled', "FALSE")
                    disableOk = false
                    return
                }
            }
            if (div.getAttribute("disabled") == "TRUE") {
                disableOk = true
                return true
            } else if (div.getAttribute("disabled") == "FALSE") {
                disableOk = false
                return false
            }
        }
    }
    //修改OK文本
    keyboard.setOkText = function (val) {
        ok.innerHTML = val
    }
    //初始化键盘是否有小数点按钮
    keyboard.isPoint = function (setOption) {
        if (setOption == undefined) {
            return
        }
        let lastRow = div.firstElementChild.firstElementChild.lastElementChild
        if (setOption.point == false && setOption.svgIcon == false) {
            lastRow.removeChild(lastRow.lastElementChild)
            lastRow.removeChild(lastRow.firstElementChild)
            lastRow.firstElementChild.setAttribute('colspan', '3')
            return
        } else if (setOption.point == false) {
            lastRow.removeChild(lastRow.firstElementChild)
            lastRow.firstElementChild.setAttribute('colspan', '2')
            return
        } else if (setOption.svgIcon == false) {
            lastRow.removeChild(lastRow.lastElementChild)
            lastRow.lastElementChild.setAttribute('colspan', '2')
            return
        }
    }
    //键盘事件
    keyBordNum = function (val) {
        let _code = val;
        let _result = 0;
        let NowNum = price.innerHTML;
        let amountVal = NowNum.toString().trim();
        //隐藏键盘
        if (_code == "F" || _code == "K") {
            let inputVal = parseFloat(NowNum);
            if (_code == "F" || disableOk) {
                keyboard.isActive();
            }
            if (_code == "K" && disableOk) {
                // keyboard.confirm()
            }
            return;
        }
        //删除尾数
        if (_code == "D") {
            NowNum = price.innerHTML;
            _result = NowNum.substring(0, NowNum.length - 1);
            price.innerHTML = "";
            price.innerHTML = _result;
            return;
        }
        if (_code == ".") {
            // console.log(_code,_code==".",amountVal.indexOf(".") >= 0)
            if (_code == "." && amountVal.indexOf(".") == -1) {
                _result = _code;
            }
            if (_code == "." && amountVal.indexOf(".") >= 0) {
                // _result = _code;
                return false;
            }
            if (amountVal == "") {
                _result = "0" + _code;
            }
            /* 键盘bug在这里，做记录 做完ui再来修改 */
            price.innerHTML += _result;
        } else {
            //最多两位小数
            let splitVal = amountVal.split(".");
            if (splitVal[1] != undefined) {
                if (splitVal[1].length > keyboardPointLength - 1) {
                    return;
                }
            }
            //限额检测
            let maxAmount = ''
            for (let i = 1; i < keyboardlength; i++) {
                maxAmount += '9'
            }
            maxAmount = +(maxAmount + '.99')
            if (parseFloat(amountVal) > maxAmount) {
                if (amountVal.indexOf(".") >= 0) {
                    price.innerHTML += _code;
                }
                return;
            }
            if(amountTesting.isOpen){//是否开启数额检测
                let oldVal=price.innerHTML
                let newVal=oldVal+_code
                let amount=+(price.innerHTML)
                if(newVal>amountTesting.amount){
                    return false;
                }else {
                    if(newVal.length>keyboardlength){
                        return false;
                    }
                    price.innerHTML += _code;
                }
            }else {
                price.innerHTML += _code;
            }
            keyboard.updateChange(price.innerHTML)
            keyboard.inputNewVal = price.innerHTML
        }
    }
    //键盘每次点击触发此事件
    keyboard.updateChange = function (newVal) {
        return newVal
    }
    //键盘下落时触发
    keyboard.hidden = function () {
        // console.log('键盘关闭了')
        let keyVal, methodsName
        if (div.hasAttribute('keyHidden')) {
            if (div.getAttribute('keyHidden') != "") {
                keyVal = div.getAttribute('keyHidden')

                if (keyVal.substr(-2) == "()") {
                    methodsName = keyVal
                } else {
                    methodsName = keyVal + "()";
                }
                eval(methodsName)
            }
        }
    }
    //键盘打开时触发
    keyboard.open = function () {
        // console.log('键盘打开了')
        let keyVal, methodsName
        if (div.hasAttribute('keyShow')) {
            if (div.getAttribute('keyShow') != "") {
                keyVal = div.getAttribute('keyShow')

                if (keyVal.substr(-2) == "()") {
                    methodsName = keyVal
                } else {
                    methodsName = keyVal + "()";
                }
                eval(methodsName)
            }
        }
    }
    //点击文本框
    keyboard.keyBordStatus = function () {
        keyboard.isActive()
    }
    //切换键盘
    keyboard.isActive = function () {
        if (div.hasAttribute('openToggle')) {
            if (div.getAttribute('class')) {  // 存在class属性
                // 若有这个类
                if (div.className.indexOf('active') > -1) {
                    div.classList.remove('active')
                    keyboard.hidden()
                } else {
                    div.classList.add('active')
                    keyboard.open()
                }
            }
        }
    }
    //OK按钮背景色
    keyboard.keyboardOkBackground = function (getColor) {
        let test = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;
        if (getColor != undefined) {
            div.setAttribute("confirmcolor", getColor)
            keyboard.keyboardOkBackground()
        } else {
            if (div.hasAttribute('confirmColor')) {
                let color = div.getAttribute("confirmColor")
                if (test.test(color)) {
                    ok.style.background = color
                    return
                } else {
                    ok.classList.add(color)
                    if (color == "blue") {
                        ok.style.background = "#0ae"
                    } else {
                        ok.classList.add(color)
                    }
                }
            }
        }
    }
    //初始化键盘
    keyboard.init = function (element, priceElement, setOption) {
        if (setOption != undefined) {
            if (setOption.length != undefined && setOption.length > 0) {
                keyboardlength = setOption.length
            }
            if (setOption.pointLength != undefined && setOption.pointLength > 0) {
                keyboardPointLength = setOption.pointLength
            }
            if (setOption.amountTesting != undefined) {
                amountTesting = setOption.amountTesting
            }
        }
        var style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = `#moneys{border-bottom:1px solid #eee;margin:0;line-height:3.5rem;font-size:24px;text-align:left;background-color:#fff;position:relative;margin:13px 0;}#price{float:right;}#cursor{width:1px;height:45px;border-right:1px solid #000;-webkit-animation:shining 1s linear infinite;-o-animation:shining 1s linear infinite;animation:shining 1s linear infinite;position:absolute;top:12px;right:0;display:none;}@keyframes shining{0%{opacity:0;}50%{opacity:0;}50.1%{opacity:1;}100%{opacity:1;}}.modal-tips-keyboard{position:fixed;left:0;right:0;bottom:0;z-index:100;font-size:24px;line-height:24px;background:#f6f6f6;color:#4a4a4a;width:100%;height:40%;user-select:none;transition-property:transform visibility;transition-duration:0.6s;font-weight:300;border-top:1px solid #e5e5e5;visibility:hidden;transform:translate3d(0,100%,0);z-index:98;}.modal-tips-keyboard table{width:100%;height:100%;border-collapse:collapse;table-layout:fixed;}.modal-tips-keyboard td:first-child{border-left:none;}.modal-tips-keyboard td:nth-of-type(-n + 3){font-weight:600;}.modal-tips-keyboard td{text-align:center;width:33.33%;border:1px solid #ddd;}.modal-tips-keyboard .icon{font-size:12px;}.modal-tips-keyboard .icon svg{width:18px;height:18px;}.modal-tips-keyboard td[data-code="K"]{font-size:20px;background:#ed5b5b;color:#ddd;}.modal-tips-keyboard.active{visibility:visible;transform:translateZ(0);}`
        document.getElementsByTagName("head")[0].appendChild(style);
        element.className += " modal-tips-keyboard active"
        element.innerHTML = `<table>
                <tbody>
                    <tr>
                        <td onclick="keyBordNum('1')">1</td>
                        <td onclick="keyBordNum('2')">2</td>
                        <td onclick="keyBordNum('3')">3</td>
                        <td onclick="keyBordNum('D')" data-code="D" rowspan="2">
                            <span class="icon icon-del">
                                <svg data-v-7ef413f4 version="1.1" viewBox="0 0 48.4 36" class="svg-icon svg-fill">
                                    <path pid="0"
                                        d="M29.4 19.7l6.2 6.3 1.7-1.7-6.2-6.3 6.3-6.3-1.8-1.7-6.3 6.3-6.2-6.3-1.7 1.7 6.2 6.3-6.3 6.3 1.8 1.7 6.3-6.3zM39.9 3.2a5.3 5.3 0 0 1 5.4 5.3v19a5.3 5.3 0 0 1-5.4 5.3h-20a5.4 5.4 0 0 1-3.9-1.6L3.5 18.8a1 1 0 0 1 0-1.5L16 4.8a5.4 5.4 0 0 1 3.9-1.6h20zm0-3.2H20.7a8.6 8.6 0 0 0-6.2 2.6L1.3 15a4.2 4.2 0 0 0 0 6l13.3 12.4a8.6 8.6 0 0 0 6.1 2.6h19.2a8.5 8.5 0 0 0 8.5-8.5v-19A8.5 8.5 0 0 0 39.9 0z" />
                                </svg>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td onclick="keyBordNum('4')">4</td>
                        <td onclick="keyBordNum('5')">5</td>
                        <td onclick="keyBordNum('6')">6</td>
                    </tr>
                    <tr>
                        <td onclick="keyBordNum('7')">7</td>
                        <td onclick="keyBordNum('8')">8</td>
                        <td onclick="keyBordNum('9')">9</td>
                        <td onclick="keyBordNum('K');" data-code="K" rowspan="2" id="JS_form_tip_finish">Ok</td>
                    </tr>
                    <tr class="lastRow">
                        <td onclick="keyBordNum('.')">.</td>
                        <td class="zero" onclick="keyBordNum('0')">0</td>
                        <td onclick="keyBordNum('F')" data-code="F">
                            <span class="icon icon-keyfold">
                                <svg version="1.1" viewBox="0 0 48 48" class="svg-icon svg-fill">
                                    <path pid="0"
                                        d="M25.2 19.2H30v-4.8h-4.8v4.8zm1.2-12h-4.8V12h4.8V7.2zm-8.4 12h4.8v-4.8H18v4.8zm1.2-12h-4.8V12h4.8V7.2zM24 48l9.6-9.6H14.4L24 48zm9.6-40.8h-4.8V12h4.8V7.2zM13.2 26.4h21.6v-4.8H13.2v4.8zM12 7.2H7.2V12H12V7.2zm20.4 12h4.8v-4.8h-4.8v4.8zM36 12h4.8V7.2H36V12zm7.2-12H4.8A4.8 4.8 0 0 0 0 4.8v24a4.8 4.8 0 0 0 4.8 4.8h38.4a4.8 4.8 0 0 0 4.8-4.8v-24A4.8 4.8 0 0 0 43.2 0zm2.4 28.8a2.4 2.4 0 0 1-2.4 2.4H4.8a2.4 2.4 0 0 1-2.4-2.4v-24a2.4 2.4 0 0 1 2.4-2.4h38.4a2.4 2.4 0 0 1 2.4 2.4v24zm-30-14.4h-4.8v4.8h4.8v-4.8z" />
                                </svg>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>`
        div = element
        ok = div.firstElementChild.firstElementChild.getElementsByTagName('tr')[2].lastElementChild
        price = priceElement
        keyboard.confirm();                         //点击确认的事件回调
        keyboard.keyboardOkBackground();            //初始化OK按钮背景色
        keyboard.setcursorSize()                    //初始化光标大小
        keyboard.isPoint(setOption)                 //键盘的显示形式
        //Object.assign({}, keyboard)               //只处理一层的深度拷贝
        //JSON.parse(JSON.stringify(keyboard))      //只适用于对象深度拷贝,函数会直接undefind
        //备选 lodash.js                            // cloneDeep方法 会循环遍历返回深拷贝后的新值,返回新的对象 此处不支持ES6,暂不使用
        //jquery 也有提供一个$.extend可以用来做 Deep Copy。
        return Object.assign({}, keyboard)
    }
    window.keyboard = keyboard
})(window)