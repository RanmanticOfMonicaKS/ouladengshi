var headerH = $api.offset($api.dom('.header')).h;
//所有品牌数据
var msg;
var ppData;
// 对应的index
var index = 0;
console.log(headerH);
apiready = function() {
    $api.fixStatusBar($api.dom('.header'));
    // 发送ajax得到数据
    var UIListView = api.require('UIListView');
    // 发送ajax，显示数据  数据量不大，可以提前请求
    // 打开uilistview

    UIListView.open({
        rect: {
            x: 0,
            y: headerH + 10,
            w: api.winWidth,
            h: api.frameHeight - headerH
        },
        data: [{
            uid: '1001',
            imgPath: 'widget://image/1.jpg',
            title: '海之蓝',
            subTitle: '蓝色海洋的心旷神怡',
            remark: '查看详情',
            icon: ''
        }, {
            uid: '1002',
            imgPath: 'widget://image/2.jpg',
            title: '光之梦',
            subTitle: '明亮的梦幻的向往',
            remark: '查看详情',
            icon: ''
        }, {
            uid: '1003',
            imgPath: 'widget://image/3.jpg',
            title: '天之痕',
            subTitle: '华美蓝色调的仰望',
            remark: '查看详情',
            icon: ''
        }, {
            uid: '1004',
            imgPath: 'widget://image/4.jpg',
            title: '水之皓',
            subTitle: '洁白纯净的温柔',
            remark: '查看详情',
            icon: ''
        }],
        rightBtns: [{
            bgColor: '#009688',
            activeBgColor: '',
            width: 70,
            title: '修改',
            titleSize: 16,
            titleColor: '#fff',
            icon: '',
            iconWidth: 20
        }, {
            bgColor: '#e51c23',
            activeBgColor: '',
            width: 70,
            title: '删除',
            titleSize: 16,
            titleColor: '#fff',
            icon: '',
            iconWidth: 20
        }],
        styles: {
            borderColor: '#696969',
            item: {
                bgColor: '#dfc7af',
                activeBgColor: '#F5F5F5',
                height: 55.0,
                imgWidth: 40,
                imgHeight: 40,
                imgCorner: 4,
                placeholderImg: '',
                titleSize: 12.0,
                titleColor: '#000',
                subTitleSize: 12.0,
                subTitleColor: '#000',
                remarkColor: '#000',
                remarkSize: 16,
                remarkIconWidth: 30
            }
        },
        fixedOn: api.frameName
    }, function(ret, err) {
        if (ret) {

            // open的时候就已经设置了回调，根据回到的参数判断用户行为
            index = ret.index || 0;
            console.log(JSON.stringify(index));
            if (ret.eventType == 'clickContent') {
                if (index == 1) {
                    $('#wrap').css({
                        'background-color': '#e3dbd9'
                    })
                } else {
                    $('#wrap').css({
                        "background-color": '#000'
                    })

                }
                $(".shouPP").css({
                    "background-image": "url(../image/" + (index + 1) + ".jpg)",
                    "height": api.frameWidth
                });
                api.ajax({
                        url: apiAddress + 'api.do',
                        method: 'post',
                        timeout: 30,
                        dataType: 'json',
                        returnAll: false,
                        data: {
                            body: {
                                gb_name: 'queryBiz.list#ks_getPPInfo_byCondition',
                                param_info: {

                                }
                            }

                        }
                    }, function(ret, err) {
                        if (ret) {
                            console.log(JSON.stringify(ret));
                            ppData = ret.param_info.records;

                            msg =
                                '产品名称：' + ppData[index].ppname + '\n' +
                                '产品价格：' + ppData[index].ppprice + '\n' +
                                '产品库存：' + ppData[index].ppkucun + '\n';
                                setTimeout(api.toast({
                                      msg: msg,
                                      duration: 2000,
                                      location: 'bottom'
                                  }),100)
                    } else {

                        return api.alert({
                            msg: ('错误码：' + err.code + '；错误信息：' + err.msg + '网络状态码：' + err.statusCode)
                        });
                    };
                });
            }

        } else {
            alert(JSON.stringify(err));
        }

    });

    // 获取数据的方法



}
