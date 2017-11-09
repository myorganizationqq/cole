String.prototype.Trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}
Date.prototype.Format = function(fmt) {
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

(function($) {
	// 备份jquery的ajax方法
	var _ajax = $.ajax;

	// 重写jquery的ajax方法
	$.ajax = function(opt) {
		// 备份opt中error和success方法
		var fn = {
			error : function(XMLHttpRequest, textStatus, errorThrown) {
			},
			beforeSend : function(XMLHttpRequest) {
			},
			success : function(data, textStatus) {
			},
			complete : function(XMLHttpRequest, textStatus) {
			}
		};
		if (opt.error) {
			fn.error = opt.error;
		}
		if (opt.success) {
			fn.success = opt.success;
		}
		if (opt.complete) {
			fn.complete = opt.complete;
		}
		if (opt.beforeSend) {
			fn.beforeSend = opt.beforeSend;
		}
		// 扩展增强处理
		var _opt = $.extend(opt, {
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				// 错误方法增强处理
				fn.error(XMLHttpRequest, textStatus, errorThrown);
			},
			beforeSend : function(XMLHttpRequest) {
				var csrftoken = $("#X-CSRFToken").val();
				XMLHttpRequest.setRequestHeader("X-CSRFToken", csrftoken);
				fn.beforeSend(XMLHttpRequest);
			},
			success : function(data, textStatus) {// 成功回调方法增强处理
				if (data != null && data.code == 603) {// 执行角色业务失败
					alertMsg(data.msg);
					return;
				} else if (data != null) {
					if (data.code == 2) {// 用户被踢出
						location.href = sGlobalUrlPrefix
								+ '/login?shiroLoginFailure=2';
						return;
					} else if (data.code == 3) {// 用户信息被修改
						location.href = sGlobalUrlPrefix
								+ '/login?shiroLoginFailure=3';
						return;
					} else if (data.code == 4) {// 会话过期
						location.href = sGlobalUrlPrefix
								+ '/login?shiroLoginFailure=4';
						return;
					} else if (data.code == 1) {// 未登录
						location.href = sGlobalUrlPrefix
								+ '/login?shiroLoginFailure=1';
						return;
					} else {
						fn.success(data, textStatus);
					}
				}
			},
			complete : function(XMLHttpRequest, textStatus) {
				fn.complete(XMLHttpRequest, textStatus);
			}
		});
		_ajax(_opt);
	};
})(jQuery);
