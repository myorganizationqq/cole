<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>  
 <link rel="stylesheet" href="${gloablContextPath}/resources/css/common.css?version=${projectVersion}"> 
 <link rel="stylesheet" href="${gloablContextPath}/resources/css/jquery-ui-timepicker-addon.css?${projectVersion}">
 <link rel="stylesheet" href="${gloablContextPath}/resources/css/jquery-ui-1.10.2.min.css?${projectVersion}">
 <script src="${gloablContextPath}/resources/js/jquery/jquery.pagination.js?version=${projectVersion}"></script>
 <script src="${gloablContextPath}/resources/js/jquery/jquery-ui-1.10.2.min.js?version=${projectVersion}"></script>
 <script src="${gloablContextPath}/resources/js/jquery/jquery-ui-timepicker-addon.js?${projectVersion}"></script>
 <script src="${gloablContextPath}/resources/js/lib/common.js?${projectVersion}"></script>
 <script src="${gloablContextPath}/resources/js/lib/combox.js?${projectVersion}"></script>
</head>
<body> 
	<div class="content-wrapper">
		<section class="content-header">
			<h1>
				用户管理 <small>分配用户账号及角色，对用户进行管理</small>
			</h1>
			<ol class="breadcrumb">
			</ol>
		</section>
		<section class="content">
			<div class="row">
				<div class="col-xs-12">
					<div class="box">
						<div class="box-header">
	                        <div class="row">
	                            <div class="col-md-1">
	                                 <label class="form-inline">用户名:</label> 
	                            </div>
	                            <div class="col-md-2">
	                                <input type="text" name="username" class="form-control pull-right" placeholder="">
	                            </div>
	                            <div class="col-md-1">
	                                 <label class="form-inline">姓名:</label> 
	                            </div>
	                            <div class="col-md-2">
	                                <input type="text" name="fullname" class="form-control pull-right" placeholder="">
	                            </div>
	                            <div class="col-md-6">
	                                <div class="col-sm-2">
	                                    <label class="form-inline">角色:</label>
	                                  </div>
	                                  <div class="col-sm-10 btn-group">
										   <div class="downSelectWrap1 pr fl mr5  w150" id="userRole">
								                <input type="hidden" name="userRole" value="0"/>								
								                <div class="pa numIconWrap">
								                    <span class="toggleNum">全部</span><i class="icon icon_items pa">
								                    &nbsp;</i>
								                </div>
								                <ul class="manyNum pa none">
								                    <li class="active" data="0">全部</li>
								                </ul>
								            </div>
									  </div>
	                            </div>                          
	                        </div>	
	                        <div class="row">
	                            <div class="col-md-1">
	                                <label class="form-inline">创建时间:</label>
	                            </div>
	                            <div class="col-md-2">
	                                <input type="text" name="startTime" id="startTime" class="form-control pull-right"  >
	                            </div>
	                            <div class="col-md-1">
	                                <label class="form-inline">至</label>
	                            </div>
	                            <div class="col-md-2">
	                                <input type="text" name="endTime" id="endTime" class="form-control pull-right"  > 
	                            </div>
	                            <div class="col-md-6">
	                                <button type="button" class="btn btn-info">查询</button> 
	                            </div>
	                        </div>				 
						</div>
						<div class="box-body table-responsive no-padding">
							<table class="table table-hover">
								<tr>
									<th>用户名</th>
									<th>姓名</th>
									<th>注册时间</th>
									<th>更新时间</th>
									<th>状态</th>
									<th>操作</th>
								</tr>							
								 <tbody id="dataShow" />
							</table>
						</div>
						<div class="box-footer clearfix" id="dataShowpage">
							 <%@ include file="/WEB-INF/layouts/page.jsp" %>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<div class="box">
						<div class="box-body table-responsive no-padding">
							<table class="table table-hover">
								<tr>
									<th>用户名</th>
									<th>姓名</th>
									<th>注册时间</th>
									<th>更新时间</th>
									<th>状态</th>
									<th>操作</th>
								</tr>							
								 <tbody id="dataShow1" />
							</table>
						</div>
						<div class="box-footer clearfix" id="dataShow1page">
							 <%@ include file="/WEB-INF/layouts/page.jsp" %>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
	
<script>

$(function () {
//下拉菜单设置单击事件
$('.downSelectWrap1').comBox({
    ev: 'click',
    evObj: '.numIconWrap',
    changeObj: '.toggleNum',
    showObj: '.manyNum'
});
//时间选择例子
$('#startTime').datetimepicker({
    onClose: function (selectedDate) {
        $("#endTime").datepicker("option", "minDate", selectedDate);
    }, 
    maxDate: 0
});

$('#endTime').datetimepicker({
    onClose: function (selectedDate) {
        $("#startTime").datepicker("option", "maxDate", selectedDate);
    }, 
    maxDate: 0
});
//通过ajax获取下拉菜单数据
$JSCommonExts.initSelectData("#userRole","userRole", sGlobalUrlPrefix + "/sysmanage/role/listdata", false, {}, "全部", 0,"rid","name");
 
var UserList={
	getData:function(currPage){
		if( !(typeof currPage == "number")) currPage=0;
		var pagesize=$("#dataShowpage .pageSize").val() || 1;
		$.ajax({
            type: "POST",
            url: sGlobalUrlPrefix + '/sysmanage/user/listdata',
            data: "rid=0&startTime=2000-01-01 00:00&endTime=2018-01-01 00:00&curpage="+currPage+"&pagesize=" +pagesize,
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    $("#dataShow").html("");
                    var html = "";
                    var result = data.data;
                    userListJson = result;
                    var datacount = result.length;
                    $.each(result, function (i) {
                        html += '<tr id="userid_' + result[i].id + '">'
                        + '<td >' + result[i].username + '</td>'
                        + '<td >' + result[i].fullname + '</td>'
                        + '<td>' + result[i].regtime + '</td>'
                        + '<td>' + result[i].userstatus + '</td>'
                        + '<td>操作</td></tr>';
                    });                    
                    $("#dataShow").html(html);

                    //分页例子
                    $JSCommonExts.showPagination(data.page.totalCount, UserList.getData, data.page.curPage,"#dataShowpage");
                } else {
                   
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            	 
            },
            complete: function (XMLHttpRequest, textStatus) {
            }
        });
	}
}

//绑定分页
$JSCommonExts.bindSelect("#dataShowpage","pagesize", UserList.getData);
UserList.getData(0);

var UserList1={
		getData:function(currPage){
			if( !(typeof currPage == "number")) currPage=0;
			var pagesize=$("#dataShow1page .pageSize").val() || 1;
			$.ajax({
	            type: "POST",
	            url: sGlobalUrlPrefix + '/sysmanage/user/listdata',
	            data: "rid=0&startTime=2000-01-01 00:00&endTime=2018-01-01 00:00&curpage="+currPage+"&pagesize=" +pagesize,
	            dataType: "json",
	            success: function (data) {
	                if (data.code == 0) {
	                    $("#dataShow1").html("");
	                    var html = "";
	                    var result = data.data;
	                    userListJson = result;
	                    var datacount = result.length;
	                    $.each(result, function (i) {
	                        html += '<tr id="userid_' + result[i].id + '">'
	                        + '<td >' + result[i].username + '</td>'
	                        + '<td >' + result[i].fullname + '</td>'
	                        + '<td>' + result[i].regtime + '</td>'
	                        + '<td>' + result[i].updatetime + '</td>'
	                        + '<td>' + result[i].userstatus + '</td>'
	                        + '<td>操作</td></tr>';
	                    });                    
	                    $("#dataShow1").html(html);

	                    //分页例子
	                    $JSCommonExts.showPagination(data.page.totalCount, UserList1.getData, data.page.curPage,"#dataShow1page");
	                } else {
	                   
	                }
	            },
	            error: function (XMLHttpRequest, textStatus, errorThrown) {
	            	 
	            },
	            complete: function (XMLHttpRequest, textStatus) {
	            }
	        });
		}
	}

	//绑定分页
$JSCommonExts.bindSelect("#dataShow1page","pagesize", UserList1.getData);
UserList1.getData(0);

}
)

</script>
</body>
</html>