function delstart(s, r) {
    var n = s;
    var f = true;

    for (var i = 0; i < s.length; i++) {
        if (s[i] == r && f == true) {
            if (i + 1 <= s.length - 1)
                n = n.substr(i + 1, s.length - 1);
        } else {
            f = false;
        }
    }
    return n;
}

/**
 * 图形处理方法
 */
var $JSChartsUtilsExts ={
		customCallbackInfo:{},
		/**
		 * 默认选项
		 */
		defaultLineOptions:function(){
			return {
				chart:{
	        		//type:"area",
	        		zoomType:"x"
	        	},
		        lang: {
		            loading: '正在加载',
		            drillUpText: '返回'
		        },
		        subtitle:{
		            title:  null
		        },
		        credits: {//不启用版权
		            enabled: false
		        },
		        exporting: {//不启用导出
		            enabled: false,
		            url: ''
		        },
		        title: {
		            align: 'center',
		            style: 'fontSize:12px'
		        },
		        legend: {
		            enabled: true,
		            align: 'center',
		            borderWidth: 0
		        },
		        xAxis: {
		            title: {
		                enabled: false
		            },
		            tickmarkPlacement: 'on',
		            labels: {
		                rotation: -60
		            }
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                align: 'high',
		                offset: 0,
		                rotation: 0,
		                y: -20
		            },
		            lineWidth: 1,
		            plotLines: [{
		                value: 0,
		                width: 1,
		                color: '#808080'
		            }]
		        },
		        legend : {
			            enabled: true,
			            itemStyle: {
			                "white-space": "nowrap",
			                "overflow": "hidden",
			                "text-overflow": "ellipsis",
			                "max-width": "100px"
			            },
			            useHTML: true,
			            labelFormat: '<span title="{name}">{name}</span>'
			   }
		    };
		},
		 
	    /**
	     * 增加点击节点事件[跳转还是钻取]
	     * @returns options
	     */
	    clickNodeEvent:function(){
	    	 var selectOption ={ 
	    			 plotOptions:{
		                 series: {
		                     cursor: 'pointer',
		                     point: {
		                         events: {
		                             click: function (event) {
		                            	 //待增加点击节点事件[跳转还是钻取]
		                             }
		                         }
		                     }
		                 }
	               }
	    	 	};
	    	return selectOption;
	    },
	    /**
	     * 增加区域选择钻取
	     * @returns options
	     */
	    selectAreaEvent:function(){
	    	 var selectOption={
	    			 chart: {
		                 events: {
		                     selection: function (event) {
		                    	 ////待增加区域选择钻取
		                     }
		                 }, 
		                 zoomType: 'x'
	    			 }
	    	 	}; 
	    	 return selectOption;
	    }, 
	    
	    /**
	     *
	     * @param div 图像div位置
	     * @param callback 执行函数
	     * @param params 参数
	     * @param time 时间配置
	     * @param options 原有hightchart配置
	     * @param isUseDefaultClick 是否使用默认的点击事件
	     * @param isUseSelectEvent 是否使用默认的选择事件
	     * @returns
	     */
	    getOptions: function (div, callback, params, time, options, isUseDefaultClick,isUseSelectEvent) {

	    	$JSChartsUtilsExts.customCallbackInfo[div] = {
	            "callback": callback,
	            "params": params,
	            "time": time
	        };
	    	var selectOption = $.extend(true, $JSChartsUtilsExts.defaultLineOptions(), options || {});
	    	
	    	if(isUseDefaultClick) 
	    		selectOption = $.extend(true, selectOption, $JSChartsUtilsExts.clickNodeEvent() || {});
	    	
	    	if(isUseSelectEvent) 
	    		selectOption = $.extend(true, selectOption, $JSChartsUtilsExts.selectAreaEvent() || {});
	    	
	        return selectOption;
	    },
	    
	    /**
	     * 对曲线图的series数据进行填0补充
	     * <pre>
	     *     补充原理：
	     *      series 中的 data 项，必须要包含一个“time”和用于展示数据值的“y”属性，
	     *      “time”表示该数据点所对应的时间点。
	     *      遍历 series 中的 data 中的“time”项，并与 categories 对比，在 data 中补充数据，
	     *      使其具有与 categories 相同个数的数据。
	     *
	     *    补充数据规则：
	     *        在 data 中 添加数据：“y”属性为0，“time”为所缺少的时间点，
	     *        并添加一个“isFill”属性，为true，以示区别已有数据。
	     * </pre>
	     * @param categories categories
	     * @param series series 其中的 data 必需按 time 升序排列
	     * @returns {*} 填充数据后的 series
	     */
	    fillSeries: function (categories, series) {
	        for (var i = 0; i < series.length; i++) {
	            series[i]["data"] = $JSChartsUtilsExts.fillData(categories, series[i]["data"]);
	        }
	    },
	   
	    /**
	     * 对曲线图的series数据进行填0补充
	     * <pre>
	     *     补充原理：
	     *      series 中的 data 项，必须要包含一个“time”和用于展示数据值的“y”属性，
	     *      “time”表示该数据点所对应的时间点。
	     *      遍历 series 中的 data 中的“time”项，并与 categories 对比，在 data 中补充数据，
	     *      使其具有与 categories 相同个数的数据。
	     *
	     *    补充数据规则：
	     *        在 data 中 添加数据：“y”属性为0，“time”为所缺少的时间点，
	     *        并添加一个“isFill”属性，为true，以示区别已有数据。
	     * </pre>
	     * @param categories categories
	     * @param data series 中的 data 必需按 time 升序排列
	     * @returns {*} 填充数据后的 data
	     */
	    fillData: function (categories, data) {
	        if (!categories)
	            return data;

	        /*
	        if (data == null || data.length == 0)
	            return [];
			*/
	        
	        var cDate = null, dataIndex = 0;

	        var newData = new Array(categories.length);
	        for (var i = 0; i < categories.length; i++) {
	            cDate = categories[i];

	            if (data && dataIndex < data.length && cDate === data[dataIndex].time) {
	                newData[i] = data[dataIndex];
	                dataIndex++;
	            } else {
	                newData[i] = {
	                    y: 0,
	                    time: cDate,
	                    isFill: true
	                }
	            }
	        }
	        return newData;
	    },
	  
	    formatDate: function (categories, srcFormat) {
	        if (!srcFormat) {
	            srcFormat = "yyyy-MM-dd hh:mm:ss";
	        }
	        if (categories == null || categories.length < 1)
	            return categories;

	        var startTime = categories[0];
	        var endTime = categories[categories.length - 1];

	        if (startTime == null || endTime == null || startTime == endTime)
	            return categories;

	        startTime = $JSChartsUtilsExts.todate(startTime, srcFormat);
	        endTime = $JSChartsUtilsExts.todate(endTime, srcFormat);
	        var toFormat = srcFormat;
	        var intval = endTime.getTime() - startTime.getTime();

	        if (intval > 1000 * 60 * 60 * 24 * 2) {//2天
	            toFormat = "yyyy-MM-dd";
	        } else {
	            toFormat = "hh:mm";
	            if (categories.length >= 2) {
	                var d1 = $JSChartsUtilsExts.todate(categories[0], srcFormat);
	                var d2 = $JSChartsUtilsExts.todate(categories[1], srcFormat);

	                if ($JSChartsUtilsExts.dateformat(d1, toFormat) == $JSChartsUtilsExts.dateformat(d2, toFormat)) {
	                    toFormat = "yyyy-MM-dd";
	                }
	            }
	        }

	        if (categories != null) {
	            var d = null;
	            var newDatas = new Array(categories.length);
	            for (var i = 0; i < categories.length; i++) {
	                d = $JSChartsUtilsExts.todate(categories[i], srcFormat);
	                newDatas[i] = $JSChartsUtilsExts.dateformat(d, toFormat);
	            }
	            return newDatas;
	        }

	        return categories;
	    },
	    
	    dateformat: function (date, format) {
	        if (format == null) {
	            format = "yyyy-MM-dd hh:mm:ss";
	        }
	        var o = {
	            "M+": date.getMonth() + 1,
	            "d+": date.getDate(),
	            "h+": date.getHours(),
	            "m+": date.getMinutes(),
	            "s+": date.getSeconds(),
	            "q+": Math.floor((date.getMonth() + 3) / 3),
	            "S": date.getMilliseconds()
	        };
	        if (/(y+)/.test(format)) {
	            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	        }

	        for (var k in o) {
	            if (new RegExp("(" + k + ")").test(format))
	                format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	        }

	        return format;
	    },
	    
	    todate: function (str, format) {
	        if (format == null)
	            format = "yyyy-MM-dd hh:mm:ss";

	        var o = {"y": "", "M": "", "d": "", "h": "", "m": "", "s": ""};
	        str += "";
	        for (var s = 0; s < format.length; s++) {
	            o[format[s]] = o[format[s]] + str[s];
	        } 
	        var y = 0;
	        var m = 0;
	        var d = 0;
	        var h = 0;
	        var mi = 0;
	        var s = 0;

	        if (o['y'] != "") {
	            y = parseInt(delstart(o['y'], "0"))
	        }
	        if (o['M'] != "") {
	            m = parseInt(delstart(o['M'], "0")) - 1
	        }
	        if (o['d'] != "") {
	            d = parseInt(delstart(o['d'], "0"))
	        }
	        if (o['h'] != "") {
	            h = parseInt(delstart(o['h'], "0"))
	        }
	        if (o['m'] != "") {
	            mi = parseInt(delstart(o['m'], "0"))
	        }
	        if (o['s'] != "") {
	            s = parseInt(delstart(o['s'], "0"))
	        }

	        return new Date(y, m, d, h, mi, s);
	    },
	   
	    /**
	     * 绘制曲线图
	     * @param selector jquery 选择器
	     * @param title 标题，若不需要，请传 null
	     * @param categories  categories X轴数组
	     * @param series series Y 值数组
	     * @param unit Y值单位（方法中会添加中文括号）
	     * @param option  highcharts 其它配置
	     * @returns {jQuery} highcharts 对象
	     */
	    drawLineChart: function (elementid, title, categories, series, unit,options) {  
	    	//类别不一致，仅进行数据填充
	        if (series != null) {
	        	$JSChartsUtilsExts.fillSeries(categories, series);
	        }
	        //格式化类别数据
	        if(categories != null){
	        	categories = $JSChartsUtilsExts.formatDate(categories);
	        }
	        //图形主标题
	        var titleOption = null;
	        if (title == null) {
	            titleOption = {y: -30};
	        } else {
	            titleOption = {text: title};
	        } 
	        //y轴文字
	        var ytitleOption = null;
	        if (unit == null) {
	        	ytitleOption = "";
	        } else {
	        	ytitleOption = "（" + unit + "）";
	        } 
	        var defaultOption =  {	        	
		            title: titleOption,
		            xAxis: {
		                categories: categories
		            },
		            yAxis: {
		                title: {
		                    text: ytitleOption
		                }
		            },
		            series: series
		        };
	        var selectOption = $.extend(true, $JSChartsUtilsExts.defaultLineOptions(), defaultOption);
	        selectOption = $.extend(true, selectOption, options || {});

	        return new Highcharts.Chart(elementid,selectOption);
	    },	 
	    /**
	     * 绘制饼状图
	     * @param selector jquery 选择器
	     * @param title 标题，若不需要，请传 null
	     * @param series series 值数组
	     * @param tooltip tooltip 数据点提示配置
	     * @param option  highcharts 其它配置
	     * @returns {jQuery} highcharts 对象
	     */
	    drawPieChart: function (elementid, title, series, tooltip, option) {

	        var defaultOption = $.extend(true, {
	            title: {
	                text: title || '   '
	            },
	            credits: {
	                enabled: false
	            },
	            chart: {
	                type: 'pie',
	                events: {
	                    load: function (chart) {
	                        var items = this.legend.allItems;
	                        for (var i = 0; i < items.length; i++) {
	                            if (items[i].name && items[i].name.length > 16) {
	                                this.legend.destroy();
	                            }
	                        }
	                    }
	                }
	            },
	            legend: {
	                layout: 'vertical',
	                align: 'left',
	                verticalAlign: 'middle',
	                floating: true,
	                y: -90
	            },
	            plotOptions: {
	                pie: {
	                    size: '75%',
	                    allowPointSelect: true,
	                    cursor: 'pointer',
	                    dataLabels: {
	                        enabled: true
	                    },
	                    showInLegend: true
	                }
	            },
	            tooltip: tooltip,
	            series: [{
	            	type:"pie",
	            	name:"",
	            	data:series
	            }]
	        }, option || {});

	        return new Highcharts.Chart(elementid,defaultOption);
	    }

}