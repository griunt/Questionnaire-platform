define([
    "storage",
    'edit',
    "types",
    'util'
], function(Storage, Edit, T, $) {
    'use strict';
    var build = function() {
        $.U.iAmNew = true;
        refresh();
        btnEvent();
    };
    
    var refresh = function() {
        var main = $.U("#main");
        var ihtml = "";
        ihtml = 
          '<div id="new-build">' 
	    +	'<button>+ 新建问卷</button>'
	    + '</div>';
       
       main.innerHTML = ihtml;
    }
    
    var btnEvent = function() {
        var btn = $.U("#new-build button");
        $.U.click(btn, function() {
            var len = Storage.getData().qn.length;
            var now = new Date();
            var newE = new T.qns({
                title: "请在此输入名称" + (len + 1),
                endTime: now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate(),
                status: "未发布",
                textarea: [],
                radio: [],
                checkbox: []
            });
            console.log(newE)
            var qns = Storage.getData().qn;
            qns.push(newE);
            Storage.save({
                qn : qns,
                textarea : "not change",
                checkbox : "not change",
                radio : "not change"
            });
            console.log(newE)
            // 选定“数据库”最后一个
            $.U.pos = len;
            window.location.hash = "#edit";
        });
    }
    
    return {
        newBuild: build
    }
});