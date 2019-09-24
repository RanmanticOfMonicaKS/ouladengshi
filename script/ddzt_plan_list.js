var pageParam = {};
apiready = function() {
	initPage();
};
//初始化页面如果是正式库，需要注释掉
if (GbApi.configInfo().debugger) {
	initPage();
}

function initPage() {
	$api.fixStatusBar($api.dom('header'));
	$("#station_name").select({
		title : "选择站点",
		items : ["没有可选的站点"],
		onChange : function(obj) {
			$("#station_id").val(obj.values);
		}
	});
	//初始化状态
	$("#end_type_name").select({
		title : "选择站点",
		items : [{title: "全部",value: ""},{title: "已完成",value: "1"},{title: "未完成",value: "2"},],
		onChange : function(obj) {
			$("#end_type").val(obj.values);
		}
	});
	GbApi.initPz("H");
	$(".hj-close").click(function() {
		$(".hj").hide();
	});
	//选择客户
	$("#customer_name").click(function() {
		api.openWin({
			name : 'chose_cz',
			url : '../html/chose_kh.html',
			pageParam : {
				"customer_id" : $("#customer_id").val(),
				"name" : "cg_plan_list"
			}
		});
	});
	var userinfo = $api.getStorage('userinfo');
	GbApi.listData({
		data : {
			"ACTION_NAME" : "sqlKeyBiz.page#matouPlanQuery",
			"ACTION_INFO" : {"roleid" : userinfo.role_id,
							 "ziti_type" : 1}
		},
		callback : function(ret) {
			$(".main-items").append(GbApi.initTemp('temp_list', ret.ACTION_INFO.RESULT_LIST));
		}
	});
	GbApi.remote({
				data : {
					"ACTION_NAME" : "sqlKeyBiz.list#pricePlansaleTj",
					"ACTION_INFO" : {}
				},
				done : function(ret) {
					var result = ret.ACTION_INFO.RESULT_LIST[0];
					$("#wscsl").html(result.wwcsl + "/" + result.wwcdw+ "吨");
					$(".hj").show();
				}
			});
}

//编辑记录
function editJl(obj) {
	var $mainitem = $(obj).closest(".main-item");
	var id = $mainitem.attr("data-id");
	api.openWin({
		name : 'cg_plan_edit',
		url : '../html/cg_plan_edit.html',
		reload : true,
		pageParam : {
			"plan_sale_id" : id
		}
	});
}

function xdcx(obj) {
  var $mainitem = $(obj).closest(".main-item");
  var id = $mainitem.attr("data-id");
  var name = $mainitem.attr("data-name");
  api.openWin({
	  name: 'plan_item_list',
	  url: '../html/plan_item_list.html',
	  pageParam : {
			"plan_sale_id" : id,
			"customer_name": name
		}
  });
}

function callbackChoseKh(id, name) {
	$("#customer_name").val(name);
	$("#customer_id").val(id);
	GbApi.initZd(id,"H");
}
