/**
 * 对一些常用的组件进行封装
 */ 
var $JSCommonExts = {
		 /**
	     * 分页插件和page.jsp及jquery.pagination.js联合运用
	     * @param recordCount  数据总数
	     * @param callback     分页回调
	     * @param currPage     当前页
	     * @param fatherid     父选择器 若是id必须带#号
	     * @constructor
	     */
		showPagination: function (recordCount, callback, currPage, fatherid) {
	        var fatherobj = '.silde_right';
	        if (fatherid) {
	            fatherobj = fatherid;
	        }
	        var father = $(fatherobj);
	        var totalpage = 0;
	        var pageSize = Number(father.find(".pageSizeWrap .pageSize").val());
	        if (recordCount <= pageSize) {
	            totalpage = 1;
	        } else {
	            if ((recordCount % pageSize) > 0) {
	                totalpage = parseInt((recordCount / pageSize)) + 1;
	            } else {
	                totalpage = recordCount / pageSize;
	            }
	        }
	        father.find(".pageSizeWrap .currentPage").val(currPage);
	        father.find(".pageSizeWrap .RecordCount").val(recordCount);
	        father.find(".pageSizeWrap .RecordTotal").val(recordCount);
	        father.find(".pageSizeWrap .PageTotal").val(totalpage);
	        //分页
	        father.find(".pageSizeWrap .pageDiv").pagination(recordCount, {
	            callback: callback, //回调
	            prev_text: '&nbsp;',
	            next_text: '&nbsp;',
	            link_to: "javascript:void(0);",
	            items_per_page: parseInt(father.find(".pageSizeWrap .pageSize").val()), //每页显示的记录数
	            num_display_entries: 5, //显示的分页数
	            current_page: parseInt(currPage), //当前页码
	            num_edge_entries: 3,	//边缘显示的分页数
	            load_first_page: false,
	            show_if_single_page: true
	        });
	    },
	    
	    /**
	     * 绑定自定义下拉框 父节点的标识、更改值input的name，回调
	     * fatherid  父选择器 若是id必须带#号
	     * inputname 选中的项的隐藏input控件的name
	     * callback  选中后是执行方法回调
	     */
	    bindSelect: function (fatherid,inputname, callback) {
	        var fatherobj = $(fatherid);
	        fatherobj.on('click', "li", function () {
	            $(fatherid + " input[name=" + inputname + "]").val($(this).attr('data'));
	            if (callback) {
	                callback(this);
	            }
	        });
	    },	    
	    /**
	     * 设置下拉菜单值 父节点的标识、更改值input的name，回调
	     * fatherid  父选择器 若是id必须带#号
	     * inputname 选中的项的隐藏input控件的name
	     * value 初始化选中项并设置隐藏input的值
	     */
	    setSelectVal: function (fatherid,inputname, value) {
	        $(fatherid + " input[name=" + inputname + "]").val(value);
	        $(fatherid + " li").each(function () {
	            if (value == $(this).attr('data')) {
	                $(this).addClass('active');
	                var toggleDom = $(fatherid + " .toggleNum");
	                if (toggleDom.hasClass("inputTxt")) {
	                    toggleDom.val($(this).text());
	                } else {
	                    toggleDom.text($(this).text());
	                }
	                toggleDom.prop("title", $(this).text());
	            } else {
	                $(this).removeClass('active');
	            }
	        });
	    },
	    /**
	     * 通过ajax初始化下拉菜单
	     * fatherid  父选择器 若是id必须带#号
	     * inputname 选中的项的隐藏input控件的name
	     * url   请求url地址
	     * async 是否异步
	     * params 请求参数
	     * firstname  默认显示的名称
	     * firstvalue 默认数据
	     * dataId  后端获取数据的唯一值名字
	     * dataname 后端获取数据的显示名字
	     * showcount 是否显示数量 类似  全部（5）
	     */
	    initSelectData: function (fatherid,inputname, url, async, params, firstname, firstvalue, dataId, dataName, showCount) {
	            if (!dataId) {
	                dataId = "id";
	            }
	            if (!dataName) {
	                dataName = "name";
	            }
	            $.ajax({
	                type: "POST",
	                async: async,
	                url: url,
	                data: params,
	                dataType: "json",
	                beforeSend: function (XMLHttpRequest) {
	                },
	                success: function (data) {
	                    $(fatherid + " .manyNum").html('');
	                    if (data.code == 0 && data.data != null && data.data.length > 0) {
	                        var content = "";
	                        var first = true;
	                        for (var i = 0; i < data.data.length; i++) {
	                            if (first) {
	                                if (firstvalue == null) {
	                                    content += "<li title='"+data.data[i][dataName]+"' class='active ' data='" + data.data[i][dataId] + "'  >" + data.data[i][dataName] + "</li>";
	                                    $(fatherid + " input[name=" + inputname + "]").val(data.data[i][dataId]);
	                                    $(fatherid + " .toggleNum").text(data.data[i][dataName]);
	                                } else {
	                                    var countVal = "";
	                                    if (showCount == true) {
	                                        countVal = '（' + data.data.length + '）';
	                                    }
	                                    $(fatherid + " input[name=" + inputname + "]").val(firstvalue);
	                                    $(fatherid + " .toggleNum").text(firstname + countVal);
	                                    content += "<li title='"+ firstname + countVal + "' class='active' data='" + firstvalue + "'>" + firstname + countVal + "</li>";
	                                    content += "<li title='"+data.data[i][dataName]+"'   data='" + data.data[i][dataId] + "'  >" + data.data[i][dataName] + "</li>";
	                                }
	                                first = false;
	                            } else {
	                                content += "<li title='"+data.data[i][dataName]+"'   data='" + data.data[i][dataId] + "' >" + data.data[i][dataName] + "</li>";
	                            }
	                        }
	                        if (content != '') {
	                            $( fatherid + " .manyNum").append(content);
	                        } else {
	                            $(fatherid + " .toggleNum").text('');
	                            $( fatherid + " .manyNum").html('');
	                            $(fatherid + " input[name=" + inputname + "]").val('');
	                        }
	                    } else {
	                        if (firstvalue != null) {
	                            var countVal = "";
	                            if (showCount == true) {
	                                countVal = "（0）";
	                                $(fatherid + " .toggleNum").text(firstname + countVal);
	                            }

	                            $(fatherid + " .manyNum").append('<li class="active" data="' + firstvalue + '">' + firstname + countVal + '</li>');
	                            JsUtils.setSelectVal(fatherid, firstvalue);
	                        }else{
	                        	 $(fatherid + " input[name=" + inputname + "]").val(-1);
	                        	 $(fatherid + " .toggleNum").text('--');
	                        	 $(fatherid + " .manyNum").append('<li class="active" data="-1">--</li>');
	                        }

	                    }
	                },
	                error: function (XMLHttpRequest, textStatus, errorThrown) {
	                },
	                complete: function (XMLHttpRequest, textStatus) {
	                }
	            });        
	    }
}