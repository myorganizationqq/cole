<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>   
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
		            <div class="col-md-12">
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
		            
		            <!-- /.col (RIGHT) -->
		        </div>
		         <div class="row">
		            <div class="col-md-12">
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
		                        <div class="chart" id="container4"  ></div>
		                    </div>
		                    <!-- /.box-body -->
		                </div>
		
		            </div>
		            <!-- /.col (LEFT) -->
		            
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
		                        <div class="chart" id="container3"  ></div>
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
	<script src="${gloablContextPath}/resources/js/highcharts/highcharts.js?version=${projectVersion}"></script>
    <script src="${gloablContextPath}/resources/js/highcharts/modules/exporting.js?version=${projectVersion}"></script>
    <script src="${gloablContextPath}/resources/js/highcharts/modules/export-csv.js?version=${projectVersion}"></script>
    <script src="${gloablContextPath}/resources/js/slimScroll/jquery.slimscroll.min.js?version=${projectVersion}"></script>
    <script src="${gloablContextPath}/resources/js/lib/chartsutils.js?version=${projectVersion}"></script> 
<script type="text/javascript">
var UserList1={
		getData:function(chart,fun,param){		
			$.ajax({
	            type: "POST",
	            url: sGlobalUrlPrefix + '/test103/list',
	            data: param,
	            dataType: "json",
	            success: function (data) {
	                if (data.code == 0) {
	                	fun(chart,data); 
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
 
var begin = new Date(2017,1,14);
begin.setHours(17);
begin.setMinutes(0);
var end = new Date(2017,1,14);
end.setHours(18);
end.setMinutes(0);
function formattest(nextDate){
	return String(nextDate.getFullYear()) + "-" +
		((nextDate.getMonth() + 1) < 10 ? "0"  + (nextDate.getMonth() + 1) : String((nextDate.getMonth() + 1))) + "-" + 
		(nextDate.getDate() < 10 ? "0" + nextDate.getDate() : String(nextDate.getDate())) + " " +
		(nextDate.getHours() < 10 ? "0" + nextDate.getHours() : String(nextDate.getHours())) + ":" + 
		(nextDate.getMinutes() < 10 ? "0" + nextDate.getMinutes() : String(nextDate.getMinutes()))
		;
}
function testInterval(chart,status){ 
	begin.setMinutes(begin.getMinutes() + status);
	end.setMinutes(end.getMinutes() + status);
	var param ="startTime="+ formattest(begin)+"&endTime="+ formattest(end); 
	
	 UserList1.getData(chart,function(chart,data){
		 //var series =[];
		 //series.push({"name":"执行时间","data":data.data.series}); 
		  
		 var series =[{"name":"执行时间","data":data.data.series}];
		 var categories = data.data.categories;
		//类别不一致，仅进行数据填充
	     if (series!= null) {
	        $JSChartsUtilsExts.fillSeries(categories, series);
	     }
	      //格式化类别数据
	    if(categories != null){
	    	categories = $JSChartsUtilsExts.formatDate(categories);
	     }
		/*  
		chart.xAxis[0].categories.splice(0,chart.xAxis[0].categories.length);
		chart.xAxis[0].setCategories(data.data.categories);
	    chart.series[0].setData(data.data.series);  
		chart.redraw(false);  
		*/
		
	
		 chart.xAxis[0].setCategories(categories);
		 
		 chart.series[0].setData(series[0].data); 
		 setTimeout(function(){ 			testInterval(chart,1);        		},1*60*1000)
		 //chart.series[0].setName("执行时间");
	 },param);
	 
}

function init(){
	var options = {
			tooltip: {
		        formatter: function () {
		            if (this.point.isFill) {
		                return this.point.time + '<br>无数据';
		            } else {
		                return this.point.time
		                    + '<br>' + this.series.name + '</b>'
		                    + '<br>平均执行时间：<b>' + this.point.y + '</b>ms'
		                    + '<br>总请求数： <b>' + this.point.total + '%</b>'
		                    + '<br>最大： <b>' + this.point.max + '</b>ms'
		                    + '<br>最小：<b>' + this.point.min + '</b>ms<br>';
		            }
		        }
		    },
		    xAxis:{  
		    	 categories:[]  
		    },
		    series:[{name:"执行时间",data:[]}],
		    chart : {
				type: 'line',
		        marginRight: 10,
		        events:{
		        	load:function(){
		        		var c = this;
		        		testInterval(c,1);
		        		//setTimeout(function(){ 			testInterval(c,1);        		},3000)
		        		//setInterval(function(){ 			testInterval(c,1);        		},10000);
					}
		        }
		     }
	 };
	$JSChartsUtilsExts.drawLineChart("container", null, null, null, "ms", options); 	
}

init();

var begin1 = new Date(2017,1,14);
begin1.setHours(17);
begin1.setMinutes(0);
var end1 = new Date(2017,1,14);
end1.setHours(18);
end1.setMinutes(0);
var options1 = {
		tooltip: {
	        formatter: function () {
	            if (this.point.isFill) {
	                return this.point.time + '<br>无数据';
	            } else {
	                return this.point.time
	                    + '<br>' + this.series.name + '</b>'
	                    + '<br>平均执行时间：<b>' + this.point.y + '</b>ms'
	                    + '<br>总请求数： <b>' + this.point.total + '%</b>'
	                    + '<br>最大： <b>' + this.point.max + '</b>ms'
	                    + '<br>最小：<b>' + this.point.min + '</b>ms<br>';
	            }
	        }
	    },
        exporting: {
       	 filename: '数据4',
           enabled: true,
           url: sGlobalUrlPrefix+"/exporting"
       },
	    xAxis:{  
	    	 categories:[]  
	    },
	    series:[{name:"执行时间",data:[]}],
 };
var chattt = $JSChartsUtilsExts.drawLineChart("container4", null, null, null, "ms", options1); 

function dealttttt(status){
	begin1.setMinutes(begin1.getMinutes() + status);
	end1.setMinutes(end1.getMinutes() + status);
	var param1 ="startTime="+ formattest(begin1)+"&endTime="+ formattest(end1); 
	
	 UserList1.getData(chattt,function(chart,data){ 
		 var series =[{"name":"执行时间","data":data.data.series}];
		 var categories = data.data.categories;
		//类别不一致，仅进行数据填充
	     if (series!= null) {
	        $JSChartsUtilsExts.fillSeries(categories, series);
	     }
	      //格式化类别数据
	    if(categories != null){
	    	categories = $JSChartsUtilsExts.formatDate(categories);
	     }	
		 
		 chart.series[0].setData(series[0].data); 
		 chart.xAxis[0].setCategories(categories);
		 setTimeout(function(){ dealttttt(1); },1*60*1000)
	 },param1);
}
dealttttt(0);

var series2 =  [ {
    "id" : "1",
    "y" : 47,
    "name" : "HUAWEI"
  }, {
    "id" : "15",
    "y" : 47,
    "name" : "XIAOMI"
  }, {
    "id" : "10",
    "y" : 24,
    "name" : "OPPO"
  }, {
	    "id" : "10",
	    "y" : 24,
	    "name" : "什么呢"
	  }
  , {
	    "id" : "10",
	    "y" : 24,
	    "name" : "其它"
	  }
  , {
	    "id" : "10",
	    "y" : 24,
	    "name" : "OPPO"
	  }
  , {
	    "id" : "10",
	    "y" : 24,
	    "name" : "中国"
	  }
  , {
	    "id" : "10",
	    "y" : 24,
	    "name" : "MMAndroid3.30.1"
	  }
  , {
	    "id" : "10",
	    "y" : 24,
	    "name" : "俄罗斯"
	  }
  , {
	    "id" : "10",
	    "y" : 24,
	    "name" : "广州"
	  }
  , {
	    "id" : "10",
	    "y" : 24,
	    "name" : "广东"
	  }
  , {
	    "id" : "10",
	    "y" : 24,
	    "name" : "深圳"
	  }
  , {
	    "id" : "10",
	    "y" : 24,
	    "name" : "天河"
	  }
  , {
	    "id" : "10",
	    "y" : 24,
	    "name" : "什么什么嘛"
	  }
  , {
	    "id" : "10",
	    "y" : 24,
	    "name" : "很多很多很多"
	  }
  , {
	    "id" : "10",
	    "y" : 24,
	    "name" : "思考的方式发生地方"
	  }
  , {
	    "id" : "10",
	    "y" : 24,
	    "name" : "速度放缓拉多斯拉夫"
	  }
  , {
	    "id" : "10",
	    "y" : 24,
	    "name" : "的是否会考上的裂缝"
	  }
  ]; 
$("#container2").highcharts({
    chart: {
        type: 'pie',
        backgroundColor: '#fff'
    },
    title: {
    	 text: "",
        verticalAlign: 'middle',
        y: 5,
        useHTML: true,
        fontFamily: "微软雅黑",
        style: {"fontSize": "16px"}
    },
    credits: {
        enabled: false
    },
    exporting: {
    	 filename: '数据2',
        enabled: true,
        url: sGlobalUrlPrefix+"/exporting"
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enable: true,
                formatter: function () {
                    return this.point.name + "<br/>" + this.percentage.toFixed(2) + "%";
                }
            },
            allowPointSelect: true,
            cursor: 'pointer',
            showInLegend: true
        },
        series: {
            states: {
                hover: {
                    enabled: false
                }
            }
        }
    },
    tooltip: {
        enabled: true,
        shadow: false,
        pointFormatter: function (p) {
            return "<br/>" + this.percentage.toFixed(2) + "%<br>"+this.y;
        }
    },
    legend: {
        borderWidth: 0,
        align: 'left',
        verticalAlign: 'top',
        layout: 'vertical'
    },
    series: [{
    	type:"pie",
    	name:"",
    	data:series2
    }]
});

 
var series3 =  [ {
    "id" : "1",
    "y" : 47,
    "name" : "HUAWEI"
  }, {
    "id" : "15",
    "y" : 47,
    "name" : "XIAOMI"
  }, {
    "id" : "10",
    "y" : 24,
    "name" : "OPPO"
  }];
$("#container3").highcharts({
    chart: {
        type: 'pie',
        backgroundColor: '#fff'
    },
    title: {
        text: "",
        verticalAlign: 'middle',
        y: 5,
        useHTML: true,
        fontFamily: "微软雅黑",
        style: {"fontSize": "16px"}
    },
    credits: {
        enabled: false
    },
    exporting: {
    	 filename: '数据3',
        enabled: true,
        url: sGlobalUrlPrefix+"/exporting"
    },
    plotOptions: {
        pie: {
            size: 250,
            innerSize: 160,
            dataLabels: {
                distance: 30,
                enable: true,
                formatter: function () {
                    return this.point.name + "<br/>" + this.percentage.toFixed(2) + "%";
                }
            },
            allowPointSelect: true,
            cursor: 'pointer',
            showInLegend: true
        },
        series: {
            states: {
                hover: {
                    enabled: false
                }
            }
        }
    },
    tooltip: {
        enabled: true,
        shadow: false,
        pointFormatter: function (p) {
            return "<br/>" + this.percentage.toFixed(2) + "%";
        }
    },
    legend: {
        borderWidth: 0,
        align: 'left',
        verticalAlign: 'top',
        layout: 'vertical'
    },
    series: [{
    	type:"pie",
    	name:"",
    	data:series3
    }]
});

</script>
</body>
</html>
