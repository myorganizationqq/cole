Highcharts.customedData = function () {
    this.isFilled = false;
    this.data = null;
};
Highcharts.customedData.prototype.setData = function (data) {
    this.isFilled = true;
    this.data = data;
};
Highcharts.customedData.prototype.setTitle = function (title) {
    this.title = title;
};

/**
 * 地区等级
 * @param datas
 * @param level
 */
function mapAreaData(datas, dataLabel, level, colors, nodata, descp) {

    if (datas == null) {
        return null;
    }

    if (!dataLabel || dataLabel == "") {
        dataLabel = "value";
    }

    var maxValue = 0;
    var minValue = -1;

    for (var i = 0; i < datas.length; i++) {
        if (datas[i][dataLabel] > maxValue) {
            maxValue = datas[i][dataLabel];
        }

        if (minValue == -1 && maxValue != 0) {
            minValue = maxValue;
        }

        if (datas[i][dataLabel] < minValue) {
            minValue = datas[i][dataLabel];
        }
    }

    var intval = maxValue - minValue;
    var dataClasses = [];
    if (intval == 0) {
        dataClasses.push({from: 0, to: maxValue, color: colors[0]});
        if (nodata != null) {
            dataClasses.push(nodata);
        }
        return dataClasses;
    }

    var from = minValue;
    var to = 0;
    var dataClasses = [];
    for (var i = 0; i < level.length; i++) {
        to = from + Math.ceil(intval * (level[i] / 10));
        if (to - from > 1) {
            var l = {color: colors[i], from: from, to: to};
            if (descp) {
                l["name"] = descp[i];
            }
            dataClasses.push(l);
            from = to;
        }
    }

    if (dataClasses.length == 0) {
        dataClasses.push({from: from, to: to, color: colors[0]});
    } else {
        var last = dataClasses[dataClasses.length - 1];
        delete last.to;
        dataClasses[dataClasses.length - 1] = last
    }

    dataClasses = dataClasses.reverse()

    if (nodata != null) {
        dataClasses.push(nodata);
    }

    return dataClasses;
}

/**
 * 判断显示series在Tips上
 * @param other
 */
function showOther(other) {
    if (other) {

        for (var i = 0; i < other.length; i++) {
            if (other[i]["otherLabel"] == "y") {
                return true;
            }
        }
    }
    return false;
}

function getSeriesData(series) {
    if (series) {
        for (var i = 0; i < series.length; i++) {
            if (series[i] && series[i].data && series[i].data.length > 0) {
                return series[i].data;
            }
        }
    }
    return null;
}

var ChartUtil = {
    ChartCache: {},
    customCallbackInfo: {},
    resetTopData: function (div) {

        var dateType = TimeUtil.getDateByType();
        if (dateType.enable == false) {
            alertMsg(dateType.msg);
            return;
        }

        var info = ChartUtil.customCallbackInfo[div];

        if (info) {
            var p = info["params"];

            if (!info.time) {
                info.time = {
                    startTimeName: "startTime",
                    endTimeName: "endTime",
                    dateTypeName: "dateType",
                    dateformat: "yyyy-MM-dd hh:mm"
                };
            }
            if (!info.time.dateformat) {
                info.time.dateformat = "yyyy-MM-dd hh:mm"
            }

            var start = dateType.startTime;
            var end = dateType.endTime;

            try {
                if (start && end) {
                    start = TimeUtil.dateformat(TimeUtil.todate(start, "yyyy-MM-dd hh:mm"), info.time.dateformat);
                    end = TimeUtil.dateformat(TimeUtil.todate(end, "yyyy-MM-dd hh:mm"), info.time.dateformat);
                }
            } catch (e) {
            }

            if (null != info && null != info.params) {
                // 兼容各图表数据查询时间区间 不在TimeUtil.getDateByType(); 方法定义的范围内情况
                if ("" === start || start != info.params.startTime) {
                    start = info.params.startTime;
                }
                if ("" === end || end != info.params.endTime) {
                    end = info.params.endTime;
                }
                // 兼容各图表数据查询时间格式为yyyy-MM-dd hh:mm:ss
                if (19 === info.time.dateformat.length) {
                    if (start && start.length === 16) {
                        start += ":00";
                    }
                    if (end && end.length === 16) {
                        end += ":00";
                    }
                }
            }

            var sName = info.time['startTimeName'];
            var eName = info.time['endTimeName'];
            var dName = info.time['dateTypeName'];

            var p0 = {};
            $.extend(p0, p || {});
            p0[sName] = start;
            p0[eName] = end;
            p0[dName] = dateType.type;
            ChartUtil.ChartCache[div] = p0;

            if (p != null) {
                info.callback(p0);
            } else {
                info.callback();
            }
            ChartUtil.ChartCache[div] = null;
        }
    },
    /**
     *
     * @param div 图像div位置
     * @param callback 执行函数
     * @param params 参数
     * @param time 时间配置
     * @param option 原有hightchart配置
     * @returns
     */
    addNextLayerToOption: function (div, callback, params, time, option, clickOnly) {

        ChartUtil.customCallbackInfo[div] = {
            "callback": callback,
            "params": params,
            "time": time
        };

        var plotOptions = {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (event) {
                                var datas = this.series.data;

                                if (datas && datas.length >= 2) {
                                    var cur = TimeUtil.todate(datas[this.index].c || datas[this.index].time);

                                    var s = datas[0].c || datas[0].time;
                                    var e = datas[1].c || datas[1].time;

                                    var intval = TimeUtil.getTimeIntVal(s, e);

                                    var end = null;
                                    if (intval == 0) {
                                        return;
                                    } else if (intval >= 1000 * 60 * 60 * 24) {
                                        end = TimeUtil.addDate(cur, 4, 1);
                                    } else if (intval >= 1000 * 60 * 60) {
                                        end = TimeUtil.addDate(cur, 3, 1);
                                    }

                                    if (end != null) {

                                        if (!time) {
                                            time = {
                                                startTimeName: "startTime",
                                                endTimeName: "endTime",
                                                dateTypeName: "dateType",
                                                dateformat: "yyyy-MM-dd hh:mm"
                                            };
                                        }
                                        if (!time.dateformat) {
                                            time.dateformat = "yyyy-MM-dd hh:mm"
                                        }

                                        var div = event.point.series.chart.renderTo.id;

                                        cur = TimeUtil.dateformat(cur, time.dateformat);
                                        end = TimeUtil.dateformat(end, time.dateformat);

                                        var sName = time['startTimeName'];
                                        var eName = time['endTimeName'];
                                        var dName = time['dateTypeName'];

                                        var p = {};
                                        p[sName] = cur;
                                        p[eName] = end;
                                        p[dName] = 0;

                                        ChartUtil.ChartCache[div] = p;

                                        if (params) {
                                            if (callback) {
                                                callback(params);
                                            }
                                        } else {
                                            if (callback) {
                                                callback();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            chart = {
                events: {
                    selection: function (event) {
                        if (!event.xAxis) {
                            return false;
                        }

                        var min = Math.round(event.xAxis[0].min);
                        var max = Math.ceil(event.xAxis[0].max);
                        if (!min || min < 0) {
                            min = 0;
                        }
                        var data = getSeriesData(this.series);
                        if (data == null) {
                            return false;
                        }
                        if (!max || max >= data.length) {
                            max = data.length - 1;

                        }
                        if (!data[min] || !data[max]) {
                            return false;
                        }
                        var startTime = data[min].c == undefined ? data[min].time : data[min].c;
                        var endTime = data[max].c == undefined ? data[max].time : data[max].c;

                        if (!time) {
                            time = {
                                startTimeName: "startTime",
                                endTimeName: "endTime",
                                dateTypeName: "dateType",
                                dateformat: "yyyy-MM-dd hh:mm"
                            };
                        }
                        if (!time.dateformat) {
                            time.dateformat = "yyyy-MM-dd hh:mm"
                        }
                        var s = TimeUtil.todate(startTime);
                        var e = TimeUtil.todate(endTime);

                        var intval = e.getTime() - s.getTime();
                        if (intval < 1000 * 60 * 60) {//分钟表不能再细了
                            return false;
                        }

                        startTime = TimeUtil.dateformat(TimeUtil.todate(startTime), time.dateformat);
                        endTime = TimeUtil.dateformat(TimeUtil.todate(endTime), time.dateformat);

                        var sName = time['startTimeName'];
                        var eName = time['endTimeName'];
                        var dName = time['dateTypeName'];

                        var p = {};
                        p[sName] = startTime;
                        p[eName] = endTime;
                        p[dName] = 0;

                        ChartUtil.ChartCache[this.renderTo.id] = p;

                        if (params) {
                            /*params[time.startTimeName] = startTime;
                             params[time.endTimeName] = endTime;
                             params[time.dateTypeName] = 0;*/
                            if (callback) {
                                callback(params);
                            }
                        } else {

                            if (callback) {
                                callback();
                            }
                        }
                        return false;
                    }
                }, zoomType: 'x'
            };

        var selectOption = {
            lang: {loading: "正在加载"}
        };
        selectOption.plotOptions = plotOptions;
        if (!clickOnly) selectOption.chart = chart;

        return $.extend(true, selectOption, option || {});
    },
    serverChartDefaultOption: {
        yAxis: {
            lineWidth: 0

        },
        tooltip: {
            shared: true,
            headerFormat: "<small>{point.point.c}</small><br/>",
            formatter: function (curChart) {
                var tv = this.points[0].point["c"] || this.point[0].time;
                if (this.x.length == 10) {
                    tv = this.x;
                } else {
                    tv = TimeUtil.dateformat(TimeUtil.todate(tv), "yyyy-MM-dd hh:mm");
                }

                var m = tv + '<br />';
                var u = "";
                if (curChart.options.valueSuffix != null) {
                    u = (curChart.options.valueSuffix);
                }
                for (var i = 0; i < this.points.length; i++) {
                    if (this.points[i].point['isFill'] && this.points[i].point['isFill'] == true) {
                        m += ('<span style="color:' + this.points[i].series.color + '">●</span>' + this.points[i].series.name + ':' + '无数据' + '<br />');
                    } else {
                        m += ('<span style="color:' + this.points[i].series.color + '">●</span>' + this.points[i].series.name + ':' + this.points[i].y + u + '<br />')
                    }

                }
                return m;

            },
            crosshairs: {width: 1.5, color: '#ff5544'}
        }
    },

    defaultNoDataTip: {noData: "统计时间内暂无数据"},
    getDefaultTooltip: function (unit, otherVal) {
        return {
            otherVal: otherVal,
            valueSuffix: unit,
            formatter: function (curChart) {
                //获取点的时间
                var tv = this.point["c"] || this.point.time;
                if (this.x.length == 10) {
                    tv = this.x;
                } else {
                    if (tv) {
                        tv = TimeUtil.dateformat(TimeUtil.todate(tv), "yyyy-MM-dd hh:mm");
                    }
                }

                if (showOther(curChart.options.otherVal)
                    || curChart.chart.series.length > 1) {//判断是否有多条曲线,并且单条线上要显示多个值

                    var descp = "";
                    var sn = this.point.series.name;
                    var other = null;
                    var v = null;

                    if (this.point["isFill"] && this.point["isFill"] == true) {
                        descp = "无数据";
                        if (curChart.options.otherVal != null) {
                            for (var i = 0; i < curChart.options.otherVal.length; i++) {
                                other = curChart.options.otherVal[i];

                                if (other["seriesAlaisName"]) {
                                    sn = other["seriesAlaisName"];
                                }
                            }
                        }
                    } else {
                        for (var i = 0; i < curChart.options.otherVal.length; i++) {
                            other = curChart.options.otherVal[i];

                            otherEq = other["seriesName"];
                            if (otherEq && otherEq != this.point.series.name) {
                                continue;
                            }

                            v = this.point[other["otherLabel"]];
                            if (other["seriesAlaisName"]) {
                                sn = other["seriesAlaisName"];
                            }
                            descp += other["otherName"]
                                + ":"
                                + (v == null || v == undefined || v == "undefined" ? "无数据" : v)
                                + other["otherUnit"]
                                + "<br />";
                        }
                    }

                    if (tv) {
                        descp = sn + "<br/>" + tv + "<br/>" + descp;
                    } else {
                        descp = sn + "<br/>" + descp;
                    }
                } else {
                    var val = this.y;
                    if (curChart.options.valueSuffix) {
                        val += (curChart.options.valueSuffix);
                    }

                    if (this.point["isFill"] && this.point["isFill"] == true) {
                        val = "无数据";
                    }

                    /*var descp = tv + '<br />'
                     + this.point.series.name + ':'
                     + val + '<br />';*/

                    var d = "";
                    var other = null;
                    var v = null;
                    var sn = this.point.series.name;
                    if (this.point["isFill"] && this.point["isFill"] == true) {
                        val = "无数据";
                        if (curChart.options.otherVal != null) {
                            for (var i = 0; i < curChart.options.otherVal.length; i++) {
                                other = curChart.options.otherVal[i];

                                if (other["seriesAlaisName"]) {
                                    sn = other["seriesAlaisName"];
                                }
                            }
                        }
                    } else if (curChart.options.otherVal
                        && curChart.options.otherVal.length > 0) {

                        for (var i = 0; i < curChart.options.otherVal.length; i++) {

                            other = curChart.options.otherVal[i];

                            if (other["seriesAlaisName"]) {
                                sn = other["seriesAlaisName"];
                            }

                            otherEq = other["seriesName"];
                            if (otherEq && otherEq != this.point.series.name) {
                                continue;
                            }
                            v = this.point[other["otherLabel"]];
                            d += other["otherName"]
                                + ":"
                                + (v == null || v == undefined || v == "undefined" ? "无数据" : v + other["otherUnit"])
                                + "<br />";
                        }
                    }

                    var descp = tv + '<br />'
                        + sn + ':' + val + "<br/>"
                        + d + '<br />';
                }

                return descp;
            }
        };
    },

    /**
     *用于动态图的逐层点击查询
     * @param div 图像div位置
     * @param commonDiv ajax chartDiv(用于取公共数据)
     * @param callback 执行函数
     * @param params 参数
     * @param time 时间配置
     * @param option 原有hightchart配置
     * @returns
     */
    addAsyncNextLayerToOption: function (div, commonDiv, callback, params, time, option) {
        ChartUtil.customCallbackInfo[div] = {
            "callback": callback,
            "params": params,
            "time": time
        };

        var selectOption = {
            lang: {loading: "正在加载"},
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (event) {
                                var datas = this.series.data;

                                if (datas && datas.length >= 2) {
                                    var cur = TimeUtil.todate(datas[this.index].c || datas[this.index].time);

                                    var s = datas[0].c || datas[0].time;
                                    var e = datas[1].c || datas[1].time;
                                    var intval = TimeUtil.getTimeIntVal(s, e);

                                    var end = null;
                                    if (intval == 0) {
                                        return;
                                    } else if (intval >= 1000 * 60 * 60 * 24) {
                                        end = TimeUtil.addDate(cur, 4, 1);
                                    } else if (intval >= 1000 * 60 * 60) {
                                        end = TimeUtil.addDate(cur, 3, 1);
                                    }

                                    if (end != null) {
                                        if (!time) {
                                            time = {
                                                startTimeName: "startTime",
                                                endTimeName: "endTime",
                                                dateTypeName: "dateType",
                                                dateformat: "yyyy-MM-dd hh:mm"
                                            };
                                        }
                                        if (!time.dateformat) {
                                            time.dateformat = "yyyy-MM-dd hh:mm"
                                        }

                                        var div = event.point.series.chart.renderTo.id;

                                        cur = TimeUtil.dateformat(cur, time.dateformat);
                                        end = TimeUtil.dateformat(end, time.dateformat);

                                        var sName = time['startTimeName'];
                                        var eName = time['endTimeName'];
                                        var dName = time['dateTypeName'];

                                        var p = {};
                                        p[sName] = cur;
                                        p[eName] = end;
                                        p[dName] = 0;
                                        p.asyncChartDiv = div;//将动态图的divID 回传给回调
                                        ChartUtil.ChartCache[commonDiv] = p;
                                        ChartUtil.ChartCache[div] = p;
                                        if (params) {
                                            if (callback) {
                                                callback(params);
                                            }
                                        } else {
                                            if (callback) {
                                                callback();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            chart: {
                events: {
                    selection: function (event) {
                        if (!event.xAxis) {
                            return false;
                        }

                        var min = Math.round(event.xAxis[0].min);
                        var max = Math.ceil(event.xAxis[0].max);
                        if (!min || min < 0) {
                            min = 0;
                        }
                        var data = getSeriesData(this.series);
                        if (data == null) {
                            return false;
                        }
                        if (!max || max >= data.length) {
                            max = data.length - 1;

                        }
                        if (!data[min] || !data[max]) {
                            return false;
                        }
                        var startTime = data[min].c == undefined ? data[min].time : data[min].c;
                        var endTime = data[max].c == undefined ? data[max].time : data[max].c;

                        if (!time) {
                            time = {
                                startTimeName: "startTime",
                                endTimeName: "endTime",
                                dateTypeName: "dateType",
                                dateformat: "yyyy-MM-dd hh:mm"
                            };
                        }
                        if (!time.dateformat) {
                            time.dateformat = "yyyy-MM-dd hh:mm"
                        }
                        var s = TimeUtil.todate(startTime);
                        var e = TimeUtil.todate(endTime);

                        var intval = e.getTime() - s.getTime();
                        if (intval < 1000 * 60 * 60) {//分钟表不能再细了
                            return false;
                        }

                        startTime = TimeUtil.dateformat(TimeUtil.todate(startTime), time.dateformat);
                        endTime = TimeUtil.dateformat(TimeUtil.todate(endTime), time.dateformat);

                        var sName = time['startTimeName'];
                        var eName = time['endTimeName'];
                        var dName = time['dateTypeName'];

                        var p = {};
                        p[sName] = startTime;
                        p[eName] = endTime;
                        p[dName] = 0;

                        ChartUtil.ChartCache[this.renderTo.id] = p;

                        if (params) {
                            /*params[time.startTimeName] = startTime;
                             params[time.endTimeName] = endTime;
                             params[time.dateTypeName] = 0;*/
                            if (callback) {
                                callback(params);
                            }
                        } else {
                            if (callback) {
                                callback();
                            }
                        }
                        return false;
                    }
                }, zoomType: 'x'
            }
        };
        return $.extend(true, selectOption, option || {});
    },
    serverChartDefaultOption: {
        yAxis: {
            lineWidth: 0
        },
        tooltip: {
            shared: true,
            headerFormat: "<small>{point.point.c}</small><br/>",
            formatter: function (curChart) {
                var tv = this.points[0].point["c"] || this.points[0].time;
                if (this.x.length == 10) {
                    tv = this.x;
                } else {
                    tv = TimeUtil.dateformat(TimeUtil.todate(tv), "yyyy-MM-dd hh:mm");
                }

                var m = tv + '<br />';
                var u = "";
                if (curChart.options.valueSuffix != null) {
                    u = (curChart.options.valueSuffix);
                }
                for (var i = 0; i < this.points.length; i++) {
                    if (this.points[i].point['isFill'] && this.points[i].point['isFill'] == true) {
                        m += ('<span style="color:' + this.points[i].series.color + '">●</span>' + this.points[i].series.name + ':' + '无数据' + '<br />');
                    } else {
                        m += ('<span style="color:' + this.points[i].series.color + '">●</span>' + this.points[i].series.name + ':' + this.points[i].y + u + '<br />')
                    }

                }
                return m;

            },
            crosshairs: {width: 1.5, color: '#ff5544'}
        }
    },

    defaultNoDataTip: {noData: "统计时间内暂无数据"},
    getDefaultTooltip: function (unit, otherVal) {
        return {
            otherVal: otherVal,
            valueSuffix: unit,
            formatter: function (curChart) {
                //获取点的时间
                var tv = this.point["c"] || this.point.time;
                if (this.x.length == 10) {
                    tv = this.x;
                } else {
                    tv = TimeUtil.dateformat(TimeUtil.todate(tv), "yyyy-MM-dd hh:mm");
                }
                if (showOther(curChart.options.otherVal)
                    || curChart.chart.series.length > 1) {//判断是否有多条曲线,并且单条线上要显示多个值

                    var descp = "";
                    var sn = this.point.series.name;
                    var other = null;
                    var v = null;

                    if (this.point["isFill"] && this.point["isFill"] == true) {
                        descp = "无数据";
                        if (curChart.options.otherVal != null) {
                            for (var i = 0; i < curChart.options.otherVal.length; i++) {
                                other = curChart.options.otherVal[i];

                                if (other["seriesAlaisName"]) {
                                    sn = other["seriesAlaisName"];
                                }
                            }
                        }
                    } else {
                        for (var i = 0; i < curChart.options.otherVal.length; i++) {

                            other = curChart.options.otherVal[i];
                            otherEq = other["seriesName"];
                            if (otherEq && otherEq != this.point.series.name) {
                                continue;
                            }

                            v = this.point[other["otherLabel"]];
                            if (other["seriesAlaisName"]) {
                                sn = other["seriesAlaisName"];
                            }
                            descp += other["otherName"]
                                + ":"
                                + (v == null || v == undefined || v == "undefined" ? "无数据" : v)
                                + other["otherUnit"]
                                + "<br />";
                        }
                    }
                    descp = sn + "<br/>" + tv + "<br/>" + descp;
                } else {
                    var val = this.y;
                    if (curChart.options.valueSuffix) {
                        val += (curChart.options.valueSuffix);
                    }

                    if (this.point["isFill"] && this.point["isFill"] == true) {
                        val = "无数据";
                    }
                    /*var descp = tv + '<br />'
                     + this.point.series.name + ':'
                     + val + '<br />';*/

                    var d = "";
                    var other = null;
                    var v = null;
                    var sn = this.point.series.name;
                    if (this.point["isFill"] && this.point["isFill"] == true) {
                        val = "无数据";
                        if (curChart.options.otherVal != null) {
                            for (var i = 0; i < curChart.options.otherVal.length; i++) {
                                other = curChart.options.otherVal[i];

                                if (other["seriesAlaisName"]) {
                                    sn = other["seriesAlaisName"];
                                }
                            }
                        }
                    } else if (curChart.options.otherVal
                        && curChart.options.otherVal.length > 0) {

                        for (var i = 0; i < curChart.options.otherVal.length; i++) {

                            other = curChart.options.otherVal[i];

                            if (other["seriesAlaisName"]) {
                                sn = other["seriesAlaisName"];
                            }

                            otherEq = other["seriesName"];
                            if (otherEq && otherEq != this.point.series.name) {
                                continue;
                            }
                            v = this.point[other["otherLabel"]];
                            d += other["otherName"]
                                + ":"
                                + (v == null || v == undefined || v == "undefined" ? "无数据" : v + other["otherUnit"])

                                + "<br />";
                        }
                    }

                    var descp = tv + '<br />'
                        + sn + ':' + val + "<br/>"
                        + d + '<br />';
                }
                return descp;
            }
        };
    },
    /**
     * 如果x轴是时间格式，可以根据时间段大小格式化x轴样式
     */
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

        startTime = TimeUtil.todate(startTime, srcFormat);
        endTime = TimeUtil.todate(endTime, srcFormat);
        var toFormat = srcFormat;
        var intval = endTime.getTime() - startTime.getTime();

        if (intval > 1000 * 60 * 60 * 24 * 2) {//2天
            toFormat = "yyyy-MM-dd";
        } else {
            toFormat = "hh:mm";
            if (categories.length >= 2) {
                var d1 = TimeUtil.todate(categories[0], srcFormat);
                var d2 = TimeUtil.todate(categories[1], srcFormat);

                if (TimeUtil.dateformat(d1, toFormat) == TimeUtil.dateformat(d2, toFormat)) {
                    toFormat = "yyyy-MM-dd";
                }
            }
        }

        if (categories != null) {
            var d = null;
            var newDatas = new Array(categories.length);
            for (var i = 0; i < categories.length; i++) {
                d = TimeUtil.todate(categories[i], srcFormat);
                newDatas[i] = TimeUtil.dateformat(d, toFormat);
            }
            return newDatas;
        }

        return categories;
    },

    /**
     * 自动格式化 曲线图 X 坐标时间值为便于阅读的形式
     * 根据查询规则自动格式
     * <pre>
     *     两天以内查小时表，则 时间区间在两天以内，则格式化为“hh:mm"
     *     两天以上查天表，则 时间区间在两天以上，则格式化为“yyyy-MM-dd"
     *  </pre>
     *
     * @param categories
     * @returns {*}  自动格式化的时间数组
     */
    autoFormatDateCategories: function (categories) {
        return ChartUtil.formatDate(categories, null);
        /*if (categories == null || categories.length < 1)
         return categories;

         var startTime = categories[0], endTime = categories[categories.length - 1];

         if (startTime == null || endTime == null || startTime == endTime)
         return categories;

         startTime = TimeUtil.todate(startTime, null);
         endTime = TimeUtil.todate(endTime, null);

         var interval = endTime.getTime() - startTime.getTime();
         var targetFormat;
         if (interval <= 1000 * 60 * 60 * 24 * 2) {
         targetFormat = "hh:mm";
         } else {
         targetFormat = "yyyy-MM-dd";
         }

         if (categories != null) {
         var newDateCategories = new Array(categories.length);
         for (var i = 0; i < categories.length; i++) {
         newDateCategories[i] = TimeUtil.dateformat(TimeUtil.todate(categories[i]), targetFormat);
         }
         return newDateCategories;
         }

         return categories;*/
    },

    /**
     * 计算平均值
     */
    calcAvg: function (categories, series, srcFormat) {
        if (categories == null || series == null)
            return "Nan";

        var total = 0;
        var count = 0;
        if (srcFormat != null && srcFormat != "") {

            if (categories.length < 1) {
                count = 1;
            } else {
                var startTime = categories[0];
                var endTime = categories[categories.length - 1];
                var addOne = 0;

                if (startTime == null || endTime == null
                    || startTime == endTime) {
                    count = 1;
                } else {
                    startTime = TimeUtil.todate(startTime, srcFormat);
                    endTime = TimeUtil.todate(endTime, srcFormat);

                    if (categories.length >= 2) {// 植树问题，最后一个时间减去第一个时间得出的时间差还要加上一个间隔
                        addOne = TimeUtil.todate(categories[1], srcFormat)
                                .getTime()
                            - startTime.getTime();
                    }

                    count = Math
                        .round((endTime.getTime() - startTime.getTime() + addOne) / 1000 / 60);
                }
            }
        } else {
            count = categories.length;
        }
        var datas = null;
        var multiple = 0;// 多少条线
        for (var i = 0; i < series.length; i++) {
            datas = series[i]["data"];
            multiple++;
            if (datas != null) {
                for (var j = 0; j < datas.length; j++) {
                    if (datas[j] != null) {
                        total += datas[j]['y'];
                    }
                }
            }
        }

        if (count && count != 0 && total)
            return Number((total / (count * multiple))).toFixed(2);
        return 0;

    },
    /**
     * 对空数据进行填充0
     */
    fillZeroToData: function (categories, datas) {
        if (!categories)
            return datas;
        if (datas == null || datas.length == 0)
            return [];
        var index = 0;
        var c = null;
        var fill = false;
        var obj = null;

        var newDatas = new Array(categories.length);
        for (var i = 0; i < categories.length; i++) {
            c = categories[i];
            fill = true;

            for (var j = 0; j < datas.length; j++) {
                obj = datas[j];
                if (c == obj["c"] || c === obj["time"]) {
                    fill = false;
                    break;
                }
            }

            if (fill) {
                newDatas[i] = {
                    "c": c,
                    "time": c,
                    "y": 0,
                    "isFill": true
                };
                index++;
            } else {
                newDatas[i] = obj;
            }
        }
        return newDatas;
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
            series[i]["data"] = ChartUtil.fillData(categories, series[i]["data"]);
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

        if (data == null || data.length == 0)
            return [];

        var cDate = null, dataIndex = 0;

        var newData = new Array(categories.length);
        for (var i = 0; i < categories.length; i++) {
            cDate = categories[i];

            if (dataIndex < data.length && cDate === data[dataIndex].time) {
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

    /**
     * 创建曲线图 div:显示div
     * categories:x轴数据，数组格式 ["10:15","10:25","10:35"]
     * title:标题
     * series:y轴数据,二维数组格式 格式： [ {name:"响应时间":
	 * 								data:[{c:"10:15",y:"101"},{c:"10:15",y:"101"},{c:"10:15",y:"101"}],
	 * 								{name:"错误率":
	 * 								data:[{c:"10:15",y:"101",otherver:"102"},{c:"10:15",y:"101"},{c:"10:15",y:"101"}]}]
	 * otherVal:某个数据点需要显示其他数据信息的配置 例：data:[{c:"10:15","y":123,"respTime":300}],要显示respTime数据的时候
	 * 				otherVal的配置：{otherName:"响应时间",otherLabel:"respTime",otherUnit:"ms"}
	 */
    createLineChart: function (div, title, categories, series, unit,
                               dateformat, otherVal, option, tickInterval) {
        // 控制线条（或区块）示例名称的最大宽度为100px，超出则缩略显示
        var legend = {
            enabled: true,
            itemStyle: {
                "white-space": "nowrap",
                "overflow": "hidden",
                "text-overflow": "ellipsis",
                "max-width": "100px"
            },
            useHTML: true,
            labelFormat: '<span title="{name}">{name}</span>'
        };

        if (series != null) {
            for (var i = 0; i < series.length; i++) {
                series[i]["data"] = ChartUtil.fillZeroToData(categories, series[i]["data"]);
            }
        }

        var backOption = {};
        if (ChartUtil.ChartCache[div]) {
            backOption = {
                subtitle: {
                    useHTML: true,
                    align: "left",
                    x: 60,
                    y: 10,
                    floating: true,
                    style: {color: "#006cee"},
                    /*text: '<a style="color:#006cee" href="javascript:ChartUtil.resetTopData(' + "'" + div + "'" + ');">返回</a>'*/
                    text: '<a href="javascript:ChartUtil.resetTopData(' + "'" + div + "'" + ');" class="btnNormal01 fn_bgGreen01 fn_bgGreen01b">返回</a>'
                }
            };

            option = $.extend(true, option || {}, backOption);
        }
        ChartUtil.ChartCache[div] = null;
        if (categories && categories.length >= 2) {

            var intval = TimeUtil.getTimeIntVal(categories[0], categories[1]);

            var table = "minute";
            if (intval >= 1000 * 60 * 60 * 24) {
                table = "day";
            } else if (intval >= 1000 * 60 * 60) {
                table = "hour";
            }
            if (table == 'minute') {
                option = $.extend(true, option || {}, {chart: {zoomType: null}})
            }
        }

        if (dateformat && dateformat != null) {
            categories = ChartUtil.formatDate(categories, dateformat);
        }
        var titleOption = null;
        if (title == null) {
            titleOption = {y: -30};
        } else {
            titleOption = {text: title};
        }

        if ((!tickInterval) && categories && categories.length > 24) {
            tickInterval = Math.ceil(categories.length / 24);
        }

        var defaultOption = $.extend(true, {
            title: titleOption,
            credits: {
                enabled: false
            },
            xAxis: {
                title: {
                    enabled: false
                },
                tickmarkPlacement: 'on',
                categories: categories,
                labels: {
                    rotation: -60
                },
                tickInterval: tickInterval
            },
            yAxis: {
                min: 0,
                title: {
                    align: 'high',
                    offset: 0,
                    text: unit ? "（" + unit + "）" : "",
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
            tooltip: ChartUtil.getDefaultTooltip(unit, otherVal),
            legend: legend,
            lang: ChartUtil.defaultNoDataTip,
            series: series
        }, option || {});

        return $('#' + div).highcharts(defaultOption);
    },

    /**
     * 绘制曲线图
     * @param selector jquery 选择器
     * @param title 标题，若不需要，请传 null
     * @param categories  categories X轴数组
     * @param series series Y 值数组
     * @param unit Y值单位（方法中会添加中文括号）
     * @param otherVal otherVal
     * @param tooltip tooltip 数据点提示配置
     * @param option  highcharts 其它配置
     * @returns {jQuery} highcharts 对象
     */
    drawLineChart: function (selector, title, categories, series, unit, otherVal, tooltip, option) {
        // 控制线条（或区块）示例名称的最大宽度为100px，超出则缩略显示
        var legend = {
            enabled: true,
            itemStyle: {
                "white-space": "nowrap",
                "overflow": "hidden",
                "text-overflow": "ellipsis",
                "max-width": "100px"
            },
            useHTML: true,
            labelFormat: '<span title="{name}">{name}</span>'
        };

        if (series != null) {
            ChartUtil.fillSeries(categories, series);
        }

        categories = ChartUtil.autoFormatDateCategories(categories);

        var titleOption = null;
        if (title == null) {
            titleOption = {y: -30};
        } else {
            titleOption = {text: title};
        }

        var backOption = {};
        if (ChartUtil.ChartCache[selector.substr(1, selector.length)]) {
            backOption = {
                subtitle: {
                    useHTML: true,
                    align: "left",
                    x: 80,
                    y: 20,
                    floating: true,
                    style: {color: "#006cee"},
                    text: '<a class="btnNormal01 fn_bgGreen01 fn_bgGreen01b" href="javascript:ChartUtil.resetTopData(' + "'" + selector.substr(1, selector.length - 1) + "'" + ');">返回</a>'
                }
            };

            option = $.extend(true, option || {}, backOption);
        }
        ChartUtil.ChartCache[selector.substr(1, selector.length)] = null;

        var defaultOption = $.extend(true, {
            title: titleOption,
            credits: {
                enabled: false
            },
            xAxis: {
                title: {
                    enabled: false
                },
                tickmarkPlacement: 'on',
                categories: categories,
                labels: {
                    rotation: -60
                }
            },
            yAxis: {
                min: 0,
                title: {
                    align: 'high',
                    offset: 0,
                    text: "（" + unit + "）",
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
            tooltip: tooltip === null ? ChartUtil.getDefaultTooltip(unit, otherVal) : tooltip,
            legend: legend,
            lang: ChartUtil.defaultNoDataTip,
            series: series
        }, option || {});

        return $(selector).highcharts(defaultOption);
    },

    creatPieChart: function (div, title, series, percentagePrefix, valueDecorator, otherVal, tooltip, option) {

        var defaultOption = $.extend(true, {
            lang: ChartUtil.defaultNoDataTip,
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
            tooltip: ChartUtil.getDefaultPieTooltip(percentagePrefix, valueDecorator, otherVal),
            series: series
        }, option);

        $('#' + div).highcharts(defaultOption);
    },

    getDefaultPieTooltip: function (percentagePrefix, valueDecorator, otherVal) {
        return {
            otherVal: otherVal,
            valueDecorator: valueDecorator,
            percentagePrefix: percentagePrefix,
            formatter: function (tip) {

                var desc = this.key + '<br/>',
                    valueDecorator = tip.options.valueDecorator;

                if (!valueDecorator) {
                    desc += percentagePrefix + ": " + this.percentage.toFixed(2) + "%";
                } else {
                    var value = null;
                    for (var vType in valueDecorator) {
                        value = this[vType];
                        if (vType == "percentage") {
                            value = value.toFixed(2);
                        }
                        desc += valueDecorator[vType][0] + " : " + value + valueDecorator[vType][1] + "<br/>";
                    }
                }

                return desc;
            }
        };
    },

    createDoublePieChart: function (div, title, series, unit, otherVal, option) {
        var defaultOption = $.extend(true,
            {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    events: {
                        load: function (chart) {
                            var items = this.legend.allItems;
                            for (var i = 0; i < items.length; i++) {
                                if (items[i].name && items[i].name.length > 26) {
                                    this.legend.destroy();
                                }
                            }
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: title
                },
                tooltip: {
                    //pointFormat: '{series.name}: <b>{point.percentage:.2f}' + unit + '</b>'
                    pointFormatter: function () {
                        //if(Number(this.percentage).search(new RegExp("^([0-9]*[.0-9])$")) != -1) {
                        if (new RegExp("^([0-9]*[.0-9])$").test(this.percentage)) {
                            return this.series.name + ':' + this.percentage + unit + '';
                        } else {
                            return this.series.name + ':' + parseFloat(Highcharts.numberFormat(this.percentage, 2)) + unit + '';
                        }
                    }
                },
                plotOptions: {
                    pie: {
                        innerSize: 100,
                        depth: 45,
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            //format: '<b>{point.name}</b>: {point.percentage:.2f} ' + unit + ''
                            formatter: function () {
                                if (new RegExp("^([0-9]*[.0-9])$").test(this.percentage)) {
                                    return this.point.name + ':' + this.percentage + unit + '';
                                } else {
                                    return this.point.name + ':' + parseFloat(Highcharts.numberFormat(this.percentage, 2)) + unit + '';
                                }
                            }
                        },
                        showInLegend: true
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                lang: ChartUtil.defaultNoDataTip,
                series: [{
                    type: 'pie',
                    name: title,
                    data: series
                }]
            }, option || {});
        $('#' + div).highcharts(defaultOption);
    },

    /**
     * 同createLineChart
     *
     */
    createColumnChart: function (div, title, categories, series, unit,
                                 dateformat, otherVal, option, tickInterval) {
        var legend = {
            align: 'center',
            borderWidth: 0
        };
        if (series != null) {

            for (var i = 0; i < series.length; i++) {
                series[i]["data"] = ChartUtil.fillZeroToData(categories, series[i]["data"]);
            }
        }

        var backOption = {};
        if (ChartUtil.ChartCache[div]) {
            backOption = {
                subtitle: {
                    useHTML: true,
                    align: "left",
                    x: 60,
                    y: 10,
                    floating: true,
                    style: {color: "#006cee"},
                    /*text: '<a style="color:#006cee" href="javascript:ChartUtil.resetTopData(' + "'" + div + "'" + ');">返回</a>'*/
                    text: '<a href="javascript:ChartUtil.resetTopData(' + "'" + div + "'" + ');" class="btnNormal01 fn_bgGreen01 fn_bgGreen01b">返回</a>'
                }
            };

            option = $.extend(true, option || {}, backOption);
        }

        if (dateformat && dateformat != null) {
            categories = ChartUtil.formatDate(categories, dateformat);
        }
        var titleOption = null;
        if (title == null) {
            titleOption = {y: -30};
        } else {
            titleOption = {text: title};
        }

        if ((!tickInterval) && categories && categories.length > 24) {
            tickInterval = Math.ceil(categories.length / 24);
        }

        var defaultOption = $.extend(true, {
            chart: {
                type: 'column'
            },
            title: titleOption,
            credits: {
                enabled: false
            },
            xAxis: {
                title: {
                    enabled: false
                },
                tickmarkPlacement: 'on',
                categories: categories,
                labels: {
                    rotation: -60
                },
                tickInterval: tickInterval
            },
            yAxis: {
                min: 0,
                lineWidth: 1,
                title: {
                    align: 'high',
                    offset: 0,
                    text: unit ? "（" + unit + "）" : "",
                    rotation: 0,
                    y: -20
                }
            },
            tooltip: ChartUtil.getDefaultTooltip(unit, otherVal),
            legend: legend,
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            lang: ChartUtil.defaultNoDataTip,
            series: series
        }, option || {});
        $('#' + div).highcharts(defaultOption);
    },

    createAreaChart: function (div, title, categories, series, unit, dateformat, option, tickInterval, fill, otherVal) {
        var legend = {
            align: 'center',
            borderWidth: 0
        };

        if (fill != null && fill == true && series != null) {
            for (var i = 0; i < series.length; i++) {
                series[i]["data"] = ChartUtil.fillZeroToData(categories, series[i]["data"]);
            }
            if (series.length > 1)
                legend = {
                    align: 'center',
                    borderWidth: 0
                };
        }

        var backOption = {};
        if (ChartUtil.ChartCache[div]) {
            /*backOption = {labels:{
             style:{
             color:"#006cee"
             },
             items:[{html:'<a href="javascript:ChartUtil.resetTopData('+"'"+div+"'"+');">返回</a>',style:{
             color:"#006cee",
             left:"30px",
             top:"-20px"
             }}]
             items:[{html:'<span><a href="">返回</a></span>',style:{
             color:"#006cee",
             left:"30px",
             top:"-30px"
             }}]
             }};*/

            backOption = {
                subtitle: {
                    useHTML: true,
                    align: "left",
                    x: 60,
                    y: 10,
                    floating: true,
                    style: {color: "#006cee"},
                    text: '<a class="btnNormal01 fn_bgGreen01 fn_bgGreen01b" href="javascript:ChartUtil.resetTopData(' + "'" + div + "'" + ');">返回</a>'
                }
            };

            option = $.extend(true, option || {}, backOption);
        }
        ChartUtil.ChartCache[div] = null;
        if (categories.length >= 2) {

            var intval = TimeUtil.getTimeIntVal(categories[0], categories[1]);

            var table = "minute";
            if (intval >= 1000 * 60 * 60 * 24) {
                table = "day";
            } else if (intval >= 1000 * 60 * 60) {
                table = "hour";
            }
            if (table == 'minute') {
                option = $.extend(true, option || {}, {chart: {zoomType: null}})
            }
        }

        if (dateformat && dateformat != null) {
            categories = ChartUtil.formatDate(categories, dateformat);
        }

        var titleOption = null;
        if (title == null) {
            titleOption = {y: -30};
        } else {
            titleOption = {text: title};
        }
        if ((!tickInterval) && categories && categories.length > 24) {
            tickInterval = Math.ceil(categories.length / 24);
        }
        var defaultOption = $.extend(true, {
            chart: {
                type: "area"
            },
            xAxis: {
                title: {
                    enabled: false
                },
                tickmarkPlacement: 'on',
                categories: categories,
                labels: {
                    rotation: -60
                },
                tickInterval: tickInterval
            },
            yAxis: {
                min: 0,
                lineWidth: 1,
                title: {
                    align: 'high',
                    offset: 0,
                    text: unit ? "（" + unit + "）" : "",
                    rotation: 0,
                    y: -20
                }
            },
            title: titleOption,
            credits: false,
            lang: ChartUtil.defaultNoDataTip,
            plotOptions: {
                area: {
                    stacking: 'normal',

                    marker: {
                        enabled: false
                    }
                }
            },
            //legend:{borderWidth:0},
            tooltip: otherVal ? ChartUtil.getDefaultTooltip(unit, otherVal) : {
                    shared: true,
                    valueSuffix: unit,
                    crosshairs: {width: 1.5}
                },
            series: series
        }, option || {});


        $('#' + div).highcharts(defaultOption);
    },

    /**
     * 创建爆布图
     * @param div
     * @param series:[{data:[{'name':'asd',y:120},{'name':'dsew',y:130},{'name':'dfda',y:140}]}]
     * @param title
     * @param tooltip
     * @param option
     */
    createWaterFall: function (div, series, title, tooltip, option) {
        if (!tooltip) {
            tooltip = '<b>${point.y:,.2f}</b> USD';
        }

        var defaultOption = $.extend(true, {
            chart: {
                type: 'waterfall',
                inverted: true
            },
            credits: false,
            title: {
                text: title
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'USD'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: tooltip
            },
            series: series
        }, option || {});

        $('#' + div).highcharts(defaultOption);
    },

    /**
     * 创建时序图
     * @param div
     * @param title
     * @param subtitle
     * @param categories [name1, name2,name3]
     * @param data [[name1-start, name1-end],[name2-start, name2-end],[name3-start, name3-end]]
     * @param name
     * @param unit 单位
     * @param option
     */
    createColumnRange: function (div, title, subtitle, categories, data, name, td_title, unit, option) {
        var defaultOption = $.extend(true, {
            chart: {
                type: 'columnrange',
                inverted: true
            },
            title: {
                text: title
            },
            subtitle: {
                text: subtitle
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: name + '(' + unit + ')'
                }
            },
            tooltip: {
                valueSuffix: unit
            },
            plotOptions: {
                columnrange: {
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            return this.y + unit;
                        }
                    }
                }
            },
            credits: false,
            legend: {
                enabled: false
            },
            series: [{
                name: td_title,
                data: data
            }]
        }, option || {});

        $('#' + div).highcharts(defaultOption);
    },

    /**曲线和柱状图合并
     * <pre>
     *  注意：方法中未对数据进行填0处理，需要在传入数据前调用对应的fill方法进行数据填0处理
     *  </pre>
     * @param div
     * @param datas
     * @param categories
     * @param conf
     * @param option
     */
    createLineColumn: function (div, datas, categories, conf, option) {
        if (categories) {
            categories = ChartUtil.autoFormatDateCategories(categories);
        }

        var backOption = {};
        if (ChartUtil.ChartCache[div]) {
            backOption = {
                subtitle: {
                    useHTML: true,
                    align: "left",
                    x: 80,
                    y: 20,
                    floating: true,
                    style: {color: "#006cee"},
                    text: '<a class="btnNormal01 fn_bgGreen01 fn_bgGreen01b" href="javascript:ChartUtil.resetTopData(' + "'" + div + "'" + ');">返回</a>'
                }
            };

            option = $.extend(true, option || {}, backOption);
        }
        ChartUtil.ChartCache[div] = null;

        var defaultOption = {
            chart: {
                zoomType: 'xy'
            },
            title: {y: -20},
            xAxis: [{
                categories: categories
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}',
                    style: {
                        color: '#89A54E'
                    }
                },
                title: {
                    style: {
                        color: '#89A54E'
                    },
                    align: 'high',
                    offset: 0,
                    text: "（ " + conf.lineUnit + " ）",
                    rotation: 0,
                    y: -20
                }
            }, { // Secondary yAxis
                title: {
                    align: 'high',
                    offset: 0,
                    text: "（ " + conf.columnUnit + " ）",
                    rotation: 0,
                    y: -20,
                    style: {
                        color: '#4572A7'
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: '#4572A7'
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            credits: false,
            series: [{
                name: conf.columnName,
                color: '#4572A7',
                type: 'column',
                yAxis: 1,
                data: datas.column,
                tooltip: {
                    valueSuffix: conf.columnUnit
                }
            }, {
                name: conf.lineName,
                color: '#89A54E',
                type: 'spline',
                data: datas.line,
                tooltip: {
                    valueSuffix: conf.lineUnit
                }
            }]
        };

        defaultOption = $.extend(true, defaultOption, option || {});
        $('#' + div).highcharts(defaultOption);
    },
    //百分比占比图
    createColunmRate: function (div, datas, categorites, conf, option, unit) {
        var defaultOption = $.extend(true, {
            chart: {
                type: 'bar'
            },
            title: {
                text: null
            },
            xAxis: {
                categories: categorites
            },
            yAxis: {
                min: 0,
                title: null,
                labels: {format: '{value}' + unit}
            },
            legend: {
                backgroundColor: '#FFFFFF',
                reversed: true
            },
            credits: false,
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            tooltip: ChartUtil.getDefaultTooltip(conf.unit, conf.otherVal),

            series: datas
        }, option || {});
        $("#" + div).highcharts(defaultOption);
    },

    createChinaMap: function (div, datas, map_datas, title, legendTitle, dataClasses, unit,
                              mapNavigation, option, otherValues, drillDownCallBack, drillUpCallBack) {

        var map_infos = mapinfos,
            jsonLocation = {
                "prefix": ctx + "/resources/lib/data/highmaps_city_data/",
                "suffix": ".geo.json"
            };

        this.createMapChart(div, datas, map_datas, Highcharts.geojson(map_infos), title,
            legendTitle, dataClasses, unit, mapNavigation, option, otherValues, drillDownCallBack, drillUpCallBack, jsonLocation);
    },

    /**
     * 创建地图 div:图形渲染位置 datas:用户所加载的数据。比如每个省的响应时间
     * 格式:[{id:1,value:21},{id:2,value:32}] id是区分地区的标识
     * map_datas:该地图上所有地区的信息数据。跟datas的数据格式一样，相当于初始化每个地区的数据、
     * map_infos:地图信息数据。每个地区的坐标之类的信息 title:标题 legentTitle:小标识图标题
     * dataClasses:数据区域标识 [{from:0:to:100,"name":"正常",color:"##f69696"}]
     * unit:数据单位 mapNavigation:是否可以导航 option:扩展参数
     * otherVal的配置：[{otherName:"响应时间",otherLabel:"respTime",otherUnit:"ms"}]
     * drillDownCallBack: 单击省份的回调函数，具体为function(provId, result), provId为要查看详情的省份的id，
     * result为自定义返回对象，result.setData(data)将该省下的各个城市的统计数据传入,参数data为数组，例子：[{"code": 912, "name": "鹤岗", "value": 604.39},...]
     * result.setTitle(title)改变图表标题，参数title为highcharts定义的title对象
     */
    createMapChart: function (div, datas, map_datas, map_infos, title, legendTitle, dataClasses, unit,
                              mapNavigation, option, otherValues, drillDownCallBack, drillUpCallBack, jsonLocation) {
        for (var i = 0; i < map_datas.length; i++) {
            map_datas[i].value = -1;
        }
        var md = null;
        var key = null;
        var ks = null;
        var otherDatas = {};

        if (datas != null && datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
                md = datas[i];
                key = mapIds2key[md.id];
                if (key == null)
                    continue;
                ks = key.split(",");
                if (ks.length > 0) {
                    for (var k = 0; k < ks.length; k++) {
                        if (ks[k] != null && ks[k] != "") {
                            for (var n = 0; n < map_datas.length; n++) {
                                if (map_datas[n]["hc-key"] == ks[k]) {
                                    map_datas[n]["value"] = md.value;
                                    if (otherValues && otherValues.length != 0) {
                                        var ov = [];
                                        for (var t = 0; t < otherValues.length; t++) {
                                            //ov.push([otherValues[t]["otherName"],map_datas[n][otherValues[t]["otherLabel"]],otherValues[t]["otherUnit"]] )
                                            ov.push({
                                                "seriesName": otherValues[t]["otherName"],
                                                "val": md[otherValues[t]["otherLabel"]],
                                                "unit": otherValues[t]["otherUnit"]
                                            });
                                        }
                                        otherDatas[ks[k]] = ov;
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (drillDownCallBack) {
            // 给城市设置随机数据
            $.each(map_infos, function (i) {
                this.drilldown = this.properties['hc-key'];
            });
        }

        var mapOptions = $.extend(true, {
            chart: {
                borderWidth: 0,
                events: !drillDownCallBack ? {} : {
                        drilldown: function (e) {
                            if (!e.seriesOptions) {
                                var chart = this,
                                    mapKey = e.point.drilldown;
                                if (mapKey.indexOf("tw") >= 0) {
                                    mapKey = "cn-tw";
                                } else if (/cn-\d{4}/.test(mapKey) && mapKey != "cn-3681") {
                                    mapKey = "cn-hk";
                                }

                                chart.showLoading('<i class="icon-spinner icon-spin icon-3x">加载中...</i>');
                                // 加载城市数据

                                //var dbData = [{"name": "清远", "value": 30}, {"name": "广州", "value": 20}],
                                var cdata = new Highcharts.customedData();
                                data = null;

                                drillDownCallBack(mapKey2Id[e.point.drilldown], cdata, e.point);

                                $.getJSON(jsonLocation.prefix + mapKey + jsonLocation.suffix, function (json) {
                                    data = Highcharts.geojson(json);
                                });

                                var timer = 0;
                                timer = setInterval(function () {
                                    if (cdata.isFilled && data) {
                                        clearInterval(timer);

                                        var dbData = cdata.data,
                                            dbTitle = cdata.title;

                                        $.each(data, function (i) {
                                            this.value = -1;
                                            for (var i = 0; i < dbData.length; i++) {
                                                if (this.name.indexOf(dbData[i].name) >= 0 ||
                                                    (this.name == "台湾" && 710000 == dbData[i].code)) {
                                                    $.extend(true, this, dbData[i]);
                                                    //this.value = dbData[i].value;
                                                }
                                            }
                                        });

                                        chart.hideLoading();

                                        if (dbTitle) {
                                            chart.setTitle(dbTitle);
                                        }

                                        chart.addSeriesAsDrilldown(e.point, {
                                            name: legendTitle,
                                            data: data,
                                            dataLabels: {
                                                enabled: true,
                                                format: '{point.name}'
                                            }
                                        });

                                        chart.tooltip.options.formatter = function () {
                                            if (this.point.value == -1) {
                                                return '<b>' + this.point.name + '</b><br>' +
                                                    '无数据<br>';
                                            } else {
                                                var label = '<b>' + this.point.name + '</b><br>';
                                                label += this.series.name + ":" + this.point.value + unit + '<br>';

                                                if (otherValues && otherValues.length > 0) {
                                                    var sn = null;
                                                    for (var i = 0; i < otherValues.length; i++) {
                                                        sn = otherValues[i];
                                                        label += sn["otherName"] + ":" + (this.point)[sn["otherLabel"]] + sn["otherUnit"] + '<br>';
                                                    }
                                                }
                                                return label;
                                            }
                                        };
                                    }
                                }, 500);
                            }
                        },
                        drillup: function () {
                            this.tooltip.options.formatter = this.userOptions.tooltip.formatter;
                            this.setTitle(this.userOptions.title);
                            if (drillUpCallBack) drillUpCallBack();
                        }
                    }
            },
            title: {
                text: title
            },
            mapNavigation: {
                enabled: mapNavigation
            },
            credits: {
                enabled: false
            },
            legend: {
                title: {
                    text: legendTitle,
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.textColor)
                        || 'black'
                    }
                },
                align: 'right',
                verticalAlign: 'bottom',
                floating: true,
                layout: 'vertical',
                valueDecimals: 0,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor)
                || 'rgba(255, 255, 255, 0.85)',
                symbolRadius: 0,
                symbolHeight: 14
            },
            colorAxis: {
                dataClasses: dataClasses
            },
            tooltip: {
                valueSuffix: unit,
                otherDatas: otherDatas,
                formatter: function (a) {
                    if (this.point.value == -1) {
                        return '<b>' + mapNameFormat[this.point.name] + '</b><br>' +
                            '无数据<br>';
                    } else {
                        var label = '<b>' + mapNameFormat[this.point.name] + '</b><br>';
                        label += this.series.name + ":" + this.point.value + a.options.valueSuffix + '<br>';

                        if (a.options.otherDatas) {
                            var ovs = a.options.otherDatas[this.point["hc-key"]];
                            if (ovs && ovs.length != 0) {
                                var sn = "";
                                var val = "";
                                var un = "";

                                for (var i = 0; i < ovs.length; i++) {
                                    sn = ovs[i]["seriesName"];
                                    val = ovs[i]["val"];
                                    un = ovs[i]["unit"];
                                    if (!un) {
                                        un = "";
                                    }
                                    label += sn + ":" + val + un + "<br/>";
                                }
                            }
                        }
                        return label;
                    }
                }
            },
            plotOptions: {
                map: {
                    states: {
                        hover: {
                            //color: '#33CCCC'
                            brightness: 0,
                            enabled: false
                        }
                    }
                }
            },
            series: [{
                data: map_datas,
                mapData: map_infos,
                joinBy: ['hc-key'],
                animation: true,
                name: legendTitle
            }],
            drilldown: {
                activeDataLabelStyle: {
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    textShadow: '0 0 3px #000000'
                },
                drillUpButton: {
                    relativeTo: 'spacingBox',
                    position: {
                        x: 0,
                        y: 20
                    }
                }
            },
            lang: {
                drillUpText: '返回'
            }
        }, option || {});
        $("#" + div).highcharts("Map", mapOptions);
    },

    createCityMap: function (div, dbData, provId, legendTitle, unit, dataClasses, otherValues, option) {
        var jsonLocation = {
            "prefix": ctx + "/resources/lib/data/highmaps_city_data/",
            "suffix": ".geo.json"
        };
        var data = null;
        $.getJSON(jsonLocation.prefix + mapIds2key[provId] + jsonLocation.suffix, function (json) {
            data = Highcharts.geojson(json);
        });

        var mapOptions = $.extend(true, {
            chart: {
                borderWidth: 0
            },
            credits: {
                enabled: false
            },
            legend: {
                title: {
                    text: legendTitle,
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.textColor)
                        || 'black'
                    }
                },
                align: 'right',
                verticalAlign: 'bottom',
                floating: true,
                layout: 'vertical',
                valueDecimals: 0,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor)
                || 'rgba(255, 255, 255, 0.85)',
                symbolRadius: 0,
                symbolHeight: 14
            },
            colorAxis: {
                dataClasses: dataClasses
            },
            plotOptions: {
                map: {
                    states: {
                        hover: {
                            brightness: 0,
                            enabled: false
                        }
                    }
                }
            },
            series: [{
                //data: data,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                },
                name: legendTitle
            }],
            tooltip: {
                formatter: function () {
                    if (this.point.value == -1) {
                        return '<b>' + this.point.name + '</b><br>' +
                            '无数据<br>';
                    } else {
                        var label = '<b>' + this.point.name + '</b><br>';
                        label += this.series.name + ":" + this.point.value + unit + '<br>';

                        if (otherValues && otherValues.length > 0) {
                            var sn = null;
                            for (var i = 0; i < otherValues.length; i++) {
                                sn = otherValues[i];
                                label += sn["otherName"] + ":" + (this.point)[sn["otherLabel"]] + sn["otherUnit"] + '<br>';
                            }
                        }
                        return label;
                    }
                }
            }
        }, option || {});

        var timer = 0;
        timer = setInterval(function () {
            if (data) {
                clearInterval(timer);

                $.each(data, function (i) {
                    this.value = -1;
                    for (var i = 0; i < dbData.length; i++) {
                        if (this.name.indexOf(dbData[i].name) >= 0 ||
                            (this.name == "台湾" && 710000 == dbData[i].code)) {
                            $.extend(true, this, dbData[i]);
                            //this.value = dbData[i].value;
                        }
                    }
                });

                mapOptions.series[0].data = data;
                $("#" + div).highcharts("Map", mapOptions);
            }
        }, 500);
    }
};