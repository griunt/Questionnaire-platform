define([
    'util'
],
function($) {
    'use strict';
    var mainBtn = document.getElementsByTagName("div")[0].getElementsByTagName("button")[0];
     
    // unexpected token {
    var out = function () {
        var type = arguments[0].type,
            title = arguments[0].title,
            content = arguments[0].content,
            callback = arguments[0].callback;
        var newO = new popOut({type:type, title:title, content:content, callback:callback});
        newO.poping();
    };  
     
    // 弹出窗口内容自定义
    var popOut = function() {
        var type = arguments[0].type,
            title = arguments[0].title,
            content = arguments[0].content,
            callback = arguments[0].callback;  // unexpected token {
        this.type = type; // 类型
        this.title = title; // 弹出框标题
        this.content = content; // 弹出框内容
        this.callback = callback; // prompt调用确认的回调
     };
     
     // 应对不同模式的选择
     popOut.prototype.poping = function() {
         
         // 先插入dom
         dom(this.title, this.content, this.type);
         
         var darken = document.getElementsByClassName("darken")[0];
         var btn1 = darken.getElementsByTagName("button")[0];
         var btn2 = darken.getElementsByTagName("button")[1];
         var darkB = darken.getElementsByTagName("div")[0];
         var input1 = darken.getElementsByTagName("input")[0];
         var input2 = darken.getElementsByTagName("input")[1];
         var x = darken.getElementsByTagName("b")[0];
         
         var scrollTop = document.body.scrollTop || document.documentElement.offsetTop;

         darken.style.top = scrollTop + "px";
         document.body.style.overflow = "hidden";
         
         var that = this;
         $.U.click(btn1, function() {       
             if (that.type === "confirm") {
                 that.callback();
             } else if (that.type === "textarea") {
                 that.callback(input1.value);
             } else {
                 that.callback(input1.value, input2.value);
             }
             document.body.style.overflow = "auto";
             rmv();
         });

         $.U.click(btn2, function() {
             document.body.style.overflow = "auto";
             rmv();
         })

         $.U.click(darkB, function() {
             document.body.style.overflow = "auto";
             rmv();
         })
         
         $.U.click(x, function() {
             document.body.style.overflow = "auto";
             rmv();
         })
     }
     
     // 弹出层的dom操作
     function dom(title, content, type) {
         var darken = document.createElement("div");
         darken.setAttribute("class", "darken");
         var ihtml =  '<div></div>' +
		              '<div class="float-out">' +
		              '<div>' + title + '<b>X</b></div>' +
			          '<div>' + 
				      '<p>' + content + '</p>';
                      
        if (type === "radio" || type === "checkbox") {
            ihtml = ihtml + '<label>输入题目标题<input type="text"></label>'
				          + '<label>输入选项<input type="text"></label>';
        } else if (type === "textarea") {
            ihtml = ihtml + '<label>输入题目标题<input type="text"></label>';
        }
        
        ihtml = ihtml + '</div>' +
			    '<div>' +
			    '<button>确认</button>' +
				'<button>取消</button>' +
			    '</div>';
         darken.innerHTML = ihtml;
         // requirejs是把其他js放在头的!重大发现！
         var scripts = document.body.getElementsByTagName("script");
         var script = scripts[scripts.length - 1]
         script.parentNode.insertBefore(darken, script);
     }
     
     // 移除弹出层
     function rmv() {
         var darken = document.getElementsByClassName("darken")[0];
         darken.parentNode.removeChild(darken);
     }
     
     return {
         out: out
     };
});