$('.detail').on('click', toDetail)
apiready = function () {
	api.setScreenOrientation({
		orientation: 'auto_portrait'
	});
	// processAjpush();
	pageInit();
	// 给所有的detail注册点击事件，跳转页面
};

function pageInit() {
	$api.fixStatusBar($api.dom('.header'));
	//初始化数据
	api.setStatusBarStyle({
		style: 'light',
		color: '#59493f'
	})
}

function toDetail() {

	var detailUrl = $(this).data('url');
	api.openWin({
		name: detailUrl.substr(-5, 5),
		url: detailUrl,
		bounces: true,
		
	});
}
