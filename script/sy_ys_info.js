var winH; //window窗口的高
var eleinputSearchInfo = $api.byId('searchInfo');
var y = $api.offset(eleinputSearchInfo).t + 7; //定位手机号输入框的位置y
var passWordTop; // 计算密码框底部到屏幕底部的距离
var UIInput;
var ddId;
var tempData;
// 每一页显示的数据条数：
var pagesize = 4;
// 当前页数
var current_page =1;

apiready = function() {
    $api.fixStatusBar($api.dom('.header'));
    // console.log($api.dom('.header'));

    winH = api.winHeight;
    eleinputSearchInfo = winH - $api.offset(eleinputSearchInfo).t - $api.offset(eleinputSearchInfo).h;
    UIInput = api.require('UIInput');
    UIInput_open();
    getMore();
    showScrollFrame();
    showYsINfo().then(tempData => {
      console.log(JSON.stringify(tempData));
      tempData = JSON.stringify(tempData)
      var jsfun = 'goToTemp('+ tempData +');';
      api.execScript({
          frameName: 'tempListScroll',
          script: jsfun
      });

    });
}

//  下拉 刷新 渲染数据的方法
function getMore() {
    api.setRefreshHeaderInfo({
        loadingImg: 'widget://image/refresh.png',
        bgColor: '#dfc7af',
        textColor: '#fff',
        textDown: '下拉刷新...',
        textUp: '松开刷新...'
    }, function(ret, err) {
        //在这里从服务器加载数据，加载完成后调用api.refreshHeaderLoadDone()方法恢复组件到默认状态
        showYsINfo().then(tempData => {
          tempData = JSON.stringify(tempData);
          api.execScript({
              frameName: 'tempListScroll',
              script: 'goToTemp('+ tempData +');'
          });

        })
        setTimeout(api.refreshHeaderLoadDone(),1000)
    });


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
        placeholder: '请输入客户编号或客户名称',
        inputType: 'text',
        fixedOn: api.frameName,
        fixed: false,
        keyboardType: 'number'
    }, function(ret, err) {
        if (ret) {
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
            ddId = Number(ret.msg);
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
// 打开滚动页面方法
function showScrollFrame(tempData) {

    api.openFrame({
        name: 'tempListScroll',
        url: '../html/temp_list_scroll.html',
        rect: {
            x: 0,
            y: 215,
            w: 'auto',
            h: 'auto'
        },
        bounces: true,
        bgColor: '#59493f',
        vScrollBarEnabled: true,
        hScrollBarEnabled: true

      })
}
// 获取html字符串的方法
function showYsINfo() {
  var getHtml = new Promise((resolve, reject) => {
        api.ajax({
            url: apiAddress + 'api.do',
            method: 'post',
            data: {
                body: {
                    gb_name: 'queryBiz.page#ks_getYsInfo_byCondition',
                    param_info: {
                        pagesize,
                        current_page: current_page++,
                    }
                }
            }
        }, function(ret, err) {
            if (ret) {
                console.log(JSON.stringify(current_page));
                console.log(JSON.stringify(ret));
                tempData = {
                    data: ret.param_info
                };
                resolve(tempData);
            } else {
                reject(err);
            }
        });
    });
    return getHtml;
}
// console.log(JSON.stringify(html));


function fnsearch(id) {
    console.log('进入查询');
    api.showProgress({
        title: '正在查询',
        text: '请稍后',
        modal: true
    });

    UIInput_value(id);
    setTimeout(() => {
        console.log(JSON.stringify(ddId));
        if (ddId) {
            allDD(ddId).then( tempDate => {
              if (tempData.data.count > 0) {
                  api.hideProgress();
                  tempData = JSON.stringify(tempData);
                  var jsfun = 'goToSelected('+ tempData +');';
                  api.execScript({
                      frameName: 'tempListScroll',
                      script: jsfun
                  });

              } else {
                  api.toast({
                      msg: '不存在客户信息\n请确认后重新输入',
                      duration: 2000,
                      location: 'bottom'
                  });
                  api.hideProgress();

              };
            } )

        } else {
            api.hideProgress();

            var tmpText = doT.template($('#tempList').text());
            $('.tempList').html(tmpText(tempData));
        }
        // 如果传入的是订单号
        // 如果传入的是品牌名称   暂时只提供订单号查询
    }, 500);
}
// 查询所有单条的方法
function allDD(ddId) {
  var alldd  = new Promise((resolve,reject) =>{
     api.ajax({
        url: apiAddress + 'api.do',
        method: 'post',
        data: {
          body: {
              gb_name: 'queryBiz.list#ks_getYsInfo_byCondition',
              param_info: {
                ddId
              }
          }
        }
    },function(ret, err){
        if (ret) {
          tempData ={data : ret.param_info } ;
          // 添加page避免后面模板页面报错
          tempData.data.page = '1';
          // console.log(JSON.stringify(tempData));
          resolve(tempData);
        } else {
          reject(err);
        }
    });

 })
return alldd;
}
