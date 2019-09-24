//服务器地址，不能用localhost
var apiAddress = "http://119.3.248.218/ks/"
// var apiAddresss = "http://192.168.3.118:8080/api.do"
//签名key

// 关闭窗口方法

function closeWin() {
	api.closeWin();
}

jQuery.prototype.serializeObject = function() {
	var obj = {};
	$.each(this.serializeArray(), function(index, param) {
		if (!(param.name in obj)) {
			obj[param.name] = $.trim(param.value);
		}
	});
	return obj;
};
