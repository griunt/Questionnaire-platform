require([
    'util',
    'storage'
], function($, Storage) {
    'use strict';
    
    var cus = function() {
        // 如果是移动设备而且还没跳转的时候，就跳转到相应的页面
        if (navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i) && !(/mobile/.test(location.href))) {
            location.href = "mobile.html";
        }
    };
    
    var getMessage = function() {
        
        // 加载完毕！
        window.opener.postMessage('ready', 'http://harveyprofile.tk'/*'http://localhost:3000'*/);
        
        // 接收数据
        window.addEventListener("message", function(e) {
            console.log(e.data);
            refresh(e.data);
        }, false);
        
        // 窗口已经关闭！
        window.addEventListener("unload", function(e) {
           e.currentTarget.opener.postMessage('closed', 'http://harveyprofile.tk'/*'http://localhost:3000'*/);
        }, false);
        
        setTimeout(function() {
            if (navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i)) {
                refresh(localStorage.pos);
            }
        }, 100); 
    }
    
    var refresh = function(pos) {
        var main = document.getElementById("main");
        var qn = Storage.getData().qn[pos];
        var allQuestions = init(qn);
        var ihtml = "";
        for (var i = 0, len = allQuestions.length; i < len; i++) {
            ihtml += generate(allQuestions[i]);
        }
        ihtml = 
        '<div id="new-build-qn">'
		+	'<div id="new-build-qn-head">'
		+		'<h3>' + qn.title + '</h3>'
		+	'</div>'
        +   '<div id="new-build-content">'
        +   ihtml
		+	'</div>'
		+	'<div id="new-build-result-foot">'
		+		'<button>提交</button>'
		+	'</div>'
        +   '</div>';
            
        main.innerHTML = ihtml;
        
        // 按logo和返回按键都会回到原本的页面
        var btn = document.getElementsByTagName("button")[0];
        var header = document.getElementsByTagName("header")[0];
        var h3 = header.getElementsByTagName("h3")[0];
        var h4 = header.getElementsByTagName("h4")[0];
        $.U.click(btn, function() {
            location.href = "../index.html";
        });
        $.U.click(h3, function() {
            location.href = "../index.html";
        });
        $.U.click(h4, function() {
            location.href = "../index.html";
        });
    }
     
    var generate = function(obj) {
        console.log(obj.type)
        var con = "";
        var check = ""; // 是否必要
        check = obj.necessary? "*": "";
        var option = "";
        var funcs = "";
        if(obj.type === "checkbox") {    
            // checkbox的情况
            for (var i = 0, len = obj.options.length; i < len; i++) {
                option += '<label for=""><input type="checkbox">' + obj.options[i] + '</label>';
            }
            con = 
            	'<h4>Q' + obj.order + " " + obj.title + '（多选题）' + check + '</h4>'
            +   option;
        } else if (obj.type === "radio") {
            // radio的情况
            for (var j = 0, len1 = obj.options.length; j < len1; j++) {
                option += '<label for=""><input type="radio" name="' + obj.order + '">' + obj.options[j] + '</label>';
            }
            con = 
            	'<h4>Q' + obj.order + " " + obj.title + '（单选题）' + check + '</h4>'
            +   option;   
        } else {
            // textarea的情况
			con = 
				'<h4>Q' + obj.order + " " + obj.title + '（文本题）' + check + '</h4>'
            +   '<textarea></textarea>';
        }
            
        con = '<div>' + con + '</div>';
            
        return con;
    }
        
    var init = function(qn) {
        var allQuestions = [];
        // 三个循环把要放进去的问题放进去
        if (qn.textarea !== [])
        {
           for(var i = 0, len = qn.textarea.length; i < len; i++) {
                allQuestions.push($.U.findObjectBy("id", Storage.getData().textarea, qn.textarea[i]).objectIneed[0]);
           }
        }
            
        if (qn.checkbox !== [])
        {
            for(var j = 0, len2 = qn.checkbox.length; j < len2; j++) {
                allQuestions.push($.U.findObjectBy("id", Storage.getData().checkbox, qn.checkbox[j]).objectIneed[0]);
            }
        }
            
        if (qn.radio !== [])
        {
            for(var k = 0, len3 = qn.radio.length; k < len3; k++) {
                allQuestions.push($.U.findObjectBy("id", Storage.getData().radio, qn.radio[k]).objectIneed[0]);
            }
        }
        
        // 对问题进行排序
        allQuestions.sort(function(obj1, obj2) {
            if (obj1.order < obj2.order) {
                return -1;
            } else {
                return 1;
            }
        });
        
        return allQuestions;
    }
                        
    cus();
    getMessage();

});