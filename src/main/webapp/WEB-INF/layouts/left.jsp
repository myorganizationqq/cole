<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
  		<!-- Left side column. contains the sidebar -->
        <aside class="main-sidebar">
            <!-- sidebar: style can be found in sidebar.less -->
            <section class="sidebar"> 
                <!-- sidebar menu: : style can be found in sidebar.less -->
                <ul class="sidebar-menu">  
				    <c:forEach items="${menu_list}" var="menu" varStatus="status">
				        <!-- 一级子菜单没有parentId,有url -->
				        <c:if test="${menu.parentid==0 and  menu.display==1 and menu.target==1}">			        
						<li class="treeview">	
				            <a href="<c:url value='${menu.url }' />"  menu-data-url="${menu.resid}">
				                <i class="${menu.iconclass }"></i><span>${menu.name }</span>
				            </a>
				        </li>
				    	</c:if>
				    <!-- 可展开的一级菜单，没有parentId,有url -->
				    <c:if test="${menu.parentid==0 and  menu.display==1 and menu.target==0}">
				        <li class="treeview">
				            <a href="#" menu-data-url="${menu.resid}" >
				                <i class="${menu.iconclass }"></i><span>${menu.name }</span>
				                <span class="pull-right-container">
				                 <i class="fa fa-angle-left pull-right"></i>
				                </span>
				            </a>
				            <ul class="treeview-menu">
				                <!-- 没有url的是三级菜单，有url的直接输出到li中 -->
				                <c:forEach items="${menu.childrens}" var="secondChild" varStatus="status">
				                    <c:if test="${secondChild.display==1 and secondChild.target==1}">
								        <li>
								            <a href="<c:url value='${secondChild.url }'/>" menu-data-url="${secondChild.resid}" >
								               <i class="${secondChild.iconclass }"></i>${secondChild.name }
								            </a>
								        </li>
								    </c:if>
				                    <!-- 二级菜单url为空，表示还有三级菜单 -->
				                    <c:if test="${secondChild.display==1 and secondChild.target==0}">
				                        <li>
				                            <a href="#" menu-data-url="${secondChild.resid}">
								                <i class="${secondChild.iconclass }"></i><span>${secondChild.name }</span>
								                <span class="pull-right-container">
								                 <i class="fa fa-angle-left pull-right"></i>
								                </span>
								            </a>
				                             <ul class="treeview-menu">
				                                 <c:forEach items="${secondChild.childrens}" var="thirdChild" varStatus="status">
				                                  <c:if test="${thirdChild.display==1}">
					                                   <li>
												            <a href="<c:url value='${thirdChild.url }'/>" menu-data-url="${thirdChild.resid}">
												               <i class="${thirdChild.iconclass }"></i>${thirdChild.name }
												            </a>
												        </li>
												   </c:if>
				                                 </c:forEach>
				                            </ul>
				                        </li>
				                    </c:if>
				                </c:forEach>
				            </ul>
				        </li>
				    </c:if>
				</c:forEach>	 
            </section>
            <!-- /.sidebar -->
        </aside>
<script type="text/javascript">
$(function(){ 
	  //菜单选中状态
	  var sGlobalCurrentPath = "";
	    <%
	    if (request.getAttribute("current_url") != null ) {     
	    %>
	    	sGlobalCurrentPath="<%=request.getAttribute("current_url")%>";
	    <%
	    }
	    %> 
	  var selectedMenuObject= $("a[menu-data-url='"+ sGlobalCurrentPath + "']"); 
	  if(selectedMenuObject && selectedMenuObject.length>0) {     
            var test = selectedMenuObject.parent("li");
            if (test && test.length > 0) test.addClass("active");
            var ul = selectedMenuObject.parents(".treeview-menu");
            if (ul && ul.length > 0) ul.addClass("menu-open").show();

            var li = selectedMenuObject.parents(".treeview");
            if (li && li.length > 0) li.addClass("active");
       }
});
</script>