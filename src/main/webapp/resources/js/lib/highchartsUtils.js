var chartsUtils = {
    //默认配置
    defaultOptions:{
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
        }
    },
    //调整图表配置
    setOptions: function (options) {
        return $.extend(true,chartsUtils.defaultOptions, options || {});
    }
}