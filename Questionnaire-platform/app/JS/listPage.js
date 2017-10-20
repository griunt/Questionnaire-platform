define([
    'util',
    'result',
    'newBuild',
    'edit',
    'storage',
    'types',
    'darken'
], function($, Result, NewBuild, Edit, Storage, T, Darken) {
    'use strict';
    var listPage = function() {
        refresh();
        delAndAdd();
    };
    
    // 渲染页面
    var refresh = function() {
        var allQns = Storage.getData().qn,
            main = document.getElementById("main");
        var ihtml = "",
            aQn = "";
        
        for (var i = 0, len = allQns.length; i < len; i++) {
                aQn = 
                 '<div>'
			   +	'<input type="checkbox">'
			   +   	'<span>' + allQns[i].title + '</span>'
			   +	'<span>' + allQns[i].endTime + '</span>'
			   +	'<span>' + allQns[i].status + '</span>'
			   +	'<button>编辑</button>'
			   +    '<button>删除</button>'
			   +	'<button>查看问卷</button>'
               +	'<button>查看数据</button>'
			   + '</div>';
               ihtml += aQn;
        }

        ihtml = '<div id="list-page">'
	    +   	'<div id="list-page-head">'
	    +		'<span>标题</span>'
	    +		'<span>时间</span>'
	    +		'<span>状态</span>'
	    +		'<span>操作</span>'
	    +		'<button>+新建问卷</button>'
	    +	'</div>'
	    +	'<div id="list-page-body">'
        +   ihtml		
	    +	'</div>'
	    +	'<div id="list-page-foot">'
        +		'<input type="checkbox">'
	    +		'<span>全选</span>'
	    +		'<button>删除</button>'
	    +	'</div>'
	    +	'</div>';

        main.innerHTML = ihtml;
        btnEvent();
        delAndAdd();
    }
    
    // 绑定右边按钮的事件
    var btnEvent = function() {
        var listItems = document.getElementById("list-page-body").childNodes;
        var allQns = Storage.getData().qn;
        var allTextareas = Storage.getData().textarea;
        var allCheckboxs = Storage.getData().checkbox;
        var allRadios = Storage.getData().radio;
        
        for (var i = 0, len = listItems.length; i < len; i++) {
            (function(i) {
                var btn1 = listItems[i].getElementsByTagName("button")[0];
                var btn2 = listItems[i].getElementsByTagName("button")[1];
                var btn3 = listItems[i].getElementsByTagName("button")[2];
                var btn4 = listItems[i].getElementsByTagName("button")[3];
                var title = listItems[i].getElementsByTagName("span")[0].innerHTML;
                // 在存储里找到该位置
                var obj = $.U.findObjectBy("title", allQns ,title);
                // 编辑按钮
                $.U.click(btn1, function() {
                    if (obj.objectIneed[0].status === "发布中" || obj.objectIneed[0].status === "已结束") {
                        var newDarken = Darken.out({
                            type: "confirm", 
                            title: "提示", 
                            content: "发布中或者已结束，无法编辑!", 
                            callback: function() {}
                        }); 
                        //alert("正在发布或者已经完成，无法编辑！");
                    } else {
                        window.location.hash = "#edit";
                        $.U.pos = obj.position[0];
                        var newEdit = new Edit.edit();
                    }
                });
                // 删除按钮
                $.U.click(btn2, function() {
                    var newDarken = Darken.out({
                        type: "confirm", 
                        title: "删除提示", 
                        content: "是否要删除" + title + "?", 
                        callback: function() {
                            deleteQn(obj.position[0], i);
                        }
                    }); 
                });
                // 查看问卷
                $.U.click(btn3, function() {
                    // 移动端
                    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i)) {
                        localStorage.pos = obj.position[0];                 
                    } 
                    
                    var popWatch = window.open("QN/index.html");
                    var setTime;
                    window.addEventListener("message", function(e) {
                        console.log(e.data)
                        if (e.origin === 'http://harveyprofile.tk') {
                            switch(e.data) {
                                case 'ready':
                                    // e.source 为发送的 window 对象
                                    // 这个win是不是本地的window，是那边的！
                                    //setTime = setTimeout(function(win) {
                                        e.source.postMessage(obj.position[0],'http://harveyprofile.tk');                     
                                    //}, 1, e.source);
                                    break;
                                case 'closed':
                                    clearTimeout(setTime);
                                    location.reload();
                                    break;
                            }
                        }
                    });
                });
                // 查看数据结果
                $.U.click(btn4, function() {
                    window.location.hash = "#result";
                    $.U.pos = obj.position[0];
                   Result.result();
                });
            })(i);
        }
    }
    
    // 删除逻辑
    var deleteQn = function(position, i) {
        var allQns = Storage.getData().qn;
        var allTextareas = Storage.getData().textarea;
        var allCheckboxs = Storage.getData().checkbox;
        var allRadios = Storage.getData().radio;
        var textareaShouldDel = allQns[position].textarea;
        var checkboxShouldDel = allQns[position].checkbox;
        var radioShouldDel = allQns[position].radio;
        var listItems = document.getElementById("list-page-body").childNodes;
        // 先删除dom节点
        listItems[i].parentNode.removeChild(listItems[i]);
        
        console.log(position)
        console.log(textareaShouldDel, checkboxShouldDel, radioShouldDel)
        console.log($.U.findObjectBy("id", allTextareas, 2))
        console.log(allTextareas)
        // 删除所有问卷中的textarea
        for (var i1 = 0; i1 < textareaShouldDel.length; i1++) {
            allTextareas.splice($.U.findObjectBy("id", allTextareas, textareaShouldDel[i1]).position[0], 1);
        }
        
        // 删除所有问卷中的checkbox
        for (var i2 = 0; i2 < checkboxShouldDel.length; i2++) {
            allCheckboxs.splice($.U.findObjectBy("id", allCheckboxs, checkboxShouldDel[i2]).position[0], 1);
        }
        // 删除所有问卷中的radio
        for (var i3 = 0; i3 < radioShouldDel.length; i3++) {
            allRadios.splice($.U.findObjectBy("id", allRadios, radioShouldDel[i3]).position[0], 1);
        }
        allQns.splice(position, 1);
        Storage.save({
            qn : allQns,
            textarea : allTextareas,
            checkbox : allCheckboxs,
            radio : allRadios
        });
    }
    
    // 绑定下面删除按钮的事件逻辑和上面的新建逻辑
    var delAndAdd = function() {
        var delBtn = $.U("#list-page-foot button");
        var addBtn = $.U("#list-page-head button");
        var main = $.U("#main");
        var allQns = Storage.getData().qn;
        var listItems = document.getElementById("list-page-body").childNodes;
        // 选择框
        var choose = main.getElementsByTagName("input");
        var chooseAll = choose[choose.length - 1];
        // 绑定大删除按钮
        $.U.click(delBtn, function() {
            // 每点击一次都要重新刷新一下
            var chooseLen = main.getElementsByTagName("input").length;
            allQns = Storage.getData().qn;
            console.log(chooseLen)
            for (var i = chooseLen - 2; i >= 0; i--) {
                // 用倒序循环的方式防止len的变化
                (function(i) {
                    if(choose[i].checked === true) {
                        var title = listItems[i].getElementsByTagName("span")[0].innerHTML;
                        // 在存储里找到该位置
                        var obj = $.U.findObjectBy("title", allQns ,title);
                        console.log(obj.position[0], i)
                        deleteQn(obj.position[0], i);
                    }
                })(i);  
            }
            btnEvent();
            delAndAdd();
        });
        $.U.click(addBtn, function() {
            window.location.hash = "#newbuild";
            var newB = new NewBuild.newBuild();
        });
        $.U.click(chooseAll, function() {
            if (chooseAll.checked === true) {
                for (var i = 0, len = choose.length; i < len - 1; i++) {
                    choose[i].checked = true;
                }
            } else {
                for (var i = 0, len = choose.length; i < len - 1; i++) {
                    choose[i].checked = false;
                }
            }
        });
    }

    // 返回函数，用于渲染页面
    return {
        listPage : listPage
    };
});