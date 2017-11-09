<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
<title>权限管理</title>
<style type="text/css">
body {
	padding-top: 10px;
}

.insertClass td, .rigthClass td {
	padding: 3px 2px;
}

.leftClass {
	float: left;
	width: 50%;
	margin-top: 10px;
}

.rigthClass {
	float: right;
	width: 50%;
	margin-top: 10px;
}

.insertCLass {
	margin-bottom: 10px;
}
</style>
<link href="resources/js/ligerUI/skins/Aqua/css/ligerui-all.css" rel="stylesheet"
	type="text/css" />
<script src="resources/js/jquery/jquery-2.2.3.min.js" type="text/javascript"></script>
<script src="resources/js/ligerUI/core/base.js" type="text/javascript"></script>
<script src="resources/js/ligerUI/plugins/ligerTree.js" type="text/javascript"></script>
<script src="resources/js/ligerUI/plugins/ligerTip.js" type="text/javascript"></script>
<script type="text/javascript">
	$(function() {
		var tree = $("#privilegeTree")
				.ligerTree(
						{
							url : "privilege/all?flag=" + new Date(),
							idFieldName : 'resid',
							slide : false,
							parentIDFieldName : 'parentid',
							checkbox : true,
							single : true,
							textFieldName : "name",
							attribute : [ "resid", "name", "url", "parentid",
									"operate", "layer", "ord", "display",
									"iconclass", "recordlog", "target",
									"description", "roles" ],
							isExpand : false,
							nodeWidth : 400,
							onSelect : function(item) {
								html = "<table class='editclass'>";
								html += "<tr>"
								html += "<td>名称:</td><td><input type='text' id='uname' value='" + item.data.name + "' style='width:400px;'/></td>"
								html += "</tr>"
								html += "<tr>"
								html += "<td>URL:</td><td><input type='text' id='uurl' value='" + item.data.url + "' style='width:400px;' /></td>"
								html += "</tr>"
								html += "<tr>"
								html += "<td>父字点:</td><td>" + item.data.parentid + "</td>"
								html += "</tr>"
								html += "<tr style='display:none'>"
								html += "<td>操作</td><td><input type='text' id='uoperate' value='" + item.data.operate + "'  /></td>"
								html += "</tr>"
								html += "<tr>"
								html += "<td>层:</td><td>" + item.data.layer
										+ "</td>"
								html += "</tr>"
								html += "<tr>"
								html += "<td>排序:</td><td><input type='text' id='uord' value='" + item.data.ord + "' style='width:50px;' /></td>"
								html += "</tr>"

								html += "<tr>"
								html += "<td>是否显示菜单:</td><td>"
								if (item.data.display == 1) {
									html += "<input type='radio' name='udisplay' checked='checked' value='1'>是</input><input type='radio' name='udisplay'  value='0'>否</input> "
								} else {
									html += "<input type='radio' name='udisplay' value='1'>是</input><input type='radio' name='udisplay' checked='checked'  value='0'>否</input> "
								}
								html += "</td>"
								html += "</tr>"

								html += "<tr>"
								html += "<td>图标样式</td><td><input type='text' id='uiconclass' value='" + (item.data.iconclass || "") + "' style='width:300px;' /></td>"
								html += "</tr>"

								html += "<tr>"
								html += "<td>是否记录日志:</td><td>"
								if (item.data.recordlog == 1) {
									html += "<input type='radio' name='urecordlog' checked='checked' value='1'>是</input><input type='radio' name='urecordlog'  value='0'>否</input> "
								} else {
									html += "<input type='radio' name='urecordlog' value='1'>是</input><input type='radio' name='urecordlog' checked='checked'  value='0'>否</input> "
								}

								html += "</td>"
								html += "</tr>"

								html += "<tr>"
								html += "<td>是否是目标地址:</td><td>"
								if (item.data.target == 1) {
									html += "<input type='radio' name='utarget' checked='checked' value='1'>是</input><input type='radio' name='utarget'  value='0'>否</input> "
								} else {
									html += "<input type='radio' name='utarget' value='1'>是</input><input type='radio' name='utarget' checked='checked'  value='0'>否</input> "
								}

								html += "</td>"
								html += "</tr>"

								html += "<tr>"
								html += "<td>描述:</td><td><input type='text' id='udescription' value='" + (item.data.description || "") + "' style='width:150px;' /></td>"
								html += "</tr>"

								html += "<tr>"
								html += "<td>关联角色:</td><td><input type='text' id='uroles' value='" + item.data.roles + "' style='width:350px;' /></td>"
								html += "</tr>"

								html += "<tr>"
								html += "<td><input type='button' value='修改' onclick='update("
										+ item.data.resid
										+ ");' /><td><td><input type='button' value='删除' onclick='deletePemisseion("
										+ item.data.resid + ");' /></td>"
								html += "</tr>"

								html += "</table>"

								$("#showInfo").html(html)
							}
						});
		treeManager = $("#privilegeTree").ligerGetTreeManager();
		//treeManager.collapseAll();

		var tree = $("#roleTree").ligerTree({
			url : "privilege/getRoleData",
			idFieldName : 'rid',
			slide : false,
			parentIDFieldName : 'parent',
			checkbox : true,
			single : false,
			textFieldName : "name",
			nodeWidth : 150,
			isExpand : false,
			attribute : [ "rid", "name", "parent" ]
		});
	});

	function getParent() {
		t1 = $("#privilegeTree").ligerGetTreeManager();
		var parent = t1.getChecked()
		if (parent[0] == null) {
			return null;
		} else {
			var pid = parent[0].data.resid
			console.log("resid:" + pid);
			return pid;
		}
	}

	function getLayer() {
		t1 = $("#privilegeTree").ligerGetTreeManager();
		var parent = t1.getChecked()
		if (parent[0] == null) {
			return 1;
		} else {
			var layer = parent[0].data.layer
			console.log("layer:" + layer);
			if (layer == null) {
				layer = 1
			} else {
				layer += 1
			}
			return layer;
		}
	}

	function getroleIds() {
		t2 = $("#roleTree").ligerGetTreeManager();
		var t2c = t2.getChecked();
		var str = "";
		for ( var i in t2c) {			
			str += t2c[i].data.rid + ",";
		}
		alert(str);
		return str;
	}

	function getload() {
		var name = $("#name").val();
		var url = $("#url").val();
		var ord = $("#ord").val();
		var parentid = getParent()
		var roles = getroleIds()
		var operate = $("#operate").val();
		var layer = getLayer()
		var display = $("input[name='display']:checked").val();
		var iconclass = $("#iconclass").val();
		var recordlog = $("input[name='recordlog']:checked").val();
		var target = $("input[name='target']:checked").val();
		var description = $("#description").val();		 

		if (name == null || name == "") {
			alert("名称不能为空")
			return;
		}
		if (url == null || url == "") {
			alert("URL不能为空")
			return;
		}
		if (ord == null || ord == "") {
			alert("排序不能为空")
			return;
		}

		var params = {};
		if (name != null) {
			params["name"] = name
		}
		if (url != null) {
			params["url"] = url
		}
		if (ord != null) {
			params["ord"] = ord
		}
		if (parentid != null) {
			params["parentid"] = parentid
		}
		if (roles != null) {
			params["roles"] = roles
		}
		if (operate != null) {
			params["operate"] = operate
		}
		if (layer != null) {
			params["layer"] = layer
		}
		if (display != null) {
			params["display"] = display
		}
		if (iconclass != null) {
			params["iconclass"] = iconclass
		}
		if (recordlog != null) {
			params["recordlog"] = recordlog
		}
		if (target != null) {
			params["target"] = target
		}
		if (description != null) {
			params["description"] = description
		} 

		console.log(JSON.stringify(params))
		
		
		$.ajax({
			url : "privilege/insertResource",
			type : "POST",
			data : params,
			dataType : "json",

			beforeSend : function() {
				$("input[type=button]").attr('disabled', 'disabled');
			},
			error : function() {
				$("input[type=button]").removeAttr('disabled');
			},
			success : function(datas) {
				$("input[type=button]").removeAttr('disabled');
				if (datas.code != 0) {
					alert(datas.msg)
				} else {
					alert("增加成功")
					window.location.reload();
				}
			}
		});
	}

	function update(pid) {
		if (pid == null) {
			alert("id不能为空 ")
			return;
		}
		var name = $("#uname").val();
		var url = $("#uurl").val();
		var ord = $("#uord").val();
		var roles = $("#uroles").val()
		var operate = $("#uoperate").val();
		var display = $("input[name='udisplay']:checked").val();
		var iconclass = $("#uiconclass").val();
		var recordlog = $("input[name='urecordlog']:checked").val();
		var target = $("input[name='utarget']:checked").val();
		var description = $("#udescription").val();	 

		var params = {};
		  if (pid != null) {
              params["resid"] = pid
          }
		if (name != null) {
			params["name"] = name
		}
		if (url != null) {
			params["url"] = url
		}
		if (ord != null) {
			params["ord"] = ord
		}
		if (roles != null) {
			params["roles"] = roles
		}
		if (operate != null) {
			params["operate"] = operate
		}
		if (display != null) {
			params["display"] = display
		}
		if (iconclass != null) {
			params["iconclass"] = iconclass
		}
		if (recordlog != null) {
			params["recordlog"] = recordlog
		}
		if (target != null) {
			params["target"] = target
		}
		if (description != null) {
			params["description"] = description
		} 
		
		$.ajax({
			url : "privilege/updateResource",
			type : "POST",
			data : params,
			dataType : "json",
			beforeSend : function() {
				$("input[type=button]").attr('disabled', 'disabled');
			},
			error : function() {
				$("input[type=button]").removeAttr('disabled');
			},
			success : function(datas) {
				$("input[type=button]").removeAttr('disabled');
				if (datas.code != 0) {
					alert(datas.msg)
				} else {
					alert("修改成功")
					window.location.reload();
				}
			}
		});
	}

	function deletePemisseion(pid) {
		if (pid == null) {
			alert("id不能为空 ")
			return;
		}

		$.ajax({
			url : "privilege/deleteResource",
			type : "POST",
			data : {
				"resid" : pid
			},
			dataType : "json",
			beforeSend : function() {
				$("input[type=button]").attr('disabled', 'disabled');
			},
			error : function() {

				$("input[type=button]").removeAttr('disabled')
			},
			success : function(datas) {
				$("input[type=button]").removeAttr('disabled');
				if (datas.code != 0) {
					alert(datas.msg)
				} else {
					alert("删除成功")
					window.location.reload();
				}
			}
		});
	}
</script>
</head>
<body style="padding: 10px">
	<div class='leftClass'>
		<form action="privilege/addResource">
			<table class='insertClass'>
				<tr>
					<td>资源树结构：</td>
					<td>
						<ul id="privilegeTree"></ul>
					</td>
				</tr>
				<tr>
					<td colspan="2"><hr></hr></td>
				</tr>
				<tr>
					<td>添加资源：</td>
					<td></td>
				</tr>
				<tr>
					<td>资源名称：</td>
					<td><input type="text" id="name" name="name"
						style="width: 200px;"></input></td>
				</tr>
				<tr>
					<td>url：</td>
					<td><input type="text" id="url" name="url"
						style="width: 400px;"></input></td>
				</tr>
				<tr style="display:none">
					<td>操作：</td>
					<td><input type="text" id="operate" name="operate"
						style="width: 200px;"></input></td>
				</tr>
				<tr>
					<td>排序：</td>
					<td><input type="text" id="ord" name="ord"
						style="width: 50px;"></input></td>
				</tr>
				<tr>
					<td>是否展示菜单：</td>
					<td><input type="radio" value="1" name="display"
						checked="checked">是</input> <input type="radio" value="0"
						name="display">否</input></td>
				</tr>
				<tr>
					<td>显示图标的样式：</td>
					<td><input type="text" id="iconclass" name="iconclass"
						style="width: 300px;"></input></td>
				</tr>
				<tr>
					<td>是否记录日志：</td>
					<td><input type="radio" value="1" name="recordlog"
						checked="checked">是</input> <input type="radio" value="0"
						name="recordlog">否</input></td>
				</tr>
				<tr>
					<td>是否是目标地址：</td>
					<td><input type="radio" value="1" name="target"
						checked="checked">是</input> <input type="radio" value="0"
						name="target">否</input></td>
				</tr>
				<tr>
					<td>描述：</td>
					<td><input type="text" id="description" name="description"
						style="width: 400px;"></input></td>
				</tr>
				<tr>
					<td>关联角色：</td>
					<td>
						<ul id="roleTree"></ul>
					</td>
				</tr>
				<tr>
					<td></td>
					<td><input id='addBut' type="button" value="添加"
						onclick="getload()"></input></td>
				</tr>
			</table>
		</form>
	</div>
	<div id="showInfo" class='rigthClass'></div>
</body>
</html>
