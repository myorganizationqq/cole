<%@page import="com.cole.web.security.CsrfTokenManager" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="sitemesh" uri="http://www.opensymphony.com/sitemesh/decorator" %>
<!-- page isELIgnored="false" -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>主页</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <!-- Bootstrap 3.3.6 -->
    <link rel="stylesheet" href="${gloablContextPath}/resources/css/bootstrap.min.css?version=${projectVersion}">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="${gloablContextPath}/resources/css/font-awesome.min.css?version=${projectVersion}">
    <!-- Ionicons -->
    <link rel="stylesheet" href="${gloablContextPath}/resources/css/ionicons.min.css?version=${projectVersion}">
    <!-- Theme style -->
    <link rel="stylesheet" href="${gloablContextPath}/resources/css/AdminLTE.min.css?version=${projectVersion}">
    <!-- AdminLTE Skins. Choose a skin from the css/skins
       folder instead of downloading all of them to reduce the load. -->
    <link rel="stylesheet" href="${gloablContextPath}/resources/css/skins/_all-skins.min.css?version=${projectVersion}">
    <!--[if lt IE 9]>
 	 <script src="${gloablContextPath}/resources/js/ie/html5shiv.min.js?version=${projectVersion}"></script>
  	 <script src="${gloablContextPath}/resources/js/ie/respond.min.js?version=${projectVersion}"></script>
  	<![endif]-->
   	<script src="${gloablContextPath}/resources/js/jquery/jquery-2.2.3.min.js?version=${projectVersion}"></script>
    <script src="${gloablContextPath}/resources/js/bootstrap/bootstrap.min.js?version=${projectVersion}"></script>
    <script src="${gloablContextPath}/resources/js/slimScroll/jquery.slimscroll.min.js?version=${projectVersion}"></script>
    <script src="${gloablContextPath}/resources/js/fastclick/fastclick.js?version=${projectVersion}"></script>
    <script src="${gloablContextPath}/resources/js/adminlte/app.min.js?version=${projectVersion}"></script>
    <script type="text/javascript">
    var sGlobalUrlPrefix = "${gloablContextPath}";   
    </script>    
    <script src="${gloablContextPath}/resources/js/lib/global.js?version=${projectVersion}"></script>
  <sitemesh:head/>
</head>
<body class="hold-transition skin-blue sidebar-mini">
 	<!-- Site wrapper -->
    <div class="wrapper">
    	<%@ include file="/WEB-INF/layouts/header.jsp" %> 
    	<%@ include file="/WEB-INF/layouts/left.jsp" %>
    	 <input type="hidden" id="<%=CsrfTokenManager.CSRF_PARAM_NAME %>"
               value="<%=CsrfTokenManager.createTokenForSession(session) %>"/>
        <sitemesh:body/> 
		<%@ include file="/WEB-INF/layouts/footer.jsp" %> 
  	</div>
    <!-- ./wrapper -->
</body>
</html>
