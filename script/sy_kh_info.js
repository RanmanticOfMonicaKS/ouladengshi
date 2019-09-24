var winH; //window窗口的高
var eleinputSearchInfo = $api.byId('searchInfo');
var y = $api.offset(eleinputSearchInfo).t + 7; //定位手机号输入框的位置y
var passWordTop; // 计算密码框底部到屏幕底部的距离
var UIInput;
var khparam;
var tempData;
//
apiready = function() {
    api.parseTapmode();
    $api.fixStatusBar($api.dom('.header'));
    // console.log($api.dom('.header'));
    winH = api.winHeight;
    eleinputSearchInfo = winH - $api.offset(eleinputSearchInfo).t - $api.offset(eleinputSearchInfo).h;
    UIInput = api.require('UIInput');
    UIInput_open();
    showYsINfo();
}

function UIInput_open() {
    UIInput.open({
        rect: {
            x: 44,
            y: y,
            w: api.winWidth - 88,
            h: 30
        },
        styles: {
            bgColor: '#fff',
            size: 14,
            color: '#000',
            placeholder: {
                color: '#ccc'
            }
        },
        autoFocus: true,
        maxRows: 1,
        placeholder: '请输入客户编号或客户名称查询',
        inputType: 'text',
        fixedOn: api.frameName,
        fixed: false,
        keyboardType: 'text'
    }, function(ret, err) {
        if (ret) {
            console.log(JSON.stringify(ret));
            id = ret.id;
            UIInput.addEventListener({
                id: id,
                name: 'resignFirstResponder'
            }, function() {

            });
            UIInput.addEventListener({
                id: id,
                name: 'becomeFirstResponder'
            }, function(ret) {
                //console.log("输入框获得焦点！" + api.winHeight + ret.keyboardHeight);
                if (ret.keyboardHeight) {
                    if (api.systemType == 'android' || api.systemType == 'Android') {
                        fnscoll(ret.keyboardHeight);
                    }
                }
            });
        }
    });
}

function UIInput_value(oneid) {
    UIInput.value({
        id: oneid
    }, function(ret, err) {

        if (ret) {
            console.log('进入value');
            console.log(JSON.stringify(ret));
            khparam = ret.msg;
        }
    });
}

function closeUIIput(id) {
    UIInput.close({
        id: id
    });
}

//滚动页面防止被键盘遮挡,仅Android需要
function fnscoll(L) {
    console.log(L + ':' + passWordTop);
    if (L > passWordTop) {
        document.body.scrollTop = L - passWordTop; //滚动距离=键盘高度-密码框距屏幕底部距离
    }
}

function fnclear() {
    UIInput.value({
        id: id,
        msg: ''
    }, function(ret, err) {
        if (ret) {
            console.log(JSON.stringify(ret));
        }
    });
}

//展示数据
function showYsINfo() {
    api.ajax({
        url: apiAddress + 'api.do',
        method: 'post',
        data: {
            body: {
                gb_name: 'queryBiz.list#ks_getKhInfo_byCondition',
                param_info: {

                }
            }
        }
    }, function(ret, err) {
        if (ret) {
            console.log(JSON.stringify(ret));
            tempData = {
                data: ret.param_info.records
            };
            var tmpText = doT.template($('#tempList').text());
            $('.tempList').html(tmpText(tempData));

        } else {
            alert(JSON.stringify(err));
        }
    });

}

function fnsearch(id) {
    console.log('进入查询');
    api.showProgress({
        title: '正在查询',
        text: '请稍后',
        modal: true
    });

    UIInput_value(id);
    setTimeout(() => {
        console.log(JSON.stringify(khparam));
        if (khparam) {
            tempData1 = {
                data: tempData.data.filter(item => JSON.stringify(item.khid).indexOf(khparam) != -1 || JSON.stringify(item.khname).indexOf(khparam) != -1)
            };
            if (tempData.data.length > 0) {
                api.hideProgress();
                var tmpText = doT.template($('#tempList').text());
                $('.tempList').html(tmpText(tempData1));
            } else {
                api.toast({
                    msg: '不存在改订单运输信息\n请确认后重新输入',
                    duration: 2000,
                    location: 'bottom'
                });
                api.hideProgress();

            };
        } else {
            api.hideProgress();

            var tmpText = doT.template($('#tempList').text());
            $('.tempList').html(tmpText(tempData));
        }
        // 如果传入的是订单号
        // 如果传入的是品牌名称   暂时只提供订单号查询
    }, 500);
}

//定义关闭页面的方法
function closeWin() {
  console.log('关闭当前页面');
    //安卓应用
    api.closeWin({
        name: api.winName

    });

}
