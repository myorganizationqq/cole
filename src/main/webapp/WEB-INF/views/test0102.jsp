<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>  
 	<script src="${gloablContextPath}/resources/js/highcharts/highcharts.js?version=${projectVersion}"></script>
    <script src="${gloablContextPath}/resources/js/highcharts/modules/exporting.js?version=${projectVersion}"></script>
    <script src="${gloablContextPath}/resources/js/highcharts/modules/highcharts-zh_CN.js?version=${projectVersion}"></script>
    <script src="${gloablContextPath}/resources/js/slimScroll/jquery.slimscroll.min.js?version=${projectVersion}"></script>
    <script src="${gloablContextPath}/resources/js/lib/highchartsUtils.js?version=${projectVersion}"></script> 
</head>
<body>    
        <div class="content-wrapper">
            <!-- Content Header (Page header) -->
            <section class="content-header">
                <h1>服务器性能监控
                </h1>
                <ol class="breadcrumb">
                    <li><a href="#"><i class="fa fa-bar-chart-o"></i>数据分析</a></li>
                    <li class="active">服务器性能监控</li>
                </ol>
            </section>
            <!-- Main content -->
            <section class="content">
               <div class="row">
		            <div class="col-md-6">
		                <!-- AREA CHART -->
		                <div class="box box-primary">
		                    <div class="box-header with-border">
		                        <h3 class="box-title">Area Chart</h3>
		
		                        <div class="box-tools pull-right">
		                            <button type="button" class="btn btn-box-tool" data-widget="collapse">
		                                <i class="fa fa-minus"></i>
		                            </button>
		                            <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
		                        </div>
		                    </div>
		                    <div class="box-body chart-responsive">
		                        <div class="chart" id="container"  ></div>
		                    </div>
		                    <!-- /.box-body -->
		                </div>
		
		            </div>
		            <!-- /.col (LEFT) -->
		            <div class="col-md-6">
		                <!-- LINE CHART -->
		                <div class="box box-info">
		                    <div class="box-header with-border">
		                        <h3 class="box-title">Line Chart</h3>
		
		                        <div class="box-tools pull-right">
		                            <button type="button" class="btn btn-box-tool" data-widget="collapse">
		                                <i class="fa fa-minus"></i>
		                            </button>
		                            <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
		                        </div>
		                    </div>
		                    <div class="box-body chart-responsive">
		                        <div class="chart" id="container1"  ></div>
		                    </div>
		                    <!-- /.box-body -->
		                </div>
		                <!-- /.box -->
		            </div>
		            <!-- /.col (RIGHT) -->
		        </div>
		        <!-- /.row -->
		         <div class="row">
		            <div class="col-md-6">
		                <!-- AREA CHART -->
		                <div class="box box-primary">
		                    <div class="box-header with-border">
		                        <h3 class="box-title">Area Chart</h3>
		
		                        <div class="box-tools pull-right">
		                            <button type="button" class="btn btn-box-tool" data-widget="collapse">
		                                <i class="fa fa-minus"></i>
		                            </button>
		                            <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
		                        </div>
		                    </div>
		                    <div class="box-body chart-responsive">
		                        <div class="chart" id="container2"  ></div>
		                    </div>
		                    <!-- /.box-body -->
		                </div>
		
		            </div>
		           
		            <!-- /.col (RIGHT) -->
		        </div>
		        <!-- /.row -->
            </section>
            <!-- /.content -->
        </div>
        <script type="text/javascript">

        $(function () {
            var options = {
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr',
                            'May'],
                    crosshair: true
                },
                yAxis: {
                    title: {
                        text: '（%）'
                    }
                },
                tooltip: {
                    formatter: function () {
                        return '<span style="font-size:10px">'
                                + this.x
                                + '</span><table>'
                                + '<tr><td style="color:'
                                + this.color
                                + ';padding:0">'
                                + this.series.name
                                + ': </td>'
                                + '<td style="padding:0"><b>'
                                + this.y
                                + '%</b></td></tr>'
                                + '<tr><td style="color:'
                                + this.color
                                + ';padding:0">请求数: </td>'
                                + '<td style="padding:0"><b>'
                                + this.point.data1
                                + '个</b></td></tr>'
                                + '</table>';
                    },
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: '可用性',
                    data: [{
                        data1: '10',
                        color: "#00ff00",
                        y: 49.9
                    }, {
                        data1: '20',
                        color: "#00ff00",
                        y: 71.5,

                    }, {
                        data1: '30',
                        color: "#00ff00",
                        y: 106.4,

                    }, {
                        data1: '40',
                        color: "#ff0000",
                        y: 129.2,

                    }, {
                        data1: '50',
                        color: "#0000ff",
                        y: 144.0,

                    }]

                }],
                event: {
                    //drilldown: function (e) {

                    //}
                },
                title: {
                    useHTML: true,
                    align: "right",
                    style: {
                        color: "#006cee",
                        fontsize: "12px"
                    },
                    text: '<a class="btnNormal01 fn_bgGreen01 fn_bgGreen01b" >平均活跃设备数</a>'
                },
                subtitle: {
                    useHTML: true,
                    align: "left",
                    x: 80,
                    y: 20,
                    floating: true,
                    style: { color: "#006cee" },
                    text: '<a class="btnNormal01 fn_bgGreen01 fn_bgGreen01b" >返回</a>'
                }
            };
            var test001 = chartsUtils.getOptions(options);
            $('#container').highcharts(test001);

            $('#container1').highcharts(
                               {
                                   lang: {
                                       loading: '正在加载',
                                       drillUpText: '返回'
                                   },
                                   title: {
                                       text: '可用性分析曲线图'
                                   },
                                   subtitle: {
                                       text: ''
                                   },
                                   xAxis: {
                                       categories: ['Jan', 'Feb', 'Mar', 'Apr',
                                               'May'],
                                       crosshair: true
                                   },
                                   yAxis: {
                                       min: 0,
                                       title: {
                                           text: '可用性（%）'
                                       }
                                   },
                                   tooltip: {
                                       formatter: function () {
                                           return '<span style="font-size:10px">'
                                                   + this.x
                                                   + '</span><table>'
                                                   + '<tr><td style="color:'
                                                   + this.color
                                                   + ';padding:0">'
                                                   + this.series.name
                                                   + ': </td>'
                                                   + '<td style="padding:0"><b>'
                                                   + this.y
                                                   + '%</b></td></tr>'
                                                   + '<tr><td style="color:'
                                                   + this.color
                                                   + ';padding:0">请求数: </td>'
                                                   + '<td style="padding:0"><b>'
                                                   + this.point.data1
                                                   + '个</b></td></tr>'
                                                   + '</table>';
                                       },
                                       useHTML: true
                                   },
                                   plotOptions: {
                                       column: {
                                           pointPadding: 0.2,
                                           borderWidth: 0
                                       }
                                   },
                                   series: [{
                                       name: '可用性',
                                       data: [{
                                           data1: '10',
                                           color: "#00ff00",
                                           y: 49.9
                                       }, {
                                           data1: '20',
                                           color: "#00ff00",
                                           y: 71.5,

                                       }, {
                                           data1: '30',
                                           color: "#00ff00",
                                           y: 106.4,

                                       }, {
                                           data1: '40',
                                           color: "#ff0000",
                                           y: 129.2,

                                       }, {
                                           data1: '50',
                                           color: "#0000ff",
                                           y: 144.0,

                                       }]

                                   }],
                                   credits: {
                                       enabled: true
                                   },
                                   exporting: {
                                       enabled: false,
                                       url: 'www.baidu.com'
                                   }
                               });
            $('#container2').highcharts(
                            {

                                title: {
                                    text: '可用性分析曲线图'
                                },
                                subtitle: {
                                    text: ''
                                },
                                xAxis: {
                                    categories: ['Jan', 'Feb', 'Mar', 'Apr',
                                            'May'],
                                    crosshair: true
                                },
                                yAxis: {
                                    min: 0,
                                    title: {
                                        text: '可用性（%）'
                                    }
                                },
                                tooltip: {
                                    formatter: function () {
                                        return '<span style="font-size:10px">'
                                                + this.x
                                                + '</span><table>'
                                                + '<tr><td style="color:'
                                                + this.color
                                                + ';padding:0">'
                                                + this.series.name
                                                + ': </td>'
                                                + '<td style="padding:0"><b>'
                                                + this.y
                                                + '%</b></td></tr>'
                                                + '<tr><td style="color:'
                                                + this.color
                                                + ';padding:0">请求数: </td>'
                                                + '<td style="padding:0"><b>'
                                                + this.point.data1
                                                + '个</b></td></tr>'
                                                + '</table>';
                                    },
                                    useHTML: true
                                },
                                plotOptions: {
                                    column: {
                                        pointPadding: 0.2,
                                        borderWidth: 0
                                    }
                                },
                                series: [{
                                    name: '可用性',
                                    data: [{
                                        data1: '10',
                                        color: "#00ff00",
                                        y: 49.9
                                    }, {
                                        data1: '20',
                                        color: "#00ff00",
                                        y: 71.5,

                                    }, {
                                        data1: '30',
                                        color: "#00ff00",
                                        y: 106.4,

                                    }, {
                                        data1: '40',
                                        color: "#ff0000",
                                        y: 129.2,

                                    }, {
                                        data1: '50',
                                        color: "#0000ff",
                                        y: 144.0,

                                    }]

                                }],
                                credits: {
                                    enabled: false
                                },
                                exporting: {
                                    enabled: true,
                                    url: 'www.baidu.com'
                                }
                            });
        });
    </script>
</body>
</html>
