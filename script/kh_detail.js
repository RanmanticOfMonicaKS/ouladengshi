var pageParam = {
};
apiready = function() {
	pageParam = api.pageParam;
	initPage();
};
if (GbApi.configInfo().debugger) {
	initPage();
}

function initPage() {
	$api.fixStatusBar($api.dom('header'));
	$(".cldiv").hide();
	GbApi.initPz("N",true);
	$('input:radio').labelauty();
	var userinfo = GbApi.configInfo();
	$("#base_user").val(userinfo.name);
	GbApi.initAddress(function(ret){
	  if (pageParam.customer_id) {
	     $("#customer_address").val("");
	  }
	});
	//如果存在，就需要回显数据
	if (pageParam.customer_id) {
		GbApi.remote({
			data : {
				"ACTION_NAME" : "sqlKeyBiz.list#customerQuery",
				"ACTION_INFO" : {
					"customer_id" : pageParam.customer_id
				}
			},
			done : function(ret) {
				var results = ret.ACTION_INFO.RESULT_LIST;
				if (results.length > 0) {
					initData(results[0]);
				}
			}
		});
		GbApi.remote({
			data : {
				"ACTION_NAME" : "sqlKeyBiz.list#customerZitiQuery",
				"ACTION_INFO" : {
					"customer_id" : pageParam.customer_id
				}
			},
			done : function(ret) {
				var results = ret.ACTION_INFO.RESULT_LIST;
				if (results.length > 0) {
					initCar(results);
				}
			}
		});
	}
//	$("input[name='ziti_type']").click(function() {
//		showCar();
//		if ($("#ziti_type").is(':checked')) {
//			$(".cldiv").show();
//			$(".flex-con").scrollTop($(".flex-con").scrollTop() + 200)
//		}
//	});
//	$("#add_car").click(function() {
//		api.prompt({
//			title : '输入车牌号',
//			buttons : ['确定', '取消']
//		}, function(ret, err) {
//			var index = ret.buttonIndex;
//			var text = ret.text;
//			if (text) {
//				//判断一下如果存在就不处理
//				var flag = true;
//				$(".form_clxx .car-name").each(function(index, item) {
//					if ($(item).text() == text) {
//						flag = false;
//						return;
//					}
//				});
//				if (!flag) {
//					return;
//				}
//				$(".form_clxx").append(GbApi.initTemp('temp_car', [], {
//					value : text
//				}));
//			}
//		});
//	});
//	$("#save_").click(function() {
//		_save();
//	});
	$("#saveZd_").click(function() {
		var customer_id = $("#customer_id").val();
		if (!customer_id) {
			GbApi.toast("请先提交客户主体信息！");
			return;
		}
		//转向客户站点
		api.openWin({
			name : 'kh_zd_list',
			url : '../html/kh_zd_list.html',
			reload : true,
			pageParam : {
				"customer_id" : customer_id,
				"customer_name" : $("#customer_name").val()
			}
		});
	});
//	$("#search_data").click(function() {
//		api.openWin({
//			name : "kh_list",
//			url : "../html/kh_list.html"
//		});
//	});
//	$(".weui-uploader__input-box").click(function() {
//		GbApi.getPiture(function(ret) {
//			if (ret) {
//				$("#uploaderFiles").append('<li class="weui-uploader__file" data-type="2" data-url="" style="background-image:url(' + ret + ')"></li>');
//			}
//		});
//	});

}

function initData(result) {
	$("#base_user").val(result.base_user);
	$("#customer_id").val(result.customer_id);
	$("#customer_name").val(result.customer_name);
	$("#customer_owner").val(result.customer_owner);
	$("#customer_owner_tel").val(result.customer_owner_tel);
	$("#customer_address").val(result.customer_address);
	$("#customer_operator").val(result.customer_operator);
	$("#customer_operator_tel").val(result.customer_operator_tel);
	$("#customer_remark").val(result.customer_remark);
	$("input[name='fkfs'][value=" + result.fkfs + "]").attr("checked", true);
	$("input[name='customer_type']").attr("checked", result.customer_type == 1 ? true : false);
	$("input[name='ziti_type']").attr("checked", result.ziti_type == 1 ? true : false);
	$("#sort_id").val(result.sort_ids);
	$("#sort_name").val(result.sort_names);
	showCar();
	var imgUrl = result.img_url;
	var imgUrls = imgUrl.split(",");
	for (var i = 0; i < imgUrls.length; i++) {
        if (imgUrls[i])
		$("#uploaderFiles").append('<li class="weui-uploader__file" data-url="'+imgUrls[i]+'" data-type="1" style="background-image:url(' + imgUrls[i] + ')"></li>');
	}
}

function showCar() {
	if ($("#ziti_type").is(':checked')) {
		$(".cldiv").show();
	} else {
		$(".cldiv").hide();
	}
}

function initCar(result) {
	$.each(result, function(index, item) {
		$(".form_clxx").append(GbApi.initTemp('temp_car', [], {
			value : item.truck_name
		}));
	});
}

//提交表单
function _save() {
	var paramJson = $("#query_form").serializeObject();
	if (!paramJson.customer_name) {
		$.toptip('请填写客户名称', 'warning');
		$("#customer_name").focus();
		return;
	}
	if (!paramJson.customer_address) {
		$.toptip('请填写地址', 'warning');
		$("#customer_address").focus();
		return;
	}
	paramJson.customer_address = $.trim($("#addressView_value").html())+$("#customer_address").val();
	var pz = $("#sort_name").val();
	if (!pz) {
		$.toptip('请选择品名', 'warning');
		$("#sort_name").focus();
		return;
	}
	paramJson.sort_names = pz;
	paramJson.sort_ids = $("#sort_id").val();
	if (!$("#caigou_type").is(':checked')) {
		paramJson.caigou_type = "2";
	}
	if (!$("#ziti_type").is(':checked')) {
		paramJson.ziti_type = "2";
	}
	var customer_id = $("#customer_id").val();
	var data = {};
	if (customer_id) {
		data.ACTION_NAME = "sqlKeyBiz.updateKh#update_customer";
		paramJson.customer_id = customer_id;
		paramJson.update_user = GbApi.configInfo().username;
	} else {
		data.ACTION_NAME = "sqlKeyBiz.insertKh#add_customer";
		paramJson.create_user = GbApi.configInfo().username;
	}
	var cars = [];
	//如果是自提，则需要处理
	if (paramJson.ziti_type == 1) {
	   if($(".form_clxx .car-name").length<=0) {
	       $.toptip('请填写自提车辆信息', 'warning');
	       return;
	    }
		$(".form_clxx .car-name").each(function(index, item) {
			cars.push($(item).text());
		});
		paramJson.cars = cars.join();
		//处理图片
		$("#uploaderFiles").find("li").each(function() {
		    var that = $(this);
			var type = $(this).attr("data-type");
			if (type == 2) {
				GbApi.uploadPiture($(this).css('backgroundImage'), function(ret) {
					that.attr("data-type", 1);
					that.attr("data-url", ret);
				});
			}
		});
	}
	data.ACTION_INFO = paramJson;
	if (paramJson.ziti_type == 1) {
	    if($("#uploaderFiles").find("li").length<=0) {
	       $.toptip('请选择车辆授权图片', 'warning');
	       return;
	    }
		var t
		window.timedCount=function() {
		    if ($("#uploaderFiles").find("li[data-type='2']").length>0) {
              t = setTimeout("timedCount()", 500);
              return;
            }
            window.timedCount =null;
            clearTimeout(t);
            var imgUrl = "";
			$("#uploaderFiles").find("li").each(function () {
				imgUrl = imgUrl+$(this).attr('data-url')+",";
			});
			if (imgUrl) {
				imgUrl  = imgUrl.substring(0,imgUrl.length-1);
			}
			paramJson.img_url = imgUrl;
			_bcsave(data);
		}
		timedCount();
	} else {
	   _bcsave(data);
	}

}

function _bcsave(data) {
	//提交数据
	GbApi.remote({
		data : data,
		done : function(ret) {
			GbApi.toast("客户录入成功！");
			if (!$("#customer_id").val())
				$("#customer_id").val(ret.ACTION_INFO);
			api.confirm({
				msg : '您是否继续添加客户站点信息？',
				buttons : ['继续添加', '取消']
			}, function(ret, err) {
				var index = ret.buttonIndex;
				if (index == 1) {
					//转向客户站点
					api.openWin({
						name : 'kh_zd_list',
						url : '../html/kh_zd_list.html',
						reload : true,
						pageParam : {
							"customer_id" : $("#customer_id").val(),
							"customer_name" : $("#customer_name").val()
						}
					});
				} else if (index == 2) {
					api.openWin({
						name : "kh_list",
						reload : true,
						url : "../html/kh_list.html"
					});
				}
			});
		}
	});

}

function deleteCar(obj) {
	$(obj).closest(".weui-cell").remove();
}

//function callbackChoseYh(id, name) {
//	$("#base_user").val(name);
//}
