<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
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
    <!--[if lt IE 9]>
  	<script src="${gloablContextPath}/resources/js/ie/html5shiv.min.js?version=${projectVersion}"></script>
  	<script src="${gloablContextPath}/resources/js/ie/respond.min.js?version=${projectVersion}"></script>
  	<![endif]-->
   	<script src="${gloablContextPath}/resources/js/jquery/jquery-2.2.3.min.js?version=${projectVersion}"></script>
    <script src="${gloablContextPath}/resources/js/bootstrap/bootstrap.min.js?version=${projectVersion}"></script>
</head>
<body class="hold-transition skin-blue sidebar-mini">
   <section class="content">
      <div class="error-page">
          <br />
          <br />
          <br />
        <h2 class="headline text-red">错误</h2>
        <div class="error-content">
          <p>  
            <h4>${msg}</h4>
          </p>
        </div>
      </div>
    </section>
</body>
</html>