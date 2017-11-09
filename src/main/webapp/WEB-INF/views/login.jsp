<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="com.cole.web.security.CsrfTokenManager" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>登录</title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <!-- Bootstrap 3.3.6 -->
    <link rel="stylesheet" href="${gloablContextPath}/resources/css/bootstrap.min.css?version=${projectVersion}">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="${gloablContextPath}/resources/css/font-awesome.min.css?version=${projectVersion}">
    <!-- Ionicons -->
    <link rel="stylesheet" href="${gloablContextPath}/resources/css/ionicons.min.css?version=${projectVersion}">
    <!-- Theme style -->
    <link rel="stylesheet" href="${gloablContextPath}/resources/css/AdminLTE.min.css?version=${projectVersion}">
    <!-- iCheck -->
    <link rel="stylesheet" href="${gloablContextPath}/resources/js/icheck/square/blue.css?version=${projectVersion}">
    <!--[if lt IE 9]>
  	<script src="${gloablContextPath}/resources/js/ie/html5shiv.min.js?version=${projectVersion}"></script>
  	<script src="${gloablContextPath}/resources/js/ie/respond.min.js?version=${projectVersion}"></script>
  	<![endif]-->
</head>
<body class="hold-transition login-page">
    <div class="login-box">
        <div class="login-box-body">
            <p class="login-box-msg">${errormsg}</p>
            <form action="${gloablContextPath}/login" method="post">
                <div class="form-group has-feedback">
                    <input type="text" name="username"  class="form-control" placeholder="用户名">
                    <span class="glyphicon glyphicon-user form-control-feedback"></span>
                </div>
                <div class="form-group has-feedback">
                    <input type="password" name="password" class="form-control" placeholder="密码">
                    <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                </div>
                <div class="row">
                    <div class="col-xs-8">
                    	<input type="text" name="captchImg"  class="form-control" placeholder="验证码"/>
                    </div>
                    <div class="col-xs-4">
						<img id="verifyCodeImage" onclick="reloadVerifyCode()"	src="${gloablContextPath}/captcher" />	
					</div>
                </div>	
                <div class="row">
                    <div class="col-xs-8">
                        <div class="checkbox icheck">
                            <label>
                                <input type="checkbox"> 记住我           
                            </label>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <button type="submit" class="btn btn-primary btn-block btn-flat">登录</button>
                    </div>
                </div>
                 <input type="hidden" name="<%=CsrfTokenManager.CSRF_PARAM_NAME %>"
           value="<%=CsrfTokenManager.createTokenForSession(session) %>"/>
            </form>
        </div>
    </div>
    <script src="${gloablContextPath}/resources/js/jquery/jquery-2.2.3.min.js?version=${projectVersion}"></script>
    <script src="${gloablContextPath}/resources/js/bootstrap/bootstrap.min.js?version=${projectVersion}"></script>
    <script src="${gloablContextPath}/resources/js/icheck/icheck.min.js?version=${projectVersion}"></script>
    <script>
        $(function () {
            $('input').iCheck({
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue',
                increaseArea: '20%' // optional
            });
        });
</script>
</body>
</html>