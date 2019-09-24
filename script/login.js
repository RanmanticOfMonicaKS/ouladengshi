var pageParam = {
	frameName : '',
	winName : 'main',
	type : "N", //当为0的时候表示不需要回调
	param : ''
};
apiready = function() {
	$api.fixStatusBar($api.dom('header'));
	//得到传递的参数
	pageParam = api.pageParam;
	initPage();
}
//初始化页面如果是正式库，需要注释掉
if (GbApi.configInfo().debugger) {
	initPage();
}
function initPage() {
	//初始化HTML
	initHtml();
	//加入事件
	initEvent();
}

function initHtml() {
}

function initEvent() {
	$(".login-button").click(function() {
		var username = $("#username").val();
		var password = $("#password").val();
		if (!username) {
			api.toast({
				msg : '请输入用户名。',
				duration : 2000,
				location : 'middle'
			});
			return;
		}
		if (!password) {
			api.toast({
				msg : '请输入密码。',
				duration : 2000,
				location : 'middle'
			});
			return;
		}
		//和后台交互取出用户信息
		GbApi.remote({
			data : {
				"ACTION_NAME" : "loginBiz.appLogin#loginQuery",
				"ACTION_INFO" : {
					'username' : username,
					'password' : password
				}
			},
			done : function(ret) {
				var result = ret.ACTION_INFO.RESULT_LIST;
				if (result && result.length > 0) {
					GbApi.setUserinfo(ret.ACTION_INFO.RESULT_LIST[0]);
					api.toast({
						msg : '登录成功。',
						duration : 2000,
						location : 'middle'
					});
					if ("N" != pageParam.type) {
						var fun = 'processlogin("' + pageParam.param + '")';
						api.execScript({
							name : pageParam.winName ? pageParam.winName : 'root',
							script : fun
						});
					}
					api.closeFrame();
				} else {
					api.toast({
						msg : '用户不存在或密码错误。',
						duration : 2000,
						location : 'middle'
					});
					return;
				}
			}
		});
	});

	$(".register-button").click(function() {
		api.openWin({
			name : 'register',
			url : '../html/register.html'
		});
	});
}
