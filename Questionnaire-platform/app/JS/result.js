define([
    'util',
    'edit',
    'storage',
    'dist/echarts', // 一定要加载这三个！！！！！
    'dist/chart/bar',
    'dist/chart/pie'
], function($, Edit, Storage) {
    'use strict';
    
    var result = function() {
     
        // 获取相应问卷
        var allQns = Storage.getData().qn;
        var qns = Edit.init(allQns[$.U.pos]);
        console.log(allQns);
        
        // 先配置echart
        require.config({
            paths: {
                echarts: 'dist'
            }
        });
        
        // 先渲染dom
        var main = document.getElementById("main");
        
        var allDivs = "";
        for (var j = 0, lenj = qns.length; j < lenj; j++) {
            allDivs += '<div style="width:660px; height:300px;"></div>';
        }
        
        // 修改html
        main.innerHTML = '<div id="questionnair-result">'
			+ '<div id="questionnair-result-head">'
			+	'<button>返回</button>'
			+	'<h3>' + allQns[$.U.pos].title + '</h3>'
			+	'<h4>次统计分析值包含完整的数据</h4>'
		    +	'</div>'
		    +	'<div id="questionnair-result-content">'
		    +		allDivs
		    +	'</div>'	
		    +	'<div id="questionnair-result-foot">'
		    +		'<button>返回</button>'
		    +	'</div>';
        
        // 找到相应的dom
        var divs = document.getElementById("questionnair-result-content").getElementsByTagName("div");
        
        for (var i = 0, len = divs.length; i < len; i++) {
            (function() {
                var chartInDiv = divs[i];
                var option = generate(qns[i], divs[i]);
            })(i)
        }
        
        // 两个返回按钮
        var btn1 = document.getElementsByTagName("button")[0];
        var btn2 = document.getElementsByTagName("button")[1];
        $.U.click(btn1, function() {
            window.location.hash = "#listpage";
        });   
        $.U.click(btn2, function() {
            window.location.hash = "#listpage";
        })
    }

    // 根据不同的类型模拟生成不同的数据结果
    function generate(qn, div) {
        // 定义配置
        var option;
        
        // 判断类型
        if (qn.type === "checkbox") {
            // 多选题用柱状图
            require([
                'echarts',
                'echarts/chart/bar'
            ],function(ec) {
                // 初始化dom
                var myChart = ec.init(div);
                // 定义配置(从官网demo抄来)
                option = {
                    title: {
                        text: qn.title,
                        subtext: '数据随机生成'
                    },
                    tooltip: {
                        show: true
                    },
                    legend: {
                        data:['多选题']
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : qn.options
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                        }
                    ],
                    series : [
                        {
                            "name":"人数",
                            "type":"bar",
                            "data":(function(len) {
                                var a = [];
                                for (var i = 0; i < len; i++) {
                                    a.push(parseInt(Math.random()*(100-10+1)+10,10))
                                }
                                return a;
                            })(qn.options.length)
                        }
                    ]
                };
        
                // 为echarts对象加载数据 
                myChart.setOption(option);   
                
            });
        } else if (qn.type === "radio") {
            // 单选题用饼状图
            require([
                'echarts',
                'echarts/chart/funnel',
                'echarts/chart/pie'
            ],function(ec) {
                // 初始化dom
                var myChart = ec.init(div);
                // 定义配置(从官网demo抄来)
                option = {
                    title: {
                        text: qn.title,
                        left: 'center',
                        top: 20,
                    },

                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },

                    visualMap: {
                        show: false,
                        min: 80,
                        max: 600,
                        inRange: {
                            colorLightness: [0, 1]
                        }
                    },
                    series : [
                        {
                            name:'访问来源',
                            type:'pie',
                            radius : '55%',
                            center: ['50%', '50%'],
                            data:(function(len) {
                                var a = [];
                                var obj;
                                for (var i = 0; i < len; i++) {
                                    a.push({
                                        value: (parseInt(Math.random()*(80-10+1)+10)), 
                                        name: qn.options[i]
                                    });
                                }
                                return a;
                            })(qn.options.length)
                            .sort(function (a, b) { return a.value - b.value}),
                            roseType: 'angle',
                            label: {
                                normal: {
                                    textStyle: {
                                        color: 'rgba(255, 255, 255, 0.3)'
                                    }
                                }
                            }
                        }
                    ]
                };
        
                // 为echarts对象加载数据 
                myChart.setOption(option);   
                
            });

        } else if (qn.type === "textarea") {
            // 文本题也用饼状图
            require([
                'echarts',
                'echarts/chart/funnel',
                'echarts/chart/pie'
            ],function(ec) {
                // 初始化dom
                var myChart = ec.init(div);
                // 定义配置
                option = {
                    title: {
                        text: qn.title
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },  
                    series: [
                        {
                            name:'文本填写',
                            type:'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {value:(parseInt(Math.random()*(80-10+1)+10)), name:'有效填写'},
                                {value:(parseInt(Math.random()*(80-10+1)+10)), name:'无效填写'}
                            ]
                        }
                    ]
                };
    
                // 为echarts对象加载数据 
                myChart.setOption(option);   
                
            });
        }
    }

    return {
        result: result  
    };
});